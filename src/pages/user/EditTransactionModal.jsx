import React, { useEffect, useState } from "react";
import { securedFetch } from "../../api/api";
import "./EditTransactionModal.css";

const EditTransactionModal = ({ open, transaction, onClose, onUpdated }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!transaction) return;

    securedFetch("/api/categories").then(cats => {
      setCategories(cats);

      const filtered = cats.filter(c => c.type === transaction.type);

      setForm({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        categoryId:
          transaction.category?.id ||
          filtered[0]?.id || "", // ✅ AUTO-SELECT
        date: transaction.date
      });
    });
  }, [transaction]);

  if (!open || !form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.categoryId) {
      alert("Please select a category");
      return;
    }

    setLoading(true);

    await securedFetch(`/api/transactions/${transaction.id}`, {
      method: "PUT",
      body: JSON.stringify({
        description: form.description,
        amount: Number(form.amount),
        type: form.type,
        categoryId: Number(form.categoryId), // ✅ GUARANTEED
        date: form.date
      })
    });

    setLoading(false);
    onUpdated();
    onClose();
  };

  return (
   <div className="modal-backdrop" onClick={onClose}>
  <div className="modal" onClick={(e) => e.stopPropagation()}>

        <h3>Edit Transaction</h3>

        <input
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
        />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>

        {/* ✅ REQUIRED CATEGORY */}
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories
            .filter(c => c.type === form.type)
            .map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;
