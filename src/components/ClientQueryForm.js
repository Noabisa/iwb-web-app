import React, { useState } from 'react';

const ClientQueryForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResponse(data);
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (err) {
      setResponse({ status: 'error', message: 'Submission failed. Please try again later.' });
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>💬 Contact IWB Support</h2>
      <p style={styles.subtext}>We’ll respond automatically if we’ve answered a similar query before.</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Name</label>
        <input
          name="name"
          value={formData.name}
          required
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          required
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Message</label>
        <textarea
          name="message"
          value={formData.message}
          required
          onChange={handleChange}
          rows={5}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Sending...' : 'Submit Query'}
        </button>
      </form>

      {response && (
        <div style={{ ...styles.response, backgroundColor: response.status === 'success' ? '#e0fbe6' : '#fce1e1' }}>
          <strong>Status:</strong> {response.status}<br />
          {response.autoReply && (
            <p style={styles.autoReply}>
              <span role="img" aria-label="robot">🤖</span> <strong>Auto-Reply:</strong> {response.autoReply}
            </p>
          )}
          {response.message && <p>{response.message}</p>}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '600px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
    background: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 0 12px rgba(0,0,0,0.1)'
  },
  heading: {
    marginBottom: '0.5rem',
    color: '#1e88e5'
  },
  subtext: {
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    color: '#555'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontWeight: 'bold',
    margin: '0.5rem 0 0.25rem'
  },
  input: {
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '1rem'
  },
  textarea: {
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '1rem'
  },
  button: {
    backgroundColor: '#1e88e5',
    color: 'white',
    padding: '0.8rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  response: {
    marginTop: '1.5rem',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '0.95rem'
  },
  autoReply: {
    marginTop: '0.5rem',
    fontStyle: 'italic',
    color: '#333'
  }
};

export default ClientQueryForm;
