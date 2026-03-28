import { useState, useEffect } from "react";

const API = "http://localhost:8000";

export default function useSensorData() {
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch(`${API}/api/latest`);
        if (res.ok) setLatest(await res.json());
      } catch {
        // backend not reachable yet
      }
    }

    fetchLatest();
    const interval = setInterval(fetchLatest, 5000);
    return () => clearInterval(interval);
  }, []);

  return { latest };
}
