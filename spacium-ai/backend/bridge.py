import re
import time
import serial
import requests
from datetime import datetime

COM_PORT = "COM9"
BAUD_RATE = 115200
API_URL = "http://127.0.0.1:8000/api/readings"

pattern = re.compile(r"Temp:\s*([0-9.]+)\s*°C\s*Humidity:\s*([0-9.]+)%")

def main():
    ser = serial.Serial(COM_PORT, BAUD_RATE, timeout=1)
    time.sleep(2)

    print(f"Listening on {COM_PORT}...")

    while True:
        line = ser.readline().decode("utf-8", errors="ignore").strip()

        if not line:
            continue

        print("Serial:", line)

        match = pattern.search(line)
        if not match:
            continue

        temperature = float(match.group(1))
        humidity = float(match.group(2))

        payload = {
            "device_id": "trinkey-sht45-01",
            "temperature": temperature,
            "humidity": humidity,
            "co2": 0,
            "timestamp": datetime.now().isoformat()
        }

        try:
            response = requests.post(API_URL, json=payload, timeout=5)
            print("POST:", response.status_code, response.text)
        except Exception as e:
            print("POST error:", e)

if __name__ == "__main__":
    main()