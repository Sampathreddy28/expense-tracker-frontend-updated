import "./CategoryPieChart.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f97316"];

export default function CategoryPieChart({ data }) {
  return (
    <div className="pie-card">
      <h3 className="pie-title">Category Wise Spending</h3>

      <div className="pie-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="amount" nameKey="category" label>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
