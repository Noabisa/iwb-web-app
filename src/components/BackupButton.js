import React, { useState } from 'react';

const BackupButton = () => {
  const [loading, setLoading] = useState(false);
  const [backupInfo, setBackupInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleBackup = async () => {
    setLoading(true);
    setError(null);
    setBackupInfo(null);

    try {
      const res = await fetch('http://localhost:5000/api/backup');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Backup failed');
      }

      setBackupInfo(data);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={boxStyle}>
      <button onClick={handleBackup} disabled={loading} style={btnStyle}>
        {loading ? 'Backing up...' : '📦 Backup All Sales + Products + Services'}
      </button>

      {backupInfo && (
        <div style={{ marginTop: '10px' }}>
          ✅ Backup complete: <br />
          <a href={backupInfo.s3Url} target="_blank" rel="noopener noreferrer">
            Download JSON from S3
          </a>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
    </div>
  );
};

const boxStyle = { margin: '20px 0' };
const btnStyle = {
  padding: '10px 16px',
  backgroundColor: '#0e1a35',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '5px'
};

export default BackupButton;
