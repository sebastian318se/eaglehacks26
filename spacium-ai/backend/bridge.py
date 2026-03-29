import re
import time
import serial
import requests
from datetime import datetime

COM_PORT = "COM11"
BAUD_RATE = 115200
API_URL = "http://127.0.0.1:8000/api/readings"
DEVICE_ID = "trinkey-sht45-01"

pattern = re.compile(r"Temp:\s*([0-9.]+)\s*Humidity:\s*([0-9.]+)%")

def post_reading(payload):
    try:
        response = requests.post(API_URL, json=payload, timeout=5)
        print(f"[POST OK] {response.status_code} {response.text}")
        response.close()
        return True
    except requests.exceptions.RequestException as e:
        print(f"[POST ERROR] {e}")
        return False

def open_serial():
    while True:
        try:
            ser = serial.Serial(COM_PORT, BAUD_RATE, timeout=1)
            time.sleep(2)
            print(f"[SERIAL OK] Listening on {COM_PORT}...")
            return ser
        except serial.SerialException as e:
            print(f"[SERIAL ERROR] {e}")
            print(f"[RETRY] Trying again in 3 seconds...")
            time.sleep(3)
    
def main():
    ser = open_serial()
    while True:
        raw = ser.readline()
        print(f"[RAW] {raw!r}")

        line = raw.decode("utf-8", errors="ignore").strip()

        if not line:
            continue

        print(f"[SERIAL] {line}")

        match = pattern.search(line)
        if not match:
            print("[SKIP] Line did not match expected format")
            continue

        temperature = float(match.group(1))
        humidity = float(match.group(2))

        payload = {
            "device_id": DEVICE_ID,
            "temperature": temperature,
            "humidity": humidity,
            "timestamp": datetime.now().isoformat()
        }

        print(f"[PAYLOAD] {payload}")
        post_reading(payload)

if __name__ == "__main__":
    main()