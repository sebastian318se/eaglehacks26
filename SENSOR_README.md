# 🌡️ Adafruit Trinkey SHT45 PTFE – Sensor Data Pipeline

## 📌 Overview
This project reads **temperature and humidity** data from an **Adafruit Trinkey SHT45 PTFE sensor**, streams it over serial, and forwards it to a backend API using a Python bridge.

---

## 🧰 Requirements

### Hardware
- Adafruit Trinkey SHT45 PTFE
- USB connection to computer

### Software
- Python 3.10+
- CircuitPython installed on the Trinkey

### Python Dependencies
```bash
pip install pyserial requests
```

---

## ⚙️ Step 1 – Install CircuitPython

1. Download CircuitPython for your board from Adafruit  
2. Plug in the Trinkey while holding the reset button  
3. Drag and drop the `.uf2` file onto the device  
4. The device should appear as `CIRCUITPY`

---

## 📦 Step 2 – Install Required Libraries

Download the **Adafruit CircuitPython Library Bundle** and copy these into the `lib/` folder:

- `adafruit_sht4x.mpy`
- `neopixel.mpy` (optional)

---

## 🧪 Step 3 – Sensor Code (`code.py`)

```python
import board
import adafruit_sht4x
import time

i2c = board.I2C()
sht = adafruit_sht4x.SHT4x(i2c)

while True:
    temperature, humidity = sht.measurements
    print(f"Temp: {temperature:.1f} Humidity: {humidity:.1f}%")
    time.sleep(5)
```

---

## 🔌 Step 4 – Find Serial Port

```bash
python -m serial.tools.list_ports
```

---

## 🔄 Step 5 – Python Bridge (`bridge.py`)

(See project files for full implementation)

---

## 🚀 Step 6 – Run the System

```bash
uvicorn main:app --reload
python bridge.py
```

---

## ✅ Expected Output

```
[SERIAL OK] Listening on COM9...
[SERIAL] Temp: 25.6 Humidity: 47.2%
[POST OK] 200
```

---

## 👩‍💻 Authors
- Livia Correia  
