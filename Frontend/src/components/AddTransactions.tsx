import React, { useState } from 'react';
import axiosInstance from '../config/axios'; // Adjust path as needed

interface AddTransactionProps {
  customerId: string;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ customerId }) => {
  const [type, setType] = useState<string>('spending');
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/customers/${customerId}/transactions`, { type, amount });
      console.log('Transaction added successfully');
      window.location.reload(); // Reload the page after successful submission (consider using React state management instead)
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-2xl font-semibold mb-2">Add Transaction</h2>
      <div className="mb-2">
        <label className="block">Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 w-full">
          <option value="spending">Spending</option>
          <option value="saving">Saving</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block">Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="border p-2 w-full" />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Transaction</button>
    </form>
  );
};

export default AddTransaction;
