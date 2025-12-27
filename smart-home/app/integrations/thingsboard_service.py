"""
ThingsBoard Integration Service

This service handles all communication with ThingsBoard platform:
- Authentication and JWT token management
- Telemetry data retrieval
- RPC (Remote Procedure Call) commands

Key Design Decisions:
1. JWT token is cached in memory with automatic refresh
2. All methods are async using httpx
3. No MQTT handling (ThingsBoard handles device communication)
4. No raw telemetry storage (ThingsBoard is the source of truth)
5. RPC commands are fire-and-forget (device reports state via telemetry)
"""

import asyncio
import time
from typing import Optional, Literal, Dict, Any
from datetime import datetime, timedelta
import httpx
from loguru import logger

from app.core.config import get_settings


class ThingsBoardError(Exception):
    """Custom exception for ThingsBoard-related errors"""
    pass


class ThingsBoardService:
    """
    Service for interacting with ThingsBoard platform.
    
    This service maintains a persistent connection and manages JWT tokens
    automatically. It provides methods for telemetry retrieval and RPC control.
    
    Architecture:
    - Singleton-like pattern (one instance per application)
    - Thread-safe token refresh using asyncio locks
    - Automatic token refresh before expiration
    - Retry logic for transient failures
    """
    
    def __init__(self):
        self.settings = get_settings()
        self._client: Optional[httpx.AsyncClient] = None
        self._token: Optional[str] = None
        self._token_expires_at: Optional[float] = None
        self._token_lock = asyncio.Lock()
        
        # Base URL for ThingsBoard API
        self._base_url = self.settings.thingsboard_url.rstrip('/')
        
    async def _get_client(self) -> httpx.AsyncClient:
        """
        Get or create async HTTP client.
        Reuses the same client for connection pooling.
        """
        if self._client is None:
            self._client = httpx.AsyncClient(
                timeout=self.settings.thingsboard_timeout,
                follow_redirects=True
            )
        return self._client
    
    async def _authenticate(self) -> str:
        """
        Authenticate with ThingsBoard and get JWT token.
        
        Returns:
            JWT token string
            
        Raises:
            ThingsBoardError: If authentication fails
        """
        client = await self._get_client()
        
        auth_url = f"{self._base_url}/api/auth/login"
        payload = {
            "username": self.settings.thingsboard_username,
            "password": self.settings.thingsboard_password
        }
        
        try:
            logger.info("Authenticating with ThingsBoard...")
            response = await client.post(auth_url, json=payload)
            response.raise_for_status()
            
            data = response.json()
            token = data.get("token")
            
            if not token:
                raise ThingsBoardError("No token in authentication response")
            
            # ThingsBoard tokens typically expire in 9 hours (32400 seconds)
            # We'll assume 9 hours if not specified
            expires_in = 32400  # 9 hours in seconds
            self._token_expires_at = time.time() + expires_in
            
            logger.info("Successfully authenticated with ThingsBoard")
            return token
            
        except httpx.HTTPStatusError as e:
            logger.error(f"Authentication failed: {e.response.status_code} - {e.response.text}")
            raise ThingsBoardError(f"Authentication failed: {e.response.status_code}")
        except httpx.RequestError as e:
            logger.error(f"Network error during authentication: {str(e)}")
            raise ThingsBoardError(f"Network error: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error during authentication: {str(e)}")
            raise ThingsBoardError(f"Authentication error: {str(e)}")
    
    async def _refresh_token_if_needed(self) -> None:
        """
        Check if token needs refresh and refresh if necessary.
        
        Token is refreshed if:
        - No token exists
        - Token is expired
        - Token will expire within the refresh margin (default 5 minutes)
        
        This method is thread-safe using asyncio locks.
        """
        async with self._token_lock:
            current_time = time.time()
            refresh_margin = self.settings.thingsboard_token_refresh_margin
            
            # Check if token needs refresh
            needs_refresh = (
                self._token is None or
                self._token_expires_at is None or
                current_time >= (self._token_expires_at - refresh_margin)
            )
            
            if needs_refresh:
                logger.info("Token refresh needed, authenticating...")
                self._token = await self._authenticate()
    
    async def _make_request(
        self,
        method: str,
        endpoint: str,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Make authenticated request to ThingsBoard API.
        
        Args:
            method: HTTP method (GET, POST, etc.)
            endpoint: API endpoint (without base URL)
            **kwargs: Additional arguments for httpx request
            
        Returns:
            Response JSON data
            
        Raises:
            ThingsBoardError: If request fails
        """
        await self._refresh_token_if_needed()
        
        client = await self._get_client()
        url = f"{self._base_url}{endpoint}"
        
        # Add authorization header
        headers = kwargs.pop("headers", {})
        headers["X-Authorization"] = f"Bearer {self._token}"
        
        # Retry logic for transient failures
        max_retries = self.settings.thingsboard_max_retries
        retry_delay = self.settings.thingsboard_retry_delay
        
        for attempt in range(max_retries):
            try:
                response = await client.request(
                    method=method,
                    url=url,
                    headers=headers,
                    **kwargs
                )
                response.raise_for_status()
                
                # Some endpoints return empty responses
                if response.content:
                    return response.json()
                return {}
                
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 401:
                    # Token might be invalid, force refresh and retry once
                    logger.warning("Received 401, forcing token refresh...")
                    async with self._token_lock:
                        self._token = None
                    await self._refresh_token_if_needed()
                    continue
                    
                logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
                raise ThingsBoardError(f"HTTP {e.response.status_code}: {e.response.text}")
                
            except httpx.RequestError as e:
                if attempt < max_retries - 1:
                    logger.warning(f"Request failed (attempt {attempt + 1}/{max_retries}), retrying...")
                    await asyncio.sleep(retry_delay * (attempt + 1))
                    continue
                logger.error(f"Network error after {max_retries} attempts: {str(e)}")
                raise ThingsBoardError(f"Network error: {str(e)}")
                
        raise ThingsBoardError("Max retries exceeded")
    
    # ==========================================
    # Public API Methods
    # ==========================================
    
    async def get_latest_telemetry(self, device_id: str) -> Dict[str, Any]:
        """
        Get latest telemetry data for a device.
        
        This retrieves the most recent values for all telemetry keys
        reported by the device (e.g., temperature, humidity, light state).
        
        Args:
            device_id: ThingsBoard device ID (UUID)
            
        Returns:
            Dictionary with telemetry keys and their latest values
            Example: {
                "temperature": [{"ts": 1234567890, "value": "25.5"}],
                "humidity": [{"ts": 1234567890, "value": "60"}],
                "light": [{"ts": 1234567890, "value": "on"}]
            }
            
        Raises:
            ThingsBoardError: If request fails
        """
        endpoint = f"/api/plugins/telemetry/DEVICE/{device_id}/values/timeseries"
        
        logger.info(f"Fetching latest telemetry for device {device_id}")
        data = await self._make_request("GET", endpoint)
        
        return data
    
    async def get_telemetry_history(
        self,
        device_id: str,
        start_ts: int,
        end_ts: int,
        keys: Optional[str] = None,
        limit: int = 100
    ) -> Dict[str, Any]:
        """
        Get historical telemetry data for a device.
        
        Args:
            device_id: ThingsBoard device ID (UUID)
            start_ts: Start timestamp in milliseconds
            end_ts: End timestamp in milliseconds
            keys: Comma-separated telemetry keys (e.g., "temperature,humidity")
                  If None, returns all keys
            limit: Maximum number of data points per key (default: 100)
            
        Returns:
            Dictionary with telemetry keys and their historical values
            Example: {
                "temperature": [
                    {"ts": 1234567890, "value": "25.5"},
                    {"ts": 1234567900, "value": "25.6"}
                ]
            }
            
        Raises:
            ThingsBoardError: If request fails
        """
        endpoint = f"/api/plugins/telemetry/DEVICE/{device_id}/values/timeseries"
        
        params = {
            "startTs": start_ts,
            "endTs": end_ts,
            "limit": limit
        }
        
        if keys:
            params["keys"] = keys
        
        logger.info(
            f"Fetching telemetry history for device {device_id} "
            f"from {start_ts} to {end_ts}"
        )
        
        data = await self._make_request("GET", endpoint, params=params)
        return data
    
    async def send_light_rpc(
        self,
        device_id: str,
        state: Literal["on", "off"]
    ) -> None:
        """
        Send RPC command to control device light.
        
        IMPORTANT: This is a fire-and-forget command. The method does NOT
        wait for confirmation from the device. The actual light state should
        be verified by reading telemetry data, as the device reports its
        actual state via telemetry.
        
        RPC Flow:
        1. Backend sends RPC command to ThingsBoard
        2. ThingsBoard forwards to ESP32 (if online)
        3. ESP32 processes command and updates light
        4. ESP32 reports actual state via telemetry
        5. Backend reads telemetry to verify state
        
        Args:
            device_id: ThingsBoard device ID (UUID)
            state: Light state - either "on" or "off"
            
        Raises:
            ThingsBoardError: If RPC request fails
            ValueError: If state is not "on" or "off"
        """
        if state not in ("on", "off"):
            raise ValueError(f"Invalid light state: {state}. Must be 'on' or 'off'")
        
        endpoint = f"/api/plugins/rpc/twoway/{device_id}"
        
        # RPC payload as specified in requirements
        payload = {
            "method": "setLight",
            "params": {
                "state": state
            },
            "timeout": 5000  # 5 seconds timeout for RPC
        }
        
        logger.info(f"Sending light RPC to device {device_id}: state={state}")
        
        try:
            await self._make_request("POST", endpoint, json=payload)
            logger.info(f"Light RPC sent successfully to device {device_id}")
        except ThingsBoardError as e:
            logger.error(f"Failed to send light RPC to device {device_id}: {str(e)}")
            raise
    
    async def close(self) -> None:
        """
        Close the HTTP client and cleanup resources.
        Should be called when shutting down the application.
        """
        if self._client:
            await self._client.aclose()
            self._client = None
            logger.info("ThingsBoard service closed")


# Singleton instance
_thingsboard_service: Optional[ThingsBoardService] = None


def get_thingsboard_service() -> ThingsBoardService:
    """
    Get singleton instance of ThingsBoardService.
    
    This ensures only one service instance exists per application,
    which is important for token caching and connection pooling.
    
    Usage in FastAPI:
        from fastapi import Depends
        
        @app.get("/telemetry")
        async def get_telemetry(
            tb_service: ThingsBoardService = Depends(get_thingsboard_service)
        ):
            data = await tb_service.get_latest_telemetry(device_id)
            return data
    """
    global _thingsboard_service
    if _thingsboard_service is None:
        _thingsboard_service = ThingsBoardService()
    return _thingsboard_service
