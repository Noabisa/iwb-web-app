import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const QueryDashboard = () => {
  const [queries, setQueries] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [statusStats, setStatusStats] = useState([]);
  const [autoStats, setAutoStats] = useState([]);

  useEffect(() => {
    fetchQueries();
    fetchStats();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await fetch('/api/queries');
      const data = await res.json();

      if (Array.isArray(data)) {
        setQueries(data);
      } else if (Array.isArray(data.queries)) {
        setQueries(data.queries);
      } else {
        console.error('Unexpected API response for /api/queries:', data);
        setQueries([]);
      }
    } catch (err) {
      console.error('Error fetching queries:', err);
      setQueries([]);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/queries/stats');
      const data = await res.json();

      const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthData = monthLabels.map((label, index) => {
        const entry = data.monthly?.find(m => m.month === index + 1);
        return { month: label, count: entry ? entry.count : 0 };
      });

      setMonthlyStats(monthData);
      setStatusStats(Array.isArray(data.statusCounts) ? data.statusCounts : []);
      setAutoStats(Array.isArray(data.autoResponses) ? data.autoResponses : []);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleReply = async (id) => {
    const response = prompt('Enter your reply:');
    if (!response) return;

    try {
      const res = await fetch(`/api/queries/${id}/reply`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Replied successfully.');
        fetchQueries();
      } else {
        alert(data.error || 'Failed to send reply');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending reply');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📈 Query Analysis & Auto Responses</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h4 style={styles.subheading}>📊 Monthly Queries</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyStats}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.card}>
          <h4 style={styles.subheading}>📌 Status Breakdown</h4>
          <ul style={styles.list}>
            {statusStats.map((s, i) => (
              <li key={i}><strong>{s.status}:</strong> {s.count}</li>
            ))}
          </ul>

          <h4 style={{ ...styles.subheading, marginTop: '1rem' }}>🤖 Response Types</h4>
          <ul style={styles.list}>
            {autoStats.map((a, i) => (
              <li key={i}><strong>{a.type}:</strong> {a.count}</li>
            ))}
          </ul>
        </div>
      </div>

      <h3 style={styles.subheading}>🧾 Logged Queries</h3>
      {Array.isArray(queries) && queries.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((q, i) => (
                <tr key={i}>
                  <td>{new Date(q.created_at).toLocaleDateString()}</td>
                  <td>{q.name}</td>
                  <td>{q.email}</td>
                  <td>{q.message}</td>
                  <td style={{ color: q.status === 'complete' ? 'green' : 'red' }}>{q.status}</td>
                  <td>
                    {q.status === 'pending' ? (
                      <button style={styles.button} onClick={() => handleReply(q.id)}>Reply</button>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No queries found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    color: '#111827',
  },
  heading: {
    fontSize: '1.75rem',
    marginBottom: '1.5rem'
  },
  subheading: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    color: '#1f2937',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '30px',
    marginBottom: '30px'
  },
  card: {
    background: '#fff',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  list: {
    listStyle: 'none',
    paddingLeft: 0,
    lineHeight: '1.8'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
  },
  button: {
    padding: '6px 12px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #e5e7eb'
  }
};

export default QueryDashboard;
