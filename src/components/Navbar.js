import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/">Home</Link>

        {!user && (
          <>
            <Link to="/contact">Contact Us</Link>
            <Link to="/shop">Products & Services</Link>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </>
        )}

        {user && user.role === 'sales' && (
          <>
            <Link to="/sales">Sales Panel</Link>
            <Link to="/queries">Client Queries</Link>
          </>
        )}

        {user && user.role === 'finance' && (
          <>
            <Link to="/income">Income Dashboard</Link>
            <Link to="/expenses">Expenses Dashboard</Link>
          </>
        )}

        {user && user.role === 'developer' && (
          <Link to="/developer">Dev Panel</Link>
        )}

        {user && user.role === 'investor' && (
          <Link to="/investor">Investor View</Link>
        )}
      </div>

      <div className="navbar-right">
        {user && (
          <>
            <span>{user.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
