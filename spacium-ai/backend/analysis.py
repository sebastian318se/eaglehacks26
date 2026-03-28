from datetime import datetime
import json
import keys

aiapi = keys.aikey

prompt = """Analyze the latest surgery storage sensor readings (temperature, humidity, door_open, CO2, PM2.5, TVOC, pressure, light). 
Compare against medical standards. 
Return JSON with sterility_score, storage_score, compliance_score (0-100), alert (true if any parameter unsafe), and recommendations (list). 
Handle missing or extra fields gracefully. Only return valid JSON."""