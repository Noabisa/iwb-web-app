import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OTPVerify from './pages/OTPVerify';

import SalesDashboard from './pages/SalesDashboard';
import IncomeDashboard from './pages/IncomeDashboard';
import FinanceDashboard from './pages/FinanceDashboard';
import ExpensesDashboard from './pages/ExpensesDashboard';
import QueryDashboard from './pages/QueryDashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';
import InvestorDashboard from './pages/InvestorDashboard';

import ClientQueryForm from './components/ClientQueryForm';
import ProductPage from './components/ProductPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<OTPVerify />} />
          <Route path="/contact" element={<ClientQueryForm />} />
          <Route path="/shop" element={<ProductPage />} />

          {/* 🔐 Role-Protected Routes */}
          <Route
            path="/sales"
            element={
              <PrivateRoute allowedRoles={['sales']}>
                <SalesDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/income"
            element={
              <PrivateRoute allowedRoles={['finance', 'investor']}>
                <IncomeDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/finance"
            element={
              <PrivateRoute allowedRoles={['finance']}>
                <FinanceDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <PrivateRoute allowedRoles={['finance']}>
                <ExpensesDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/queries"
            element={
              <PrivateRoute allowedRoles={['sales']}>
                <QueryDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/developer"
            element={
              <PrivateRoute allowedRoles={['developer']}>
                <DeveloperDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/investor"
            element={
              <PrivateRoute allowedRoles={['investor']}>
                <InvestorDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
