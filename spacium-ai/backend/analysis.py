import os
import json
import anthropic
# from dotenv import load_dotenv
import keys

# load_dotenv()

# ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_KEY = keys.aikey


SYSTEM_PROMPT = """You are a environment analyst. You will receive average sensor readings from a predefined location.  
Based on the location type, evaluate the readings against that field's top standards and return ONLY a valid JSON object with exactly this structure, no extra text:
  {'"sterility_score": <integer 0-100>,  
    "storage_score": <integer 0-100>,  
    "compliance_score":
    <integer 0-100>,   
    "alert": <true or false>,   
    "recommendation": "<single string with your recommendation>" }  
    Scoring guide: - sterility_score: based on relevant parameters from dataset - storage_score: based on temperature (ideal 18-25C) and humidity (ideal 30-60%). Penalize values outside range. - compliance_score: overall compliance. 
    Set alert to true if any parameter is outside safe range or door is open.
    recommendation: one concise sentence describing the most important action to take. A second concise sentence for the implications the problem could lead to.  Return only the JSON. No markdown, no explanation."""
 

def evaluateReading(sensorData, environment_type):
    # Build full data dict
    data_dict = sensorData
 
    client = anthropic.Anthropic(
        api_key = ANTHROPIC_KEY
    )
 
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=400,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": (
                    f"Environment type: {environment_type}\n"
                    f"Sensor data:\n{json.dumps(data_dict)}"
                )
            }
        ]
    )

    output_text = response.content[0].text.strip()

    # Strip markdown fences if present
    if output_text.startswith("```"):
        output_text = output_text.split("```")[1]
        if output_text.startswith("json"):
            output_text = output_text[4:]
        output_text = output_text.strip()

    try:
        return json.loads(output_text)
    except json.JSONDecodeError:
        print("Raw Claude response:", output_text)
        return {
            "error": "Invalid JSON returned by Claude",
            "raw_response": output_text
        }
 
 
def sendReading(latest_readings, environment_type):
    sensor_data = {}
    numeric_keys = set()

    for reading in latest_readings:
        for key, value in reading.items():
            if isinstance(value, (int, float)) and not isinstance(value, bool):
                numeric_keys.add(key)

    for key in sorted(numeric_keys):
        values = [
            reading[key]
            for reading in latest_readings
            if reading.get(key) is not None and isinstance(reading.get(key), (int, float))
        ]
        if values:
            sensor_data[key] = round(sum(values) / len(values), 2)

    sensor_data["device_id"] = latest_readings[-1].get("device_id")
    sensor_data["timestamp"] = latest_readings[-1].get("timestamp")
    sensor_data["environment"] = environment_type
    sensor_data["door_open"] = any(reading.get("door_open", False) for reading in latest_readings)

    ai_result = evaluateReading(sensor_data, environment_type)

    # Convert recommendations list to a single string if needed
    if isinstance(ai_result.get("recommendations"), list):
        ai_result["recommendation"] = " | ".join(ai_result.pop("recommendations"))
    elif "recommendations" in ai_result:
        ai_result["recommendation"] = ai_result.pop("recommendations")

    return sensor_data, ai_result