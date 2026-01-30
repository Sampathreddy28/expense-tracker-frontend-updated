import React, { useEffect, useState } from "react";
import { securedFetch } from "../../api/api";

const EditTransactionModal = ({ open, transaction, onClose, onUpdated }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!transaction) return;

    setForm({
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      categoryId: transaction.category?.id || "",
      date: transaction.date
    });

    securedFetch("/api/categories").then(setCategories);
  }, [transaction]);

  if (!open || !form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
  // 🔥 HARD STOP if missing
  if (!form.categoryId || Number(form.categoryId) <= 0) {
    alert("Please select a category");
    return;
  }

  const payload = {
    description: form.description,
    amount: Number(form.amount),
    type: form.type,
    categoryId: Number(form.categoryId), // ✅ GUARANTEED
    date: form.date
  };

  console.log("UPDATE PAYLOAD 👉", payload); // 🔍 DEBUG

  await securedFetch(`/api/transactions/${transaction.id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

  onUpdated();
  onClose();
};


    setLoading(true);

    await securedFetch(`/api/transactions/${transaction.id}`, {
      method: "PUT",
      body: JSON.stringify({
        description: form.description,
        amount: Number(form.amount),
        type: form.type,
        categoryId: Number(form.categoryId), // ✅ REQUIRED
        date: form.date
      })
    });

    setLoading(false);
    onUpdated();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
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

        {/* 🔥 REQUIRED CATEGORY */}
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
