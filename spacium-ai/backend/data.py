import fakedata

def getFullData(sensorData, environmental_type):
    fillerData = fakedata.generateReading(environmental_type)

    return {
        **fillerData,
        "temperature": sensorData.temperature,
        "humidity": sensorData.humidity,
    }