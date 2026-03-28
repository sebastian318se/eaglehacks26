from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from data import getFullData
from db import insert_reading, get_latest_readings
from analysis import sendReading

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

pending = []

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
    pending.append(fullReading)

    if len(pending) >= 3:
        batch = pending[:3]
        del pending[:3]

        sensor_data, ai_scores = sendReading(batch)
        print(f"Claude evaluation: {ai_scores}")

        insert_reading(sensor_data, ai_scores)

    return {"status": "ok", "buffered": len(pending)}

@app.get("/api/history")
def get_history(limit: int = 3):
    return get_latest_readings(limit)
