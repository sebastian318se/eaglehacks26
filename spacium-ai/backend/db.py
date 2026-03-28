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

def insert_reading(sensor_data, ai_scores):
    # Insert sensor data into readings, get back the generated id
    reading_res = supabase.table("readings").insert(sensor_data).execute()
    reading_id = reading_res.data[0]["id"]

    # Insert AI scores into api_score linked to the reading
    supabase.table("api_score").insert({
        "reading_id": reading_id,
        **ai_scores
    }).execute()

def get_latest_readings(limit=3):
    response = supabase.table("readings") \
        .select("*, api_score(*)") \
        .order("timestamp", desc=True) \
        .limit(limit) \
        .execute()

    # Flatten api_score nested object into each row
    rows = []
    for row in reversed(response.data):
        scores = row.pop("api_score", [])
        if scores:
            row.update(scores[0])
        rows.append(row)

    return rows
