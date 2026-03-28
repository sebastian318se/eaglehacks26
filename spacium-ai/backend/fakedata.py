from datetime import datetime
import random

safe_ranges = {
    "co2_ppm" : (400, 800),
    "pm25_ug_m3" : (0, 12),
    "tvoc_ppb" : (0, 220),
    "pressure_pa" : (1008, 1015),
    "light_lux" : (300, 800)
}

bad_ranges = {
    "co2_ppm" : [(801, 2000)],
    "pm25_ug_m3" : [(0, 39), (61, 100)],
    "tvoc_ppb" : [(221, 2000)],
    "pressure_pa" : [(950, 1007), (1016, 1050)],
    "light_lux" : [(0, 299), (801, 200)]
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
        "pm25_ug_m3" : odds("pm25_ug_m3"),
        "tvoc_ppb" : odds("tvoc_ppb"),
        "light_lux" : odds("light_lux"),
        "door_open" : random.choice([True, False])
    }

    return reading
print(generateReading())