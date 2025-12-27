"""
Example usage of ThingsBoardService.

This demonstrates how to use the ThingsBoard integration service
for telemetry retrieval and RPC control.

NOTE: This is for testing/demonstration purposes only.
In production, these methods should be called from API routers.
"""

import asyncio
from datetime import datetime, timedelta
from app.integrations.thingsboard_service import get_thingsboard_service, ThingsBoardError


async def example_get_latest_telemetry():
    """Example: Get latest telemetry from a device"""
    tb_service = get_thingsboard_service()
    
    # Replace with actual ThingsBoard device ID
    device_id = "your-device-id-here"
    
    try:
        telemetry = await tb_service.get_latest_telemetry(device_id)
        print("Latest Telemetry:")
        print(telemetry)
        
        # Example output:
        # {
        #     "temperature": [{"ts": 1234567890, "value": "25.5"}],
        #     "humidity": [{"ts": 1234567890, "value": "60"}],
        #     "light": [{"ts": 1234567890, "value": "on"}]
        # }
        
    except ThingsBoardError as e:
        print(f"Error fetching telemetry: {e}")


async def example_get_telemetry_history():
    """Example: Get historical telemetry data"""
    tb_service = get_thingsboard_service()
    
    device_id = "your-device-id-here"
    
    # Get data from last 24 hours
    end_time = datetime.now()
    start_time = end_time - timedelta(hours=24)
    
    # Convert to milliseconds (ThingsBoard uses milliseconds)
    start_ts = int(start_time.timestamp() * 1000)
    end_ts = int(end_time.timestamp() * 1000)
    
    try:
        history = await tb_service.get_telemetry_history(
            device_id=device_id,
            start_ts=start_ts,
            end_ts=end_ts,
            keys="temperature,humidity",  # Optional: specific keys
            limit=100
        )
        print("Telemetry History:")
        print(history)
        
    except ThingsBoardError as e:
        print(f"Error fetching history: {e}")


async def example_control_light():
    """Example: Control device light via RPC"""
    tb_service = get_thingsboard_service()
    
    device_id = "your-device-id-here"
    
    try:
        # Turn light ON
        print("Turning light ON...")
        await tb_service.send_light_rpc(device_id, "on")
        print("RPC command sent (light ON)")
        
        # Wait a bit
        await asyncio.sleep(5)
        
        # Turn light OFF
        print("Turning light OFF...")
        await tb_service.send_light_rpc(device_id, "off")
        print("RPC command sent (light OFF)")
        
        # IMPORTANT: The actual light state should be verified
        # by reading telemetry, not by assuming RPC success
        print("\nVerifying actual state via telemetry...")
        await asyncio.sleep(2)  # Give device time to report
        
        telemetry = await tb_service.get_latest_telemetry(device_id)
        if "light" in telemetry:
            actual_state = telemetry["light"][0]["value"]
            print(f"Actual light state: {actual_state}")
        
    except ThingsBoardError as e:
        print(f"Error controlling light: {e}")
    except ValueError as e:
        print(f"Invalid state: {e}")


async def example_full_workflow():
    """Example: Complete workflow with error handling"""
    tb_service = get_thingsboard_service()
    
    device_id = "your-device-id-here"
    
    try:
        # 1. Check current state
        print("=== Checking current state ===")
        telemetry = await tb_service.get_latest_telemetry(device_id)
        print(f"Current telemetry: {telemetry}")
        
        # 2. Send RPC command
        print("\n=== Sending RPC command ===")
        await tb_service.send_light_rpc(device_id, "on")
        print("RPC sent successfully")
        
        # 3. Wait and verify
        print("\n=== Waiting for device to process ===")
        await asyncio.sleep(3)
        
        print("\n=== Verifying new state ===")
        new_telemetry = await tb_service.get_latest_telemetry(device_id)
        print(f"New telemetry: {new_telemetry}")
        
        # 4. Get historical data
        print("\n=== Fetching history ===")
        end_ts = int(datetime.now().timestamp() * 1000)
        start_ts = end_ts - (3600 * 1000)  # Last hour
        
        history = await tb_service.get_telemetry_history(
            device_id=device_id,
            start_ts=start_ts,
            end_ts=end_ts,
            limit=10
        )
        print(f"Recent history: {history}")
        
    except ThingsBoardError as e:
        print(f"ThingsBoard error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        # Cleanup
        await tb_service.close()


async def main():
    """Run examples"""
    print("ThingsBoard Service Examples\n")
    
    # Uncomment the example you want to run:
    
    # await example_get_latest_telemetry()
    # await example_get_telemetry_history()
    # await example_control_light()
    await example_full_workflow()


if __name__ == "__main__":
    # Run the async main function
    asyncio.run(main())
