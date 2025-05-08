import React, { useEffect, useState } from 'react';

const SalesDashboard = () => {
  const [sales, setSales] = useState([]);
  const [manualSale, setManualSale] = useState({
    item_type: 'product',
    item_id: '',
    amount: '',
    buyer_name: '',
    buyer_email: ''
  });
  const [queries, setQueries] = useState([]);
  const [backupLinks, setBackupLinks] = useState({ sales: '', queries: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSales();
    fetchQueries();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/sales', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setSales([]);
    }
  };

  const fetchQueries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/queries');
      const data = await res.json();
      setQueries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching queries:', err);
      setQueries([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setManualSale((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/sales/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(manualSale),
      });
      if (res.ok) {
        alert('✅ Manual sale logged successfully');
        setManualSale({
          item_type: 'product',
          item_id: '',
          amount: '',
          buyer_name: '',
          buyer_email: ''
        });
        fetchSales();
      } else {
        alert('❌ Failed to log manual sale');
      }
    } catch (err) {
      console.error('Error logging manual sale:', err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/sales/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setSales((prev) =>
          prev.map((sale) =>
            sale.id === id ? { ...sale, status: newStatus } : sale
          )
        );
      } else {
        alert('❌ Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleBackup = async () => {
    try {
      const [salesRes, queriesRes] = await Promise.all([
        fetch('http://localhost:5000/api/backup/sales', { method: 'POST' }),
        fetch('http://localhost:5000/api/backup/queries', { method: 'POST' }),
      ]);

      const salesData = await salesRes.json();
      const queriesData = await queriesRes.json();

      if (salesRes.ok && queriesRes.ok) {
        setBackupLinks({
          sales: `http://localhost:5000/backups/${salesData.filename}`,
          queries: `http://localhost:5000/backups/${queriesData.filename}`,
        });
        alert(`✅ Backup Successful!\n• Sales: ${salesData.filename}\n• Queries: ${queriesData.filename}`);
      } else {
        alert('❌ One or both backups failed.');
      }
    } catch (err) {
      console.error('Backup error:', err);
      alert('❌ Backup error occurred.');
    }
  };

  const getTotalAmount = () => {
    return sales.reduce((sum, sale) => sum + Number(sale.amount || 0), 0);
  };

  const exportToJSON = (data, fileName) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return (
    <div className="dashboard">
      <style>{`
        .dashboard {
          font-family: 'Segoe UI', sans-serif;
          padding: 30px;
          max-width: 1200px;
          margin: auto;
          background: #f9fafb;
        }
        h2 {
          margin-top: 40px;
          font-size: 22px;
          margin-bottom: 15px;
          border-left: 5px solid #3b82f6;
          padding-left: 10px;
          color: #1f2937;
        }
        form {
          background: #ffffff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }
        input, select {
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: #fff;
        }
        input:focus, select:focus {
          outline: none;
          border-color: #3b82f6;
        }
        button {
          padding: 10px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        button:hover {
          background-color: #2563eb;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          background-color: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          border-radius: 10px;
          overflow: hidden;
        }
        th, td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
          font-size: 14px;
        }
        th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        tr:last-child td {
          border-bottom: none;
        }
        select.status-dropdown {
          padding: 6px;
          font-size: 13px;
          border-radius: 4px;
          background-color: #f9fafb;
          border: 1px solid #d1d5db;
        }
        .summary {
          margin-bottom: 10px;
          font-weight: 500;
        }
        .backup-buttons {
          margin-top: 30px;
          display: flex;
          gap: 10px;
        }
      `}</style>

      <h2>🧾 Manual Sale Entry</h2>
      <form onSubmit={handleManualSubmit}>
        <select name="item_type" value={manualSale.item_type} onChange={handleInputChange}>
          <option value="product">Product</option>
          <option value="service">Service</option>
        </select>
        <input
          type="number"
          name="item_id"
          placeholder="Item ID"
          value={manualSale.item_id}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={manualSale.amount}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="buyer_name"
          placeholder="Buyer Name"
          value={manualSale.buyer_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="buyer_email"
          placeholder="Buyer Email"
          value={manualSale.buyer_email}
          onChange={handleInputChange}
          required
        />
        <button type="submit">➕ Log Sale</button>
      </form>

      <h2>📊 Sales Records</h2>
      <p className="summary"><strong>Total Sales:</strong> M{getTotalAmount().toFixed(2)}</p>
      {sales.length === 0 ? (
        <p>🚫 No sales records found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Buyer</th>
              <th>Email</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.item_name || `ID: ${sale.item_id}`}</td>
                <td>{sale.item_type}</td>
                <td>M{sale.amount}</td>
                <td>
                  <select
                    value={sale.status}
                    onChange={(e) => updateStatus(sale.id, e.target.value)}
                    className="status-dropdown"
                  >
                    <option value="pending">Pending</option>
                    <option value="complete">Complete</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{sale.buyer_name}</td>
                <td>{sale.buyer_email}</td>
                <td>{new Date(sale.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>📨 Customer Queries</h2>
      {queries.length === 0 ? (
        <p>🚫 No queries submitted yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Status</th>
              <th>Auto-Reply</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((q) => (
              <tr key={q.id}>
                <td>{q.name}</td>
                <td>{q.email}</td>
                <td>{q.message}</td>
                <td>{q.status}</td>
                <td>{q.response || '—'}</td>
                <td>{new Date(q.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="backup-buttons">
        <button onClick={handleBackup}>📦 Backup Sales & Queries</button>
        <button onClick={() => exportToJSON(sales, 'sales.json')}>📥 download sales</button>
        <button onClick={() => exportToJSON(queries, 'queries.json')}>download queries</button>
      </div>

      {(backupLinks.sales || backupLinks.queries) && (
        <div style={{ marginTop: '10px' }}>
          {backupLinks.sales && (
            <a href={backupLinks.sales} download style={{ marginRight: '10px', color: '#2563eb' }}>
              Download Sales Backup
            </a>
          )}
          {backupLinks.queries && (
            <a href={backupLinks.queries} download style={{ color: '#2563eb' }}>
              Download Queries Backup
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
