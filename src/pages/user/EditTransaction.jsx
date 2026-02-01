import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const EditTransactionModal = ({
  open,
  transaction,
  onClose,
  onUpdated
}) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!transaction) return;

    setForm({
      description: transaction.description || "",
      amount: transaction.amount || "",
      type: transaction.type || "EXPENSE",
      categoryId: transaction.category?.id || "",
      date: transaction.date?.split("T")[0] || ""
    });

    loadCategories();
  }, [transaction]);

  const loadCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data);
    } catch {
      alert("Failed to load categories");
    }
  };

  if (!open || !form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // reset category if type changes
    if (name === "type") {
      setForm(prev => ({
        ...prev,
        type: value,
        categoryId: ""
      }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.categoryId) {
      alert("Please select a category");
      return;
    }

    try {
      setLoading(true);

      await api.put(
        `/api/transactions/${transaction.id}`,
        {
          description: form.description,
          amount: Number(form.amount),
          type: form.type,
          categoryId: Number(form.categoryId),
          date: form.date
        }
      );

      onUpdated();
      onClose();
    } catch {
      alert("Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Edit Transaction</h3>

        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
        >
          <option value="">Select Category</option>

        {categories
  .filter(c => c.type?.toUpperCase() === form.type)
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

          <button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;
