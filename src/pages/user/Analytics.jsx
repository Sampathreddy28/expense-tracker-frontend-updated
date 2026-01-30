import React, { useEffect, useState } from "react";
import { securedFetch } from "../../api/api";

/* Charts */
import CategoryPieChart from "../../components/charts/CategoryPieChart";
import MonthlyBarChart from "../../components/charts/MonthlyBarChart";

const Analytics = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const categoryRes = await securedFetch(
          "/api/transactions/summary/category"
        );

        const monthlyRes = await securedFetch(
          "/api/transactions/summary/monthly"
        );

        setCategoryData(categoryRes);
        setMonthlyData(monthlyRes);
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
  <div className="page-wrapper">
    <h2 className="page-title">Analytics</h2>

    <div className="analytics-section">
      <h3 className="section-title">Expenses by Category</h3>
      <CategoryPieChart data={categoryData} />
    </div>

    <div className="analytics-section">
      <h3 className="section-title">Monthly Expenses</h3>
      <MonthlyBarChart data={monthlyData} />
    </div>
  </div>
);
};
export default Analytics;
