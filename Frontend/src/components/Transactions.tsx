import React from 'react';

interface TransactionsProps {
  transactions: any[];
}

const Transactions: React.FC<TransactionsProps> = ({ transactions }) => {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-semibold mb-2">Transactions</h2>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index} className="border p-2 mb-2">
            <p>Type: {transaction.type}</p>
            <p>Amount: ${transaction.amount}</p>
            <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
