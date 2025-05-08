import React, { useState } from 'react';

const BuyForm = ({ item, onClose, onConfirm }) => {
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ item, buyerName, buyerEmail });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        background: '#fff', padding: 20, borderRadius: 8, width: 300
      }}>
        <h3>Buy: {item.name}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
          <input
            type="email"
            placeholder="Your Email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
          <button type="submit" style={{ padding: '8px 12px', backgroundColor: '#0e1a35', color: 'white', border: 'none', borderRadius: 4 }}>
            Confirm Purchase
          </button>
        </form>
        <button onClick={onClose} style={{ marginTop: 10, background: 'none', color: 'red' }}>Cancel</button>
      </div>
    </div>
  );
};

export default BuyForm;
