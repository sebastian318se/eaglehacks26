import { useState, useEffect } from "react";

const API = "http://127.0.0.1:8000";

export default function useSensorData(environmentId) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const params = new URLSearchParams({ limit: "3" });
        if (environmentId) params.set("environment", environmentId);

        const res = await fetch(`${API}/api/history?${params.toString()}`);
        if (res.ok) setHistory(await res.json());
      } catch {
        // backend not reachable yet
      }
    }

    setHistory([]);
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, [environmentId]);

  const latest = history.length > 0 ? history[history.length - 1] : null;

  return { history, latest };
}
