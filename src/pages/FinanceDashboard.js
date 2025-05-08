// src/pages/FinanceDashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FinanceDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!user || user.role !== 'finance') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetch('http://localhost:5000/api/sales')
      .then(res => res.json())
      .then(data => setSales(data))
      .catch(err => console.error('Failed to fetch sales:', err));
  }, []);

  const monthlyData = Array.from({ length: 12 }, (_, index) => {
    const monthlySales = sales.filter(sale => {
      const date = new Date(sale.date);
      return date.getFullYear() === parseInt(year) && date.getMonth() === index;
    });
    const total = monthlySales.reduce((sum, s) => sum + parseFloat(s.totalPrice || 0), 0);
    const expense = 200 + index * 50; // Example expense formula
    const profit = total - expense;
    return {
      month: new Date(0, index).toLocaleString('default', { month: 'short' }),
      income: parseFloat(total.toFixed(2)),
      expense: parseFloat(expense.toFixed(2)),
      profit: parseFloat(profit.toFixed(2))
    };
  });

  const totals = {
    income: monthlyData.reduce((sum, m) => sum + m.income, 0).toFixed(2),
    expense: monthlyData.reduce((sum, m) => sum + m.expense, 0).toFixed(2),
    profit: monthlyData.reduce((sum, m) => sum + m.profit, 0).toFixed(2),
  };

  const exportCSV = () => {
    const csv = Papa.unparse(monthlyData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `IWB_Income_${year}.csv`;
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`📄 IWB Monthly Income Statement - ${year}`, 14, 20);
    doc.autoTable({
      startY: 30,
      head: [['Month', 'Income (M)', 'Expense (M)', 'Profit (M)']],
      body: monthlyData.map(row => [
        row.month, row.income.toFixed(2), row.expense.toFixed(2), row.profit.toFixed(2)
      ]),
    });
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Total Income', 'Total Expense', 'Total Profit']],
      body: [[totals.income, totals.expense, totals.profit]]
    });
    doc.save(`IWB_Income_${year}.pdf`);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>📈 Finance Dashboard – IWB</h1>

      <div style={{ margin: '1rem 0' }}>
        <label>Year: </label>
        <select value={year} onChange={e => setYear(e.target.value)} style={{ marginLeft: 8 }}>
          {[2025, 2024, 2023].map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={thStyle}>Month</th>
            <th style={thStyle}>Income (M)</th>
            <th style={thStyle}>Expense (M)</th>
            <th style={thStyle}>Profit (M)</th>
          </tr>
        </thead>
        <tbody>
          {monthlyData.map((row, idx) => (
            <tr key={idx}>
              <td style={tdStyle}>{row.month}</td>
              <td style={tdStyle}>{row.income}</td>
              <td style={tdStyle}>{row.expense}</td>
              <td style={tdStyle}>{row.profit}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: 'bold', background: '#e8f4ea' }}>
            <td style={tdStyle}>Total</td>
            <td style={tdStyle}>{totals.income}</td>
            <td style={tdStyle}>{totals.expense}</td>
            <td style={tdStyle}>{totals.profit}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: '2rem', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#2563eb" />
            <Line type="monotone" dataKey="expense" stroke="#f87171" />
            <Line type="monotone" dataKey="profit" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={exportCSV} style={btnStyle}>⬇ Export CSV</button>
        <button onClick={exportPDF} style={{ ...btnStyle, marginLeft: 10 }}>📄 Export PDF</button>
      </div>
    </div>
  );
};

const thStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  textAlign: 'center'
};

const tdStyle = {
  padding: '8px',
  border: '1px solid #ccc',
  textAlign: 'center'
};

const btnStyle = {
  backgroundColor: '#2563eb',
  color: '#fff',
  padding: '10px 16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default FinanceDashboard;
