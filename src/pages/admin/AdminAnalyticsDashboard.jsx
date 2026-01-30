import { useEffect, useState } from "react";

/* API */
import { securedFetch } from "../../api/api";

/* CHARTS */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";


const COLORS = ["#2563eb", "#16a34a", "#dc2626"];

export default function AdminAnalyticsDashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    securedFetch("/api/admin/metrics")
      .then(setMetrics)
      .catch(console.error);
  }, []);

  if (!metrics) return <p>Loading analytics...</p>;

  const userData = [
    { name: "Active", value: metrics.activeUsers },
    { name: "Inactive", value: metrics.totalUsers - metrics.activeUsers }
  ];

  const financeData = [
    { name: "Income", value: metrics.totalIncome },
    { name: "Expenses", value: metrics.totalExpenses }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Analytics</h1>

      {/* USERS PIE */}
      <div className="h-72 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">User Status</h2>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={userData}
              dataKey="value"
              nameKey="name"
              label
            >
              {userData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* FINANCIAL BAR */}
      <div className="h-72 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Income vs Expenses</h2>
        <ResponsiveContainer>
          <BarChart data={financeData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* 📊 ANALYSIS */}
<div className="analysis-section">
  <h2>Monthly Transaction Analysis</h2>
  <div style={{ display: "flex", justifyContent: "center" }}>
    <LineChart width={700} height={350} data={chartData}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line dataKey="income" stroke="#4CAF50" name="Income" />
      <Line dataKey="expense" stroke="#F44336" name="Expense" />
    </LineChart>
  </div>
</div>

    </div>
  );
}
