import React, { useEffect, useState } from "react";
import { securedFetch } from "../../api/api";
import "./AddTransaction.css";

const AddTransaction = ({ onAdded }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "EXPENSE",
    categoryId: "",
    date: ""
  });

  useEffect(() => {
    securedFetch("/api/categories").then(setCategories);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.categoryId) {
      alert("Please select a category");
      return;
    }

    await securedFetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        categoryId: Number(form.categoryId)
      })
    });

    onAdded();
  };
const submitTransaction = async () => {
  try {
    const res = await securedFetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (res.status === "ALERT") {
      setAlert(res.message);
    }

    refreshTransactions();
  } catch (err) {
    alert("Failed to add transaction");
  }
};

  return (
    <div className="component-card">
      <h3>Add Transaction</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
          required
        />

        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>

        {/* ✅ REQUIRED */}
        <select
          value={form.categoryId}
          onChange={e => setForm({ ...form, categoryId: e.target.value })}
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
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
          required
        />

        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddTransaction;
