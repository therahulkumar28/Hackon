import React, { useState } from 'react';
import axiosInstance from '../config/axios'; // Adjust path as needed

interface AddSavingsGoalProps {
  customerId: string;
}

const AddSavingsGoal: React.FC<AddSavingsGoalProps> = ({ customerId }) => {
  const [goalAmount, setGoalAmount] = useState<number>(0);
  const [targetDate, setTargetDate] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/customers/${customerId}/savings-goals`, { goalAmount, targetDate });
      console.log('Savings goal added:', response.data);
      window.location.reload(); // Reload the page after successful submission (consider using React state management instead)
    } catch (error) {
      console.error('Error adding savings goal:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-2xl font-semibold mb-2">Add Savings Goal</h2>
      <div className="mb-2">
        <label className="block">Goal Amount:</label>
        <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} className="border p-2 w-full" />
      </div>
      <div className="mb-2">
        <label className="block">Target Date:</label>
        <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="border p-2 w-full" />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Savings Goal</button>
    </form>
  );
};

export default AddSavingsGoal;
