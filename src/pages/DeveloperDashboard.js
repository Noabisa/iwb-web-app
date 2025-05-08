import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeveloperDashboard = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [systemStatus] = useState({
    server: 'Online',
    database: 'Connected',
    storage: 'Available',
    usersOnline: Math.floor(Math.random() * 10) + 1,
  });

  // Fetch uploaded files on initial render
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/files');
        setUploadedFiles(response.data);
      } catch (error) {
        console.error('Error fetching uploaded files:', error);
      }
    };
    fetchUploadedFiles();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Replace the URL with your actual backend endpoint
      const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newFile = {
        name: response.data.filename,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        uploadedAt: new Date().toLocaleString(),
        path: response.data.path,
      };

      setUploadedFiles((prev) => [newFile, ...prev]);
      setFile(null);
      alert('File uploaded successfully.');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Developer Dashboard</h1>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>System Diagnostics</h2>
        <ul style={styles.ul}>
          <li><strong>Server:</strong> {systemStatus.server}</li>
          <li><strong>Database:</strong> {systemStatus.database}</li>
          <li><strong>Storage:</strong> {systemStatus.storage}</li>
          <li><strong>Users Online:</strong> {systemStatus.usersOnline}</li>
        </ul>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Upload Application Files</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} style={styles.button}>
          Upload
        </button>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>🧾 Uploaded Files</h2>
        {uploadedFiles.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>File Name</th>
                  <th style={styles.th}>Size</th>
                  <th style={styles.th}>Uploaded At</th>
                  <th style={styles.th}>File Path</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((f, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{f.name}</td>
                    <td style={styles.td}>{f.size}</td>
                    <td style={styles.td}>{f.uploadedAt}</td>
                    <td style={styles.td}><a href={f.path} target="_blank" rel="noopener noreferrer">View</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, Tahoma, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    color: '#1f2937',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    marginBottom: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '0.5rem',
  },
  ul: {
    listStyle: 'none',
    paddingLeft: 0,
    lineHeight: '1.8',
  },
  button: {
    marginLeft: 10,
    padding: '10px 16px',
    backgroundColor: '#1d4ed8',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  th: {
    padding: '12px',
    backgroundColor: '#e2e8f0',
    textAlign: 'left',
    borderBottom: '2px solid #cbd5e1',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #e5e7eb',
  },
};

export default DeveloperDashboard;
