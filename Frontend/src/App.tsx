import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PaymentHistory from './pages/PaymentHistory';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
      </Routes>
    </Router>
  );
};

export default App;
