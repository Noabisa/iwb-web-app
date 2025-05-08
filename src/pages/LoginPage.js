import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OTPModal from './OTPModal';  // OTPModal component for OTP input

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  // Simple email validation
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('temp_email', email);
      localStorage.setItem('role', data.role); // Needed for redirect after OTP

      // Store the OTP received from the backend
      const generatedOtp = data.otp;
      setOtp(generatedOtp);

      // Show OTP Modal to enter OTP
      setShowOTPModal(true);

    } catch (err) {
      setLoading(false);
      setErrorMsg('Network error. Try again.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>🔐 Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={inputStyle}
        />
        <input
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={inputStyle}
        />
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? (
            <div className="spinner" style={spinnerStyle}></div>
          ) : (
            'Login'
          )}
        </button>
      </form>

      {/* OTP Modal */}
      {showOTPModal && (
        <OTPModal otp={otp} setShowOTPModal={setShowOTPModal} />
      )}
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '12px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const btnStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const spinnerStyle = {
  border: '4px solid rgba(255, 255, 255, 0.3)',
  borderTop: '4px solid #fff',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  animation: 'spin 1s linear infinite',
};

export default LoginPage;
