import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from data import getFullData
from db import insert_readings
from analysis import evaluateReading, sendReading

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

readings = []
pending_db_reads = []

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
    pending_db_reads.append(fullReading)

    inserted_count = 0
    if len(pending_db_reads) >= 3:
        batch = pending_db_reads[:3]

        readingEval = sendReading(batch)
        print(f"Claude evaluation: {readingEval}")

        for r in batch:
            r.update(readingEval)

        insert_readings(batch)
        del pending_db_reads[:3]
        inserted_count = len(batch)

    print("Received:", reading)
    return {
        "status": "ok",
        "message": "Data received",
        "buffered_for_db": len(pending_db_reads),
        "inserted_count": inserted_count,
    }

@app.get("/api/readings/latest")
def get_latest_reading():
    if not readings:
        return {"status": "error", "message": "No readings available"}
    return readings[-1]

@app.get("/api/readings")
def get_all_readings():
    return readings
