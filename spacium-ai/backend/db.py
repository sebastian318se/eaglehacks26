import os
from supabase import create_client
# import keys
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

# SUPABASE_URL = keys.url
# SUPABASE_KEY = keys.key

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

APP_ENVIRONMENT_TO_DB_NAME = {
    "sterile-storage": "sterile_storage",
    "greenhouse": "greenhouse",
    "biotech-laboratory": "laboratory",
    "food-storage": "food_storage",
}

DB_NAME_TO_APP_ENVIRONMENT = {
    value: key for key, value in APP_ENVIRONMENT_TO_DB_NAME.items()
}

APP_ENVIRONMENT_TO_ID = {
    "sterile-storage": 1,
    "greenhouse": 2,
    "biotech-laboratory": 3,
    "food-storage": 4,
}

READINGS_COLUMNS = {
    "timestamp",
    "temperature",
    "humidity",
    "co2_ppm",
    "pm25_ug_m3",
    "tvoc_ppb",
    "light_lux",
    "pressure_pa",
    "door_open",
    "pm1_ug_m3",
    "pm10_ug_m3",
    "co_ppm",
    "o3_ppb",
    "no2_ppb",
    "noise_level_db",
    "airflow_rate_ms",
    "occupancy",
    "uv_index",
    "environmental_type_id",
}

API_SCORE_COLUMNS = {
    "reading_id",
    "sterility_score",
    "storage_score",
    "compliance_score",
    "alert",
    "recommendation",
}


def get_environmental_type_id(environment_name):
    environment_id = APP_ENVIRONMENT_TO_ID.get(environment_name)
    if environment_id is None:
        raise ValueError(f"Unknown environmental type: {environment_name}")
    return environment_id


def build_readings_payload(sensor_data):
    payload = {key: value for key, value in sensor_data.items() if key in READINGS_COLUMNS}
    payload["environmental_type_id"] = get_environmental_type_id(sensor_data["environment"])

    # Match the integer column types in Supabase for the few discrete sensors.
    if payload.get("occupancy") is not None:
        payload["occupancy"] = int(round(payload["occupancy"]))
    if payload.get("uv_index") is not None:
        payload["uv_index"] = int(round(payload["uv_index"]))

    return payload


def build_ai_score_payload(reading_id, ai_scores):
    payload = {key: value for key, value in ai_scores.items() if key in API_SCORE_COLUMNS}
    payload["reading_id"] = reading_id
    return payload


def insert_reading(sensor_data, ai_scores):
    reading_payload = build_readings_payload(sensor_data)

    # Insert sensor data into readings, get back the generated id
    reading_res = supabase.table("readings").insert(reading_payload).execute()
    reading_id = reading_res.data[0]["id"]

    # Insert AI scores into api_score linked to the reading
    ai_payload = build_ai_score_payload(reading_id, ai_scores)
    if len(ai_payload) > 1:
        supabase.table("api_score").insert(ai_payload).execute()

    return reading_id

def get_latest_readings(limit=3, environment_name=None):
    query = (
        supabase.table("readings")
        .select("*, api_score(*), environmental_type(name)")
        .order("timestamp", desc=True)
        .limit(limit)
    )

    if environment_name:
        query = query.eq("environmental_type_id", get_environmental_type_id(environment_name))

    response = query.execute()

    # Flatten api_score nested object into each row
    rows = []
    for row in reversed(response.data):
        scores = row.pop("api_score", [])
        environmental_type = row.pop("environmental_type", None)
        if environmental_type:
            db_environment_name = environmental_type["name"]
            row["environment"] = DB_NAME_TO_APP_ENVIRONMENT.get(
                db_environment_name, db_environment_name
            )
        if scores:
            row.update(scores[0])
        rows.append(row)

    return rows
