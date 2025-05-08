import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OTPVerifyPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Handle OTP verification
  const handleVerify = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message on each submit

    // Check if OTP is entered
    if (!otp) {
      setError('OTP cannot be empty.');
      return;
    }

    const email = localStorage.getItem('temp_email');
    const role = localStorage.getItem('role');

    if (!email || !role) {
      setError('Missing email or role. Please log in again.');
      return;
    }

    setLoading(true); // Set loading state while verifying OTP

    try {
      // Send OTP verification request to the backend
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;

        // Store token and email in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);

        // Update auth context
        setUser({ token, role });

        // Clean up temporary values
        localStorage.removeItem('temp_email');
        localStorage.removeItem('role');

        // Redirect based on the user's role
        switch (role) {
          case 'sales':
            navigate('/sales');
            break;
          case 'finance':
          case 'investor':
            navigate('/income');
            break;
          case 'developer':
            navigate('/developer');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(data.message || 'Invalid OTP.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Error verifying OTP. Please try again.');
    } finally {
      setLoading(false); // Reset loading state after the request
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>🔑 Enter OTP</h2>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} // Limit OTP to 6 digits
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          required
          style={inputStyle}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
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

export default OTPVerifyPage;
