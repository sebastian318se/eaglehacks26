# Spacium.AI
```
   /$$$$$$                                /$$                              /$$$$$$  /$$$$$$
 /$$__  $$                              |__/                             /$$__  $$|_  $$_/
| $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$$ /$$ /$$   /$$ /$$$$$$/$$$$     | $$  \ $$  | $$  
|  $$$$$$  /$$__  $$ |____  $$ /$$_____/| $$| $$  | $$| $$_  $$_  $$    | $$$$$$$$  | $$  
 \____  $$| $$  \ $$  /$$$$$$$| $$      | $$| $$  | $$| $$ \ $$ \ $$    | $$__  $$  | $$  
 /$$  \ $$| $$  | $$ /$$__  $$| $$      | $$| $$  | $$| $$ | $$ | $$    | $$  | $$  | $$  
|  $$$$$$/| $$$$$$$/|  $$$$$$$|  $$$$$$$| $$|  $$$$$$/| $$ | $$ | $$ /$$| $$  | $$ /$$$$$$
 \______/ | $$____/  \_______/ \_______/|__/ \______/ |__/ |__/ |__/|__/|__/  |__/|______/
          | $$                                                                            
          | $$                                                                            
          |__/                                                                                                                     
```                                  
## Project Overview

This project is an **environmental monitoring and analysis tool for surgery rooms**. It collects sensor data such as temperature, humidity, CO2, PM2.5, TVOC, pressure, and light, then:  

- Compares readings against medical/surgical standards  
- Calculates **sterility**, **storage**, and **compliance** scores  
- Flags unsafe conditions with **alerts**  
- Provides **actionable recommendations** for maintaining safe environmental conditions  
- Outputs results in **machine-readable JSON** suitable for dashboards, AI analysis, or alerting systems  

---

## Features

- **Real-time collection** of sensor data (temperature, humidity) + filler data  
- **Automatic calculation** of environmental scores (0–100)  
- **Safe thresholds detection** and alert system  
- **JSON output** for easy integration with back-end systems  
- **Handles missing or extra sensor fields** gracefully  
- **Supports multiple readings** for trend analysis  

---

## Tech Stack

- **Backend**: Python / FastAPI  
- **Database**: Supabase for storing sensor readings and AI analysis  
- **AI Analysis**: Claude for automated evaluation and recommendations  
- **Frontend**: React Dashboard for visualization (React)  
