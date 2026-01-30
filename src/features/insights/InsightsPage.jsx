import { useEffect, useState } from "react";
import { securedFetch } from "../../api/api";
import "./InsightsPage.css";

export default function InsightsPage() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const data = await securedFetch("/api/insights/monthly");
      setInsights(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="insights-card">
      <h2 className="insights-title">Spending Insights</h2>

      {insights.length === 0 ? (
        <p className="insights-empty">No insights available yet.</p>
      ) : (
        <ul className="insights-list">
          {insights.map((i, idx) => (
            <li className="insights-item" key={idx}>
              ✅ {i}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
