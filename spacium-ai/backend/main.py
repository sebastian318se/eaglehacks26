from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from data import getFullData

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

readings = []

class SensorReading(BaseModel):
    device_id: str
    temperature: float
    humidity: float
    timestamp: str

@app.get("/")
def root():
    return {"message": "Welcome to the Spacium AI API"}

@app.post("/api/readings")
def receive_reading(reading: SensorReading):
    fullReading = getFullData(reading)
    readings.append(fullReading)

    print("Received:", reading)
    return {
        "status": "ok",
        "message": "Data received"
    }

@app.get("/api/readings/latest")
def get_latest_reading():
    if not readings:
        return {"status": "error", "message": "No readings available"}
    return readings[-1]

@app.get("/api/readings")
def get_all_readings():
    return readings
