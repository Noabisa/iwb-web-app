import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TotalExpenses.css';

const TotalExpenses = () => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get('/api/expenses');
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const monthlyTotal = res.data
          .filter(exp => {
            const date = new Date(exp.date);
            return (
              date.getMonth() === thisMonth &&
              date.getFullYear() === thisYear
            );
          })
          .reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);

        setTotal(monthlyTotal.toFixed(2));
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="expense-card">
      <h3 className="expense-title">💸 Total Expenses This Month</h3>
      <p className="expense-amount">${total}</p>
    </div>
  );
};

export default TotalExpenses;
