import { useNavigate } from "react-router-dom";
import { ShieldPlus, Thermometer, Sprout, FlaskConical } from "lucide-react";
import environments from "../config/environments";

const icons = {
  "sterile-storage":    ShieldPlus,
  "food-storage":       Thermometer,
  "greenhouse":         Sprout,
  "biotech-laboratory": FlaskConical,
};

const colors = {
  "sterile-storage":    { bg: "bg-blue-50",   icon: "text-blue-500",   border: "hover:border-blue-400",   badge: "bg-blue-100 text-blue-700" },
  "food-storage":       { bg: "bg-red-50", icon: "text-red-500",border: "hover:border-red-400",badge: "bg-red-100 text-red-700" },
  "greenhouse":         { bg: "bg-green-50",   icon: "text-green-600",  border: "hover:border-green-400",  badge: "bg-green-100 text-green-700" },
  "biotech-laboratory": { bg: "bg-amber-50",   icon: "text-amber-500",  border: "hover:border-amber-400",  badge: "bg-amber-100 text-amber-700" },
};

const API = "http://127.0.0.1:8000";

export default function EnvironmentSelect() {
  const navigate = useNavigate();

  async function handleSelect(envId) {
    await fetch(`${API}/api/environment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ environment: envId }),
    });
    navigate(`/dashboard/${envId}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">S</span>
        </div>
        <span className="text-slate-900 font-bold text-lg">Spacium<span className="text-blue-600">.AI</span></span>
      </nav>

      
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        <div className="max-w-2xl w-full">

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Select an Environment</h1>
            <p className="text-slate-500">Choose the space you want to monitor. Spacium.AI will track real-time conditions and generate AI-powered insights.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {environments.map((env) => {
              const color = colors[env.id] ?? { bg: "bg-slate-50", icon: "text-slate-500", border: "hover:border-slate-400", badge: "bg-slate-100 text-slate-700" };
              const Icon = icons[env.id];
              return (
                <button
                  key={env.id}
                  onClick={() => handleSelect(env.id)}
                  className={`group text-left p-6 bg-white border-2 border-slate-200 ${color.border} rounded-2xl shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  <div className={`w-16 h-16 ${color.bg} ${color.icon} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}>
                    {Icon && <Icon size={28} />}
                  </div>
                  <h2 className="text-base font-semibold text-slate-900 mb-1">{env.name}</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">{env.description}</p>
                  <div className={`inline-flex items-center gap-1 mt-4 text-xs font-medium px-2.5 py-1 rounded-full ${color.badge}`}>
                    {env.sensors.length} sensors
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
