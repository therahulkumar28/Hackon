import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Transactions from '../components/Transactions';
import SavingsGoals from '../components/SavingsGoals';
import AddTransaction from '../components/AddTransactions';
import AddSavingsGoal from '../components/AddSavingGoals';

const Dashboard: React.FC = () => {
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    // Replace with your customer ID
    const customerId = 'your-customer-id';
    axios.get(`/api/customers/${customerId}`)
      .then(response => {
        setCustomer(response.data);
      })
      .catch(error => {
        console.error('Error fetching customer data:', error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Customer Dashboard</h1>
      {customer ? (
        <>
          <Transactions transactions={customer.transactions} />
          <SavingsGoals savingsGoals={customer.savingsGoals} />
          <AddTransaction customerId={customer._id} />
          <AddSavingsGoal customerId={customer._id} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
