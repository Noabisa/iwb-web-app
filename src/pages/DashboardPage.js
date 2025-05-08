import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>{user?.role?.toUpperCase()} Dashboard</h1>

      {user?.role === 'sales' && (
        <div>
          <h2>Sales Panel</h2>
          <p>View & log sales, check queries.</p>
        </div>
      )}

      {user?.role === 'finance' && (
        <div>
          <h2>Finance Panel</h2>
          <p>Access income statements with charts.</p>
        </div>
      )}

      {user?.role === 'developer' && (
        <div>
          <h2>Developer Panel</h2>
          <p>Access application files & configs.</p>
        </div>
      )}

      {user?.role === 'investor' && (
        <div>
          <h2>Investor View</h2>
          <p>Read-only access to income reports.</p>
        </div>
      )}

      {user?.role === 'partner' && (
        <div>
          <h2>Partner Access</h2>
          <p>Full platform visibility (except queries/webpages).</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
