import keys
import json
import anthropic
from data import getFullData
from main import get_latest_reading, get_three_reading

SYSTEM_PROMPT = """Analyze the latest surgery room sensor readings (temperature, humidity, door_open, CO2, PM2.5, TVOC, pressure, light).
Compare against medical standards.
Return JSON with sterility_score, storage_score, compliance_score (0-100), alert (true if any parameter unsafe), and recommendations (list).
Only return valid JSON."""
 

def evaluateReading(sensorData):
    # Build full data dict
    data_dict = getFullData(sensorData)
 
    client = anthropic.Anthropic(
        api_key = keys.aikey
    )
 
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=300,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": f"Sensor data:\n{json.dumps(data_dict)}"
            }
        ]
    )
 
    output_text = response.content[0].text
 
    try:
        return json.loads(output_text)
    except json.JSONDecodeError:
        return {
            "error": "Invalid JSON returned by Claude",
            "raw_response": output_text
        }
 
 
if __name__ == "__main__":
    
    latestData = get_three_reading()

    averageKeys = ["temperature", "humidity", "co2_ppm", "pm25_ug_m3", "tvoc_ppb", "pressure_pa", "light_lux"]
    keepKeys = ["timestamp", "device_id", "door_open"]
    # Get average for three latest reading
    result = {}

    # average selected keys
    for k in averageKeys:
        result[k] = sum(r[k] for r in latestData) / len(latestData)

    # keep selected keys (usually from the latest reading)
    latest = latestData[-1]
    for k in keepKeys:
        result[k] += latest[k]

    evaluateReading(result)


