import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def insert_readings(readings):
    response = supabase.table("readings") \
        .insert(readings) \
        .execute()

    return response.data

def get_reading():
    data = supabase.table("environment_readings") \
        .select("*") \
        .order("timestamp") \
        .execute()

    return data.data
