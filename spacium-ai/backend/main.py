from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class SensorReading(BaseModel):
    device_id: str
    temperature: float
    humidity: float
    co2: float
    timestamp: str

@app.get("/")
def root():
    return {"message": "Welcome to the Spacium AI API"}

@app.post("/api/readings")
def receive_reading(reading: SensorReading):
    print("Received:", reading)

    return {
        "status": "ok",
        "message": "Data received"
    }

