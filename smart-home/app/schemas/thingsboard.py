"""
Pydantic schemas for ThingsBoard API interactions.

These schemas define the structure of data exchanged with ThingsBoard,
providing validation and type safety.
"""

from typing import Dict, List, Optional, Literal
from pydantic import BaseModel, Field


class TelemetryValue(BaseModel):
    """Single telemetry data point"""
    ts: int = Field(..., description="Timestamp in milliseconds")
    value: str = Field(..., description="Telemetry value as string")


class LatestTelemetryResponse(BaseModel):
    """Response from get_latest_telemetry"""
    # Dynamic keys based on device telemetry
    # Example: {"temperature": [TelemetryValue], "humidity": [TelemetryValue]}
    __root__: Dict[str, List[TelemetryValue]]


class TelemetryHistoryResponse(BaseModel):
    """Response from get_telemetry_history"""
    # Dynamic keys based on requested telemetry keys
    __root__: Dict[str, List[TelemetryValue]]


class LightRPCRequest(BaseModel):
    """Request schema for light control RPC"""
    state: Literal["on", "off"] = Field(..., description="Light state")


class RPCPayload(BaseModel):
    """ThingsBoard RPC payload structure"""
    method: str = Field(..., description="RPC method name")
    params: Dict = Field(..., description="RPC parameters")
    timeout: int = Field(5000, description="RPC timeout in milliseconds")
