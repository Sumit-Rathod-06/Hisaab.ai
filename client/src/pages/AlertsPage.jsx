import { useEffect, useState } from "react";
import AlertCard from "../components/Alerts/AlertsCards";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/finance/alerts"
        );

        console.log("Fetch response:", response);

        if (!response.ok) {
          throw new Error("Failed to fetch alerts");
        }

        const data = await response.json();

        // ✅ IMPORTANT: backend returns { alerts: [...] }
        setAlerts(data.alerts || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load alerts");
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading AI alerts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🚨 Smart Alerts</h1>

      {alerts.length === 0 ? (
        <p className="text-gray-500">
          No alerts at the moment 🎉
        </p>
      ) : (
        <div className="grid gap-6">
          {alerts.map((alert) => (
            <AlertCard key={alert.alert_id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
