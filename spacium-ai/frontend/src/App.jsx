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
        <ScoreCard label="Sterility"          score={latest?.air_quality_score} />
        <ScoreCard label="Storage Conditions" score={latest?.comfort_score} />
        <ScoreCard label="Compliance"         score={latest?.focus_score} />
      </section>

      {/* Sensor Tiles */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <SensorTile label="Temperature"  value={latest ? `${latest.temperature}°C / ${temperature_f}°F` : null} warn={latest?.temperature < 18 || latest?.temperature > 25} />
        <SensorTile label="Humidity"     value={latest ? `${latest.humidity}%` : null}                        warn={latest?.humidity < 30 || latest?.humidity > 60} />
        <SensorTile label="PM2.5"        value={latest ? `${latest.pm25_ug_m3} µg/m³` : null}                    warn={latest?.pm25_ug_m3 > 10} />
        <SensorTile label="TVOC"         value={latest ? `${latest.tvoc_ppb} ppb` : null}                        warn={latest?.tvoc_ppb > 200} />
        <SensorTile label="CO₂"          value={latest ? `${latest.co2_ppm} ppm` : null}                         warn={latest?.co2_ppm > 1000} />
        <SensorTile label="Light"        value={latest ? `${latest.light_lux} lux` : null}                       warn={latest?.light_lux > 300} />
        <SensorTile label="Pressure"     value={latest ? `+${latest.pressure_pa} Pa` : null}                     warn={latest?.pressure_pa < 8} />
        <SensorTile label="Door"         value={latest ? (latest.door_open ? "Open" : "Closed") : null}          warn={latest?.door_open} />
      </section>

      {/* Trend Chart */}
      <section className="bg-gray-900 rounded-2xl p-5 mb-8">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">Score Trends</p>
        <div className="h-48">
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
