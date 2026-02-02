import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import EditTransactionModal from "./EditTransactionModal";
import ReportsPage from "../../components/PDFReportGenerator";
import "./TransactionHistory.css";

const TransactionHistory = ({ refreshTrigger }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editingTx, setEditingTx] = useState(null);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    categoryId: "",
    startDate: "",
    endDate: ""
  });

  const resetFilters = () => {
    setFilters({
      search: "",
      type: "",
      categoryId: "",
      startDate: "",
      endDate: ""
    });
    setPage(0);
  };

  useEffect(() => {
    api.get("/api/categories")
       .then(res => setCategories(res.data));
  }, []);

  const fetchData = async () => {
    const params = new URLSearchParams({
      page,
      size: 5,
      ...filters
    });

    const res = await api.get(
      `/api/transactions?${params}`
    );

    setTransactions(res.data.content || []);
    setTotalPages(res.data.totalPages || 1);
  };

  useEffect(() => {
    fetchData();
  }, [page, refreshTrigger, filters]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;

    await api.delete(`/api/transactions/${id}`);
    fetchData();
  };

  return (
    <div className="component-card">
      <h3>Transactions</h3>

      {/* 🔍 FILTERS */}
      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search description"
          value={filters.search}
          onChange={handleFilterChange}
        />

        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
        >
          <option value="">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>

        <select
          name="categoryId"
          value={filters.categoryId}
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />

        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />

        <button onClick={fetchData}>Apply</button>

        <button
          onClick={resetFilters}
          className="reset-btn"
        >
          Reset
        </button>
      </div>

      {/* 📄 TABLE */}
      {/* ===== DESKTOP TABLE ===== */}
<div className="table-wrapper">
  <table className="transaction-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Type</th>
        <th>Amount</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {transactions.map(tx => (
        <tr key={tx.id}>
          <td>{tx.date}</td>
          <td>{tx.description}</td>
          <td>{tx.type}</td>
          <td>₹{tx.amount}</td>
          <td>
            <button onClick={() => setEditingTx(tx)}>✏️</button>

            <button
              style={{ color: "red", marginLeft: "6px" }}
              onClick={() => handleDelete(tx.id)}
            >
              🗑
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* ===== MOBILE CARDS ===== */}
<div className="transaction-cards">
  {transactions.map(tx => (
    <div key={tx.id} className="tx-card">
      <div className="tx-row">
        <span>{tx.description}</span>
        <strong>₹{tx.amount}</strong>
      </div>

      <div className="tx-row small">
        <span>{tx.date}</span>
        <span>{tx.type}</span>
      </div>

      <div className="tx-actions">
        <button onClick={() => setEditingTx(tx)}>Edit</button>
        <button
          className="danger"
          onClick={() => handleDelete(tx.id)}
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>


      {/* ⏮ PAGINATION */}
      <div className="pagination">
        <button
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
        >
          Prev
        </button>

        <span>
          Page {page + 1} / {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>

      {/* ✏️ EDIT MODAL */}
      <EditTransactionModal
        open={!!editingTx}
        transaction={editingTx}
        onClose={() => setEditingTx(null)}
        onUpdated={() => {
          setEditingTx(null);
          fetchData();
        }}
      />

      {/* 📊 REPORTS */}
      <div className="reports-box">
        <p className="reports-title">Reports</p>
        <ReportsPage />
      </div>
    </div>
  );
};

export default TransactionHistory;
