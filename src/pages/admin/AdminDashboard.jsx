import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { securedFetch } from "../../api/api";
import { useDebounce } from "../../api/useDebounce";

const AdminDashboard = () => {
  // 👤 USERS
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");

  // 💳 TRANSACTIONS
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // 🔍 FILTERS
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    startDate: "",
    endDate: ""
  });

  // 🔀 SORTING
  const [sortBy, setSortBy] = useState("date");
  const [direction, setDirection] = useState("DESC");

  // 📊 TOTALS
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0
  });

  // 📈 CHART DATA
  const [chartData, setChartData] = useState([]);

  // 🔄 DEBOUNCE SEARCH
  const debouncedSearch = useDebounce(filters.search);

  /* =======================
       FETCH USERS
     ======================= */
  const fetchUsers = async () => {
    try {
      const data = await securedFetch("/api/admin/users");
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  /* =======================
       FETCH TRANSACTIONS
     ======================= */
  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams({
        page,
        size: 10,
        search: filters.search,
        type: filters.type,
        startDate: filters.startDate,
        endDate: filters.endDate,
        username,
        sortBy,
        direction
      });

      const data = await securedFetch(`/api/transactions/admin?${params.toString()}`);
      setTransactions(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  /* =======================
       FETCH SUMMARY
     ======================= */
  const fetchSummary = async () => {
    try {
      const data = await securedFetch("/api/transactions/admin/summary");
      setSummary(data);
    } catch (err) {
      console.error("Failed to fetch summary", err);
    }
  };

  /* =======================
       FETCH CHART DATA
       (Example: monthly totals)
     ======================= */
  const fetchChartData = async () => {
    try {
      const data = await securedFetch("/api/transactions/admin/chart");
      setChartData(data);
    } catch (err) {
      console.error("Failed to fetch chart data", err);
    }
  };

  /* =======================
       EFFECTS
     ======================= */
  useEffect(() => {
    fetchUsers();
    fetchSummary();
    fetchChartData();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page, username, debouncedSearch, filters.type, filters.startDate, filters.endDate, sortBy, direction]);

  /* =======================
       ACTIONS
     ======================= */
  const resetFilters = () => {
    setFilters({ search: "", type: "", startDate: "", endDate: "" });
    setUsername("");
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;

    await securedFetch(`/api/transactions/${id}`, { method: "DELETE" });
    fetchTransactions();
    fetchSummary();
    fetchChartData();
  };

  /* =======================
       UI
     ======================= */
  return (
    <div className="component-card">
      <h1>Admin Dashboard</h1>

      {/* 🔍 FILTER BAR */}
      <div className="filters">
        <input
          placeholder="Search description"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select value={username} onChange={(e) => { setUsername(e.target.value); setPage(0); }}>
          <option value="">All Users</option>
          {users.map((u) => (
            <option key={u.id} value={u.username}>{u.username}</option>
          ))}
        </select>

        <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option value="">All Types</option>
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>

        <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
        <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />

        <button onClick={() => { setPage(0); fetchTransactions(); }}>Apply</button>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="user.username">User</option>
        </select>

        <select value={direction} onChange={(e) => setDirection(e.target.value)}>
          <option value="DESC">Desc</option>
          <option value="ASC">Asc</option>
        </select>

        <button onClick={resetFilters}>Reset</button>
      </div>

      {/* 📊 TOTALS */}
      <div className="stats">
        <div className="card income">Income ₹{summary.totalIncome}</div>
        <div className="card expense">Expense ₹{summary.totalExpense}</div>
      </div>


      {/* 📄 TRANSACTION TABLE */}
      <table className="transaction-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>No transactions found</td>
            </tr>
          )}
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.user?.username}</td>
              <td>{tx.date}</td>
              <td>{tx.description}</td>
              <td>{tx.type}</td>
              <td>{tx.category?.name}</td>
              <td>₹{tx.amount}</td>
              <td>
                <button style={{ color: "red" }} onClick={() => handleDelete(tx.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ⏮ PAGINATION */}
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span>Page {page + 1} / {totalPages}</span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      {/* 📤 EXPORT */}
      <div style={{ marginTop: "20px" }}>
        <a href="/api/reports/transactions/csv" target="_blank" rel="noreferrer">
          <button>Export CSV</button>
        </a>
        <a href="/api/reports/transactions/pdf" target="_blank" rel="noreferrer">
          <button style={{ marginLeft: "10px" }}>Export PDF</button>
        </a>
      </div>
      <div className="export-actions">
  <a
    href="/api/reports/transactions/csv"
    target="_blank"
    rel="noreferrer"
    className="export-btn csv"
  >
    📄 CSV
  </a>

  <a
    href="/api/reports/transactions/pdf"
    target="_blank"
    rel="noreferrer"
    className="export-btn pdf"
  >
    📕 PDF
  </a>
</div>

    </div>
  );
};

export default AdminDashboard;
