import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PaymentHistory from './pages/PaymentHistory';
import SavingsGraph from './components/SavingsGraph';

import Budget from './pages/Budget';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/payment-history/savings" element={<SavingsGraph />} />
        <Route path="/budget-saving" element={<Budget />} />
      </Routes>
    </Router>
  );
};

export default App;
