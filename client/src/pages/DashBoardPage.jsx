import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import ExpenseDashboard from '../components/Dashboard/ExpenseDashboard';

const DashBoardPage = () => {
  return (
    <DashboardLayout>
      <ExpenseDashboard />
    </DashboardLayout>
  );
};

export default DashBoardPage;
