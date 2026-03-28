import serial
import time

ser = serial.Serial("COM9", 115200, timeout=2)
time.sleep(2)

while True:
    data = ser.read(100)
    print(repr(data))
    time.sleep(1)