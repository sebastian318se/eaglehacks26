import main
import fakedata

def getFullData():

    fullData = {}

    sensorData = main.get_latest_reading()
    fillerData = fakedata.generateReading()

    fullData = {
        # unpack fake data
        **fillerData,
        "temperature_c": sensorData.get("temperature_c"),
        "humidity": sensorData.get("humidity")
    }

    return fullData