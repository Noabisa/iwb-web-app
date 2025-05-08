import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const QueryCharts = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/queries/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Loading charts...</p>;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const barData = {
    labels: stats.monthly.map(m => months[m.month - 1]),
    datasets: [{
      label: 'Queries per Month',
      data: stats.monthly.map(m => m.count),
      backgroundColor: '#36a2eb'
    }]
  };

  const statusData = {
    labels: stats.statusCounts.map(s => s.status),
    datasets: [{
      label: 'Query Status',
      data: stats.statusCounts.map(s => s.count),
      backgroundColor: ['#ffcd56', '#4bc0c0']
    }]
  };

  const autoReplyData = {
    labels: stats.autoResponses.map(r => r.type),
    datasets: [{
      label: 'Auto vs Manual Replies',
      data: stats.autoResponses.map(r => r.count),
      backgroundColor: ['#9966ff', '#ff6384']
    }]
  };

  return (
    <div>
      <h3>📊 Query Trends</h3>
      <Bar data={barData} />
      <h4>✅ Query Status</h4>
      <Pie data={statusData} />
      <h4>🤖 Auto vs Manual Responses</h4>
      <Pie data={autoReplyData} />
    </div>
  );
};

export default QueryCharts;
