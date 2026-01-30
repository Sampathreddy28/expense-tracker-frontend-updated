import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/api";
import "./SpendingInsights.css";

export default function SpendingInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/insights/monthly`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load insights");
      }

      const data = await response.json();
      setInsights(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading insights...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
  <div className="insights-wrapper">
    <h2 className="insights-title">🧠 AI Spending Insights</h2>

    {insights.length === 0 && (
      <p className="insights-empty">No insights available yet.</p>
    )}

    {insights.map((text, i) => (
      <div key={i} className="insight-card">
        {text}
      </div>
    ))}
  </div>
);
}