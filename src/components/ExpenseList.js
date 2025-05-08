import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get('/api/expenses');
        setExpenses(res.data);
      } catch (err) {
        console.error('Failed to fetch expenses:', err);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">All Expenses</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Logged By</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
             <tr key={expense.id} className="text-center">
             <td className="p-2 border">{expense.title}</td>
             <td className="p-2 border">${parseFloat(expense.amount).toFixed(2)}</td>
             <td className="p-2 border">{expense.category}</td>
            <td className="p-2 border">{new Date(expense.date).toLocaleDateString()}</td>
            <td className="p-2 border">{expense.created_by}</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default ExpenseList;
