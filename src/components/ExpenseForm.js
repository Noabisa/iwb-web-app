import React, { useState } from 'react';
import axios from 'axios';
import './ExpenseForm.css';

const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    created_by: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/expenses/add', formData);
      alert('✅ Expense added!');
      setFormData({
        title: '',
        amount: '',
        category: '',
        date: '',
        created_by: '',
      });
    } catch (err) {
      alert('❌ Error adding expense');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2 className="form-title">Add New Expense</h2>

      <label>
        Title
        <input
          type="text"
          name="title"
          placeholder="e.g. Office Rent"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Amount (USD)
        <input
          type="number"
          name="amount"
          placeholder="e.g. 500"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Category
        <input
          type="text"
          name="category"
          placeholder="e.g. Utilities"
          value={formData.category}
          onChange={handleChange}
        />
      </label>

      <label>
        Date
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Your Email
        <input
          type="email"
          name="created_by"
          placeholder="e.g. user@example.com"
          value={formData.created_by}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit">➕ Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
