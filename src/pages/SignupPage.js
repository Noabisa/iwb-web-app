import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message || data.error);

    if (res.ok) {
      navigate('/login'); // Redirect to login page after successful signup
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <select name="role" onChange={handleChange} required>
        <option value="">Select Role</option>
        <option value="sales">Sales</option>
        <option value="finance">Finance</option>
        <option value="developer">Developer</option>
        <option value="investor">Investor</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};

export default SignupPage;
