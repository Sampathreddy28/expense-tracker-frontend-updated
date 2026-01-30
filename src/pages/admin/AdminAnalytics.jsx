import { useEffect, useState } from "react";
import { securedFetch } from "../../api/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#9333ea"];

export default function AdminAnalytics() {
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [username, setUsername] = useState("");
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });

  // Helper to build URL params
  const buildParams = () => {
    const params = new URLSearchParams();
    if (username) params.append("username", username);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    return params.toString();
  };

  useEffect(() => {
    // Monthly bar chart
securedFetch(`/api/admin/analytics/monthly-trend?${buildParams()}`)
      .then(setMonthly)
      .catch(console.error);

    // Category pie chart
    securedFetch(`/api/admin/analytics/category-summary`)
      .then(setCategories)
      .catch(console.error);

    // Income vs Expense line chart
    securedFetch("/api/admin/analytics/income-expense")
  .then(setChartData)
  .catch(console.error);

  }, [username, filters.startDate, filters.endDate]);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Monthly Trend */}
      <div className="bg-white p-4 rounded shadow h-72">
        <h3 className="font-semibold mb-2">Monthly Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthly}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution */}
      <div className="bg-white p-4 rounded shadow h-72">
        <h3 className="font-semibold mb-2">Category Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              dataKey="amount"
              nameKey="category"
              outerRadius={80}
              label
            >
              {categories.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Income vs Expense Line Chart */}
      <div className="bg-white p-4 rounded shadow col-span-2 h-72">
        <h3 className="font-semibold mb-2">Income vs Expense</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="income" stroke="#4CAF50" name="Income" />
            <Line dataKey="expense" stroke="#F44336" name="Expense" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
