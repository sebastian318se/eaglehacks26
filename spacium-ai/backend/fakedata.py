from datetime import datetime
import random

safe_ranges = {
    "co2_ppm": (400, 800),
    "pm1_ug_m3": (0, 10),
    "pm25_ug_m3": (0, 12),
    "pm10_ug_m3": (0, 20),
    "tvoc_ppb": (0, 220),
    "co_ppm": (0, 9),
    "o3_ppb": (0, 50),
    "no2_ppb": (0, 53),
    "pressure_pa": (1008, 1015),
    "light_lux": (300, 800),
    "noise_level_db": (30, 50),
    "airflow_rate_ms": (0.15, 0.5),
    "occupancy": (0, 7),
    "uv_index": (0, 2),
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
    "uv_index": [(3, 11)],
}

ALL_SENSOR_KEYS = [
    "co2_ppm",
    "pm1_ug_m3",
    "pm25_ug_m3",
    "pm10_ug_m3",
    "tvoc_ppb",
    "co_ppm",
    "o3_ppb",
    "no2_ppb",
    "pressure_pa",
    "light_lux",
    "noise_level_db",
    "airflow_rate_ms",
    "occupancy",
    "uv_index",
]

ENVIRONMENT_SENSORS = {
    "sterile-storage": [
        "co2_ppm",
        "pm25_ug_m3",
        "pressure_pa",
        "light_lux",
        "tvoc_ppb",
    ],
    "food-storage": [
        "co2_ppm",
        "co_ppm",
        "tvoc_ppb",
        "pm10_ug_m3",
        "airflow_rate_ms",
    ],
    "greenhouse": [
        "co2_ppm",
        "light_lux",
        "uv_index",
        "airflow_rate_ms",
        "tvoc_ppb",
    ],
    "biotech-laboratory": [
        "co2_ppm",
        "tvoc_ppb",
        "no2_ppb",
        "o3_ppb",
        "pm1_ug_m3",
        "pressure_pa",
    ],
}

ENVIRONMENT_ALIASES = {
    "sterile_storage": "sterile-storage",
    "food_storage": "food-storage",
    "laboratory": "biotech-laboratory",
}


def normalize_environment(environmental_type):
    normalized = (environmental_type or "sterile-storage").strip().lower()
    return ENVIRONMENT_ALIASES.get(normalized, normalized)


def odds(sensor):
    bad_data = random.random() < 0.15

    if bad_data:
        low, high = random.choice(bad_ranges[sensor])
    else:
        low, high = safe_ranges[sensor]

    return round(random.uniform(low, high), 1)


def generateReading(environmental_type):
    environment_id = normalize_environment(environmental_type)
    active_sensors = ENVIRONMENT_SENSORS.get(
        environment_id, ENVIRONMENT_SENSORS["sterile-storage"]
    )

    reading = {
        "timestamp": datetime.now().isoformat(),
        "environment": environment_id,
        "door_open": random.random() < 0.1,
    }

    for sensor_key in ALL_SENSOR_KEYS:
        reading[sensor_key] = odds(sensor_key) if sensor_key in active_sensors else None

    return reading
