import React, { useState } from 'react';

const OTPModal = ({ otp, setShowOTPModal }) => {
  const [enteredOtp, setEnteredOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    if (!enteredOtp) {
      setError('OTP cannot be empty.');
      return;
    }

    if (enteredOtp !== otp) {
      setError('Incorrect OTP. Please try again.');
      return;
    }

    setLoading(true);

    // Simulate OTP verification with your backend
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: localStorage.getItem('temp_email'),
          otp: enteredOtp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setShowOTPModal(false);
        // Redirect to dashboard after successful OTP verification
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'OTP verification failed.');
      }
    } catch (error) {
      setError('Error verifying OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h3>Enter OTP</h3>
        <p>Your OTP: {otp}</p>
        <input
          type="text"
          value={enteredOtp}
          onChange={(e) => setEnteredOtp(e.target.value)}
          maxLength="6"
          placeholder="Enter OTP"
          style={inputStyle}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleVerifyOTP} style={btnStyle} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button onClick={() => setShowOTPModal(false)} style={btnStyle}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  width: '300px',
  textAlign: 'center',
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  marginBottom: '1rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const btnStyle = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer',
};

export default OTPModal;
