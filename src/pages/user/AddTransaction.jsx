import React, { useEffect, useState } from "react";
import api from "../../api/axios";
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
    api.get("/api/categories")
       .then(res => setCategories(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.categoryId) {
      alert("Please select a category");
      return;
    }

    await api.post("/api/transactions", {
      ...form,
      amount: Number(form.amount),
      categoryId: Number(form.categoryId)
    });

    // Reset form
    setForm({
      description: "",
      amount: "",
      type: "EXPENSE",
      categoryId: "",
      date: ""
    });

    onAdded();
  };

  return (
    <div className="component-card">
      <h3>Add Transaction</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Description"
          value={form.description}
          onChange={e =>
            setForm({ ...form, description: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={e =>
            setForm({ ...form, amount: e.target.value })
          }
          required
        />

        <select
          value={form.type}
          onChange={e =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>

        <select
          value={form.categoryId}
          onChange={e =>
            setForm({ ...form, categoryId: e.target.value })
          }
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
          onChange={e =>
            setForm({ ...form, date: e.target.value })
          }
          required
        />

        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddTransaction;
