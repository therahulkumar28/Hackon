import React from 'react';
import Appbar from '../components/Appbar';
import Hero from '../components/Hero';

const Dashboard: React.FC = () => {
  return (
    <div className="App">
      <Appbar/>
      <Hero/>
    </div>
  );
};

export default Dashboard;
