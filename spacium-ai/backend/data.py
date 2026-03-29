import fakedata

def getFullData(sensorData, environmental_type):
    fillerData = fakedata.generateReading(environmental_type)

    return {
        **fillerData,
        "device_id": sensorData.device_id,
        "temperature": sensorData.temperature,
        "humidity": sensorData.humidity,
        "timestamp": sensorData.timestamp,
    }
