import React from 'react';

interface SavingsGoalsProps {
  savingsGoals: any[];
}

const SavingsGoals: React.FC<SavingsGoalsProps> = ({ savingsGoals }) => {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-semibold mb-2">Savings Goals</h2>
      <ul>
        {savingsGoals.map((goal, index) => (
          <li key={index} className="border p-2 mb-2">
            <p>Goal Amount: ${goal.goalAmount}</p>
            <p>Current Amount: ${goal.currentAmount}</p>
            <p>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavingsGoals;
