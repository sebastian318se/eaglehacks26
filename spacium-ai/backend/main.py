from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from data import getFullData
from db import insert_reading, get_latest_readings
from analysis import sendReading
from fakedata import normalize_environment

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

pending = []
current_environment = "sterile-storage"

class SensorReading(BaseModel):
    device_id: str
    temperature: float
    humidity: float
    timestamp: str

class EnvironmentUpdate(BaseModel):
    environment: str

@app.get("/")
def root():
    return {"message": "Welcome to the Spacium AI API"}

@app.post("/api/environment")
def set_environment(body: EnvironmentUpdate):
    global current_environment, pending
    current_environment = normalize_environment(body.environment)
    pending.clear()
    print(f"Environment set to: {current_environment}")
    return {"status": "ok", "environment": current_environment}

@app.post("/api/readings")
def receive_reading(reading: SensorReading):
    environment_type = normalize_environment(current_environment)
    fullReading = getFullData(reading, environment_type)
    pending.append(fullReading)
    print({"environment": environment_type})

    if len(pending) >= 3:
        batch = pending[:3]
        del pending[:3]

        sensor_data = {}
        ai_scores = {}

        try:
            sensor_data, ai_scores = sendReading(batch, environment_type)
            print(f"Claude evaluation: {ai_scores}")
        except Exception as exc:
            latest = batch[-1]
            sensor_data = {
                key: value
                for key, value in latest.items()
                if key != "environment"
            }
            sensor_data["environment"] = environment_type
            ai_scores = {
                "alert": False,
                "recommendation": f"AI analysis unavailable: {exc}",
            }
            print(f"AI evaluation failed: {exc}")

        try:
            reading_id = insert_reading(sensor_data, ai_scores)
            print(f"Saved reading to database: {reading_id}")
        except Exception as exc:
            print(f"Database insert failed: {exc}")
            raise HTTPException(status_code=500, detail=str(exc))

    return {"status": "ok", "buffered": len(pending)}

@app.get("/api/history")
def get_history(limit: int = 3, environment: str | None = None):
    selected_environment = normalize_environment(environment) if environment else None
    return get_latest_readings(limit, selected_environment)
