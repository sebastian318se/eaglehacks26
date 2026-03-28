from datetime import datetime
import random

safe_ranges = {
    "co2_ppm": (400, 800),          # Carbon dioxide
    "pm1_ug_m3": (0, 10),           # Ultrafine particles
    "pm25_ug_m3": (0, 12),          # Fine particles
    "pm10_ug_m3": (0, 20),          # Large particles
    "tvoc_ppb": (0, 220),           # Gas residure
    "co_ppm": (0, 9),               # Carbon monoxide
    "o3_ppb": (0, 50),              # Ozone concentration 
    "no2_ppb": (0, 53),             # Nitrogen dioxide
    "pressure_pa": (1008, 1015),    # Air pressure
    "light_lux": (300, 800),        # Illumination level 
    "noise_level_db": (30, 50),     # Ambient sound level
    "airflow_rate_ms": (0.15, 0.5), # Airflow velocity 
    "occupancy": (0, 7),            
    "uv_index": (0, 2)              # UV reading
}

bad_ranges = {
    "co2_ppm": [(801, 2000)],
    "pm1_ug_m3": [(11, 50)], 
    "pm25_ug_m3": [(13, 60), (61, 100)],
    "pm10_ug_m3": [(21, 150)],
    "tvoc_ppb": [(221, 2000)],
    "co_ppm": [(10, 100)],
    "o3_ppb": [(51, 200)],
    "no2_ppb": [(54, 200)],
    "pressure_pa": [(950, 1007), (1016, 1050)],
    "light_lux": [(0, 299), (801, 2000)],
    "noise_level_db": [(51, 120)],
    "airflow_rate_ms": [(0.0, 0.14), (0.51, 0.8)],
    "occupancy": [(8, 99)],
    "uv_index": [(3, 11)]
}

def odds(sensor):

    bad_data = random.random() < 0.15 # 15% chance of incorrect reading

    # Fetch limits per sensor for either situation
    if bad_data:
        low, high = random.choice(bad_ranges[sensor])
    else:

        low, high = safe_ranges[sensor]

    # Fetch random value within bounds
    return round(random.uniform(low, high), 1)

def generateReading():

    reading = {
        "timestamp" :datetime.now().isoformat(),
        "co2_ppm" : odds("co2_ppm"),
        "co_ppm" : odds("co_ppm"),
        "o3_ppm" : odds("03_ppm"),
        "no2_pbb" : odds("no2_pbb"),
        "pm1_ug_m3" : odds("pm1_ug_m3"),
        "pm25_ug_m3" : odds("pm25_ug_m3"),
        "pm10_ug_m3" : odds("pm10_ug_m3"),
        "tvoc_ppb" : odds("tvoc_ppb"),
        "light_lux" : odds("light_lux"),
        "door_open" : random.choice([True, False]),
        "pressure_pa" : odds("pressure_pa"),
        "noise_level_db" : odds("noise_level_db"),
        "airflow_rate_ms" : odds("airflow_rate_ms"),
        "occupancy" : odds("occupancy"),
        "uv_index" : odds("uv_index")
    }

    return reading