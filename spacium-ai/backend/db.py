import os
from supabase import create_client
import keys

SUPABASE_URL = keys.url
SUPABASE_KEY = keys.key
ANTHROPIC_KEY = keys.aikey

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
