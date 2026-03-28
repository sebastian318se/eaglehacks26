import os
import json
import anthropic
from dotenv import load_dotenv
# import keys

load_dotenv()

ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY")
# ANTHROPIC_KEY = keys.aikey


SYSTEM_PROMPT = """You are an environment analyst. You will receive averaged sensor readings from a room that will be picked by the user.

Evaluate the readings against the standards of this specific environment chosen by the user and return ONLY a valid JSON object with exactly this structure, no extra text:

{
  "sterility_score": <integer 0-100>,
  "storage_score": <integer 0-100>,
  "compliance_score": <integer 0-100>,
  "alert": <true or false>,
  "recommendation": "<single string with your recommendation>"
}

Scoring guide:
- sterility_score: based on relevant parameters from dataset
- storage_score: based on temperature (ideal 18-25C) and humidity (ideal 30-60%). Penalize values outside range.
- compliance_score: overall compliance. Set alert to true if any parameter is outside safe range or door is open.
- recommendation: one concise sentence describing the most important action to take.

Return only the JSON. No markdown, no explanation."""
 

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
                "content": f"Sensor data:\n{json.dumps(data_dict)}"
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
    averageKeys = ["temperature", "humidity", "co2_ppm", "pm25_ug_m3", "tvoc_ppb", "pressure_pa", "light_lux"]

    sensor_data = {}
    for k in averageKeys:
        sensor_data[k] = round(sum(r[k] for r in latest_readings) / len(latest_readings), 2)
    sensor_data["door_open"] = latest_readings[-1]["door_open"]

    ai_result = evaluateReading(sensor_data, environment_type)

    # Convert recommendations list to a single string if needed
    if isinstance(ai_result.get("recommendations"), list):
        ai_result["recommendation"] = " | ".join(ai_result.pop("recommendations"))
    elif "recommendations" in ai_result:
        ai_result["recommendation"] = ai_result.pop("recommendations")

    return sensor_data, ai_result




