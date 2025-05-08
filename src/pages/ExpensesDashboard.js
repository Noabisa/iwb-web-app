import React from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import TotalExpenses from '../components/TotalExpenses';
import './ExpensesDashboard.css'; 

const ExpensesDashboard = () => {
  return (
    <div className="expenses-dashboard">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <ExpenseForm />
          <div className="mt-6">
            <TotalExpenses />
          </div>
        </div>
        <ExpenseList />
      </div>
    </div>
  );
};

export default ExpensesDashboard;
