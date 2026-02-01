import { useEffect, useState } from "react";
import api from "../../api/axios";
import MonthlyTrendChart from "./MonthlyTrendChart";
import CategoryPieChart from "./CategoryPieChart";
import "./AnalyticsPage.css";

export default function AnalyticsPage() {
  const [trend, setTrend] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const trendRes = await api.get(
      "/api/analytics/monthly-trend"
    );
    setTrend(trendRes.data);

    const catRes = await api.get(
      "/api/analytics/category-summary?startDate=2024-01-01&endDate=2024-12-31"
    );
    setCategories(catRes.data);
  };

  return (
    <div className="analytics-wrapper">
      <h2 className="analytics-title">📊 Analytics</h2>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3 className="analytics-card-title">
            Monthly Trend
          </h3>
          <MonthlyTrendChart data={trend} />
        </div>

        <div className="analytics-card">
          <h3 className="analytics-card-title">
            Category Split
          </h3>
          <CategoryPieChart data={categories} />
        </div>
      </div>
    </div>
  );
}
