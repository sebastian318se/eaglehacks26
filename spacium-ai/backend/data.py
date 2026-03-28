import fakedata

def getFullData(sensorData):
    fillerData = fakedata.generateReading()

    return {
        **fillerData,
        "temperature": sensorData.temperature,
        "humidity": sensorData.humidity,
    }