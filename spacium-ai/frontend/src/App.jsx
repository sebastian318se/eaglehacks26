import useSensorData from "./hooks/useSensorData";
import ScoreCard from "./components/ScoreCard";
import SensorTile from "./components/SensorTile";

export default function App() {

  const  latest  = {
    
      temperature_c: 22.5,
      humidity_pct: 45,
      co2_ppm: 800,
      pm25_ug_m3: 12,
      tvoc_ppb: 150,
      noise_db: 35,
      light_lux: 300,
      occupancy: 30,
      air_quality_score: 85,
      comfort_score: 90,
      focus_score: 80
  };

  //const latestAI = analyzeSensorData(latest);

    
  

  //const { latest } = useSensorData();

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-12 px-24">

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Spacium<span className="text-blue-400">.AI</span></h1>
        <p className="text-gray-400 text-sm mt-1">Indoor Environment Monitor</p>
      </header>

      {/* Score Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <ScoreCard label="Air Quality" score={latest?.air_quality_score} />
        <ScoreCard label="Comfort"     score={latest?.comfort_score} />
        <ScoreCard label="Focus"       score={latest?.focus_score} />
      </section>

      {/* Sensor Tiles */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <SensorTile label="Temperature" value={latest ? `${latest.temperature_c}°C` : null} />
        <SensorTile label="Humidity"    value={latest ? `${latest.humidity_pct}%` : null} />
        <SensorTile label="CO₂"         value={latest ? `${latest.co2_ppm} ppm` : null}   warn={latest?.co2_ppm > 1000} />
        <SensorTile label="PM2.5"       value={latest ? `${latest.pm25_ug_m3} µg/m³` : null} />
        <SensorTile label="TVOC"        value={latest ? `${latest.tvoc_ppb} ppb` : null} />
        <SensorTile label="Noise"       value={latest ? `${latest.noise_db} dB` : null} />
        <SensorTile label="Light"       value={latest ? `${latest.light_lux} lux` : null} />
        <SensorTile label="Occupancy"   value={latest ? (latest.occupancy) : null} />
      </section>

      {/* Trend Chart Placeholder */}
      <section className="bg-gray-900 rounded-2xl p-5 mb-8">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">Score Trends</p>
        <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
          Chart goes here
        </div>
      </section>

      {/* AI Summary Placeholder */}
      <section className="bg-gray-900 rounded-2xl p-5">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">AI Summary</p>
        <p className="text-gray-500 text-sm">Summary goes here</p>
      </section>

    </div>
  );
}
