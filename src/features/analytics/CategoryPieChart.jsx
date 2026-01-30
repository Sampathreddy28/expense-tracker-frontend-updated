import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#2563eb", "#22c55e", "#f97316", "#ef4444", "#8b5cf6"];

export default function CategoryPieChart({ data }) {
  return (
    <div className="component-card">
      <h3>Category Distribution</h3>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="totalAmount"
              nameKey="categoryName"
              outerRadius={110}
              label
            >
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
