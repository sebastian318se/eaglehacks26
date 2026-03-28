import useSensorData from "./hooks/useSensorData";
import ScoreCard from "./components/ScoreCard";
import SensorTile from "./components/SensorTile";
import TrendChart from "./components/TrendChart";
import AISummary from "./components/AISummary";

export default function App() {

  // const mockHistory = [
  //   { temperature_c: 20.0, humidity_pct: 52, co2_ppm: 680,  pm25_ug_m3: 4,  tvoc_ppb: 90,  light_lux: 180, pressure_pa: 12, door_open: false, air_quality_score: 91, comfort_score: 88, focus_score: 90 },
  //   { temperature_c: 21.5, humidity_pct: 58, co2_ppm: 820,  pm25_ug_m3: 7,  tvoc_ppb: 140, light_lux: 220, pressure_pa: 9,  door_open: true,  air_quality_score: 78, comfort_score: 74, focus_score: 75 },
  //   { temperature_c: 22.0, humidity_pct: 62, co2_ppm: 950,  pm25_ug_m3: 11, tvoc_ppb: 210, light_lux: 390, pressure_pa: 6,  door_open: true,  air_quality_score: 65, comfort_score: 60, focus_score: 62 },
  // ];

  const { history: mockHistory, latest } = useSensorData();
  // const latest = mockHistory[mockHistory.length - 1];
  const temperature_f = latest ? (latest.temperature * 9/5 + 32).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-12 px-24">

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-5xl font-bold tracking-tight">Spacium<span className="text-blue-400">.AI</span></h1>
        <p className="text-gray-400 text-lg mt-3">Surgical Storage Environment Monitor</p>
      </header>

      {/* Score Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <ScoreCard label="Sterility"          score={latest?.air_quality_score} info="Composite score (0–100) based on CO₂, PM2.5, and TVOC levels. Reflects the risk of airborne contamination for stored surgical items." />
        <ScoreCard label="Storage Conditions" score={latest?.comfort_score}     info="Composite score (0–100) based on temperature and humidity. Surgical items require 18–25°C and 30–60% RH to preserve sterility and prevent corrosion." />
        <ScoreCard label="Compliance"         score={latest?.focus_score}       info="Composite score (0–100) combining all environmental factors. Indicates whether the storage room meets recommended standards for surgical item preservation." />
      </section>

      {/* Sensor Tiles */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <SensorTile label="Temperature"  value={latest ? `${latest.temperature}°C / ${temperature_f}°F` : null} warn={latest?.temperature < 18 || latest?.temperature > 25} info="Ideal range: 18–25°C. Temperatures outside this range can degrade packaging, adhesives, and sterile barriers of surgical instruments." />
        <SensorTile label="Humidity"     value={latest ? `${latest.humidity}%` : null}   warn={latest?.humidity < 30 || latest?.humidity > 60}  info="Ideal range: 30–60% RH. High humidity promotes microbial growth and corrosion. Low humidity causes static buildup and packaging brittleness." />
        <SensorTile label="PM2.5"        value={latest ? `${latest.pm25_ug_m3} µg/m³` : null} warn={latest?.pm25_ug_m3 > 10}                    info="Fine particulate matter (≤2.5µm). Warn threshold: >10 µg/m³. Particles can settle on sterile packaging and compromise instrument integrity." />
        <SensorTile label="TVOC"         value={latest ? `${latest.tvoc_ppb} ppb` : null}     warn={latest?.tvoc_ppb > 200}                      info="Total Volatile Organic Compounds. Warn threshold: >200 ppb. Elevated VOCs may indicate chemical off-gassing that can react with sterile materials." />
        <SensorTile label="CO₂"          value={latest ? `${latest.co2_ppm} ppm` : null}      warn={latest?.co2_ppm > 1000}                      info="Carbon dioxide concentration. Warn threshold: >1000 ppm. High CO₂ signals poor ventilation, increasing the risk of airborne contamination." />
        <SensorTile label="Light"        value={latest ? `${latest.light_lux} lux` : null}    warn={latest?.light_lux > 300}                     info="Illuminance level. Warn threshold: >300 lux. Prolonged light exposure, especially UV, can degrade plastics, rubber components, and sterile packaging." />
        <SensorTile label="Pressure"     value={latest ? `+${latest.pressure_pa} Pa` : null}  warn={latest?.pressure_pa < 8}                     info="Differential air pressure relative to adjacent areas. Warn threshold: <8 Pa. Positive pressure prevents unfiltered air and contaminants from entering the storage room." />
        <SensorTile label="Door"         value={latest ? (latest.door_open ? "Open" : "Closed") : null} warn={latest?.door_open}                  info="Storage room door status. An open door breaks the positive pressure barrier, allowing uncontrolled airflow and potential contamination of stored items." />
      </section>

      {/* Trend Chart */}
      <section className="bg-gray-900 rounded-2xl p-5 mb-8">
        <div className="h-56">
          <TrendChart history={mockHistory} />
        </div>
      </section>

      {/* AI Summary */}
      <section className="bg-gray-900 rounded-2xl p-5">
        <AISummary history={mockHistory} />
      </section>

    </div>
  );
}
