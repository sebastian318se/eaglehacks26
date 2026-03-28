import { useState, useEffect } from "react";

const API = "http://127.0.0.1:8000";

export default function useSensorData() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`${API}/api/readings`);
        
        if (res.ok) setHistory(await res.json());
      } catch {
        // backend not reachable yet
      }
    }

    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);


  const latest = history.length > 0 ? history[history.length - 1] : null;
  alert(JSON.stringify(latest));

  return { history, latest };
}
