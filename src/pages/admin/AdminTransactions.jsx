import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchTransactions = async () => {
    const params = new URLSearchParams({
      page,
      size: 10,
      search
    });

    const res = await api.get(
      `/api/transactions/admin?${params}`
    );

    setTransactions(res.data.content || []);
    setTotalPages(res.data.totalPages || 1);
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?"))
      return;

    await api.delete(`/api/transactions/${id}`);
    fetchTransactions();
  };

  return (
    <div className="component-card">
      <h2>Admin – All Transactions</h2>

      {/* SEARCH */}
      <input
        placeholder="Search description"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
      />

      <button onClick={fetchTransactions}>
        Search
      </button>

      {/* TABLE */}
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
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.user?.username}</td>
              <td>{tx.date}</td>
              <td>{tx.description}</td>
              <td>{tx.type}</td>
              <td>{tx.category?.name}</td>
              <td>₹{tx.amount}</td>
              <td>
                <button
                  style={{ color: "red" }}
                  onClick={() =>
                    handleDelete(tx.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>
          Page {page + 1} / {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminTransactions;
