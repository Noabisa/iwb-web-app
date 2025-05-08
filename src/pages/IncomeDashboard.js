import React, { useState, useEffect } from 'react';
import './IncomeDashboard.css';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LineChart,
  Line,
} from 'recharts';

const InvestorDashboard = () => {
  const [sales, setSales] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const startingCapital = 10000;

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const res = await fetch('/api/sales/income-only'); // Fetching sales data
        const data = await res.json();
        setSales(data); // Storing sales data in state
      } catch (err) {
        console.error('Failed to fetch income:', err);
      }
    };

    fetchIncome(); // Initial data fetch when the component mounts
  }, []);

  let runningNetWorth = startingCapital;

  // Calculate monthly data based on sales income
  const monthlyData = Array.from({ length: 12 }, (_, month) => {
    // Filter sales for the selected month and year
    const filteredSales = sales.filter(s => {
      const date = new Date(s.created_at || s.date);
      return date.getFullYear() === parseInt(year) && date.getMonth() === month;
    });

    // Calculate total income for the month (based on sales data)
    const income = filteredSales.reduce((sum, s) => sum + parseFloat(s.totalPrice || 0), 0);
    const profit = income; // For investor view, profit is same as income

    // Calculate running net worth
    runningNetWorth += profit;

    return {
      month: new Date(0, month).toLocaleString('default', { month: 'short' }),
      income: +income.toFixed(2),
      profit: +profit.toFixed(2),
      netWorth: +runningNetWorth.toFixed(2),
    };
  });

  // Totals for the entire year
  const totals = {
    income: monthlyData.reduce((acc, m) => acc + m.income, 0).toFixed(2),
    profit: monthlyData.reduce((acc, m) => acc + m.profit, 0).toFixed(2),
    netWorth: runningNetWorth.toFixed(2),
  };

  return (
    <div className="dashboard-container p-6">
      <h1 className="text-2xl font-bold mb-4">📈 Investor Income Dashboard</h1>

      <div className="mb-4">
        <label htmlFor="year" className="mr-2">📅 Select Year:</label>
        <select
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded p-1"
        >
          {[2025, 2024, 2023].map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      <table className="income-table w-full border mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Month</th>
            <th className="p-2 border">Income</th>
            <th className="p-2 border">Profit</th>
            <th className="p-2 border">Net Worth</th>
          </tr>
        </thead>
        <tbody>
          {monthlyData.map((d, i) => (
            <tr key={i}>
              <td className="p-2 border">{d.month}</td>
              <td className="p-2 border">{d.income.toFixed(2)}</td>
              <td className="p-2 border">{d.profit.toFixed(2)}</td>
              <td className="p-2 border">{d.netWorth.toFixed(2)}</td>
            </tr>
          ))}
          <tr className="font-bold bg-gray-100">
            <td className="p-2 border">Total</td>
            <td className="p-2 border">{totals.income}</td>
            <td className="p-2 border">{totals.profit}</td>
            <td className="p-2 border">{totals.netWorth}</td>
          </tr>
          <tr>
            <td colSpan="3" className="text-right font-bold p-2 border">Starting Capital:</td>
            <td className="p-2 border">{startingCapital.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Bar chart displaying the monthly profit */}
      <div className="chart-container mb-6">
        <ResponsiveContainer height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="profit" fill="#4f46e5" name="Net Profit" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line chart displaying the monthly profit and net worth */}
      <div className="chart-container mb-6">
        <ResponsiveContainer height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="profit" stroke="#4f46e5" name="Net Profit" />
            <Line type="monotone" dataKey="netWorth" stroke="#10b981" name="Net Worth" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InvestorDashboard;
