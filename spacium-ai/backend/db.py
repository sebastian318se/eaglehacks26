import keys
from supabase import create_client

url = keys.url
key = keys.key

supabase = create_client(url, key)

def get_reading():
    data = supabase.table("environment_readings") \
        .select("*") \
        .order("timestamp") \
        .execute()

    return data.data