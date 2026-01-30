import { useEffect, useState } from "react";
import { securedFetch } from "../../api/api";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { buildParams } from "../../api/buildParams";

const COLORS = [
  "#2563eb", "#16a34a", "#dc2626",
  "#9333ea", "#ea580c", "#0f766e"
];

export default function AdminCategoryAnalytics() {
  const [data, setData] = useState([]);

//   useEffect(() => {
// securedFetch(`/api/admin/analytics/category-summary?${buildParams()}`)
//       .then(setData)
//       .catch(console.error);
//   }, []);

useEffect(() => {
  securedFetch(
    `/api/admin/analytics/category-summary?${buildParams()}`
  )
    .then(setData)
    .catch(console.error);
}, []);


  if (!data.length) return <p>No category data available</p>;

  return (
    <div className="h-96 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">
        Expense Distribution by Category (All Users)
      </h2>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            label
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
