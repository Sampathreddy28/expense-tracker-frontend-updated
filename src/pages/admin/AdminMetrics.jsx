const MetricCard = ({ title, value }) => (
  <div className="bg-white shadow rounded p-4">
    <p className="text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default function AdminMetrics({ metrics }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard title="Total Users" value={metrics.totalUsers} />
      <MetricCard title="Active Users" value={metrics.activeUsers} />
      <MetricCard title="Transactions" value={metrics.totalTransactions} />
      <MetricCard title="Income" value={metrics.totalIncome} />
      <MetricCard title="Expenses" value={metrics.totalExpenses} />
    </div>
  );
}
