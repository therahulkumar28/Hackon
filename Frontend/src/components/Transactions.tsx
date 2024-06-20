import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Transaction {
  _id: string;
  productId: string;
  productName: string;
  type: string;
  originalPrice: number;
  finalPrice: number;
  category?: string;
  purchaseSavings: { source: string; amount: number }[];
  creditSavings: { source: string; amount: number }[];
  createdAt: string;
}

const Transactions: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/customers/6673d641b5ce57594b4523c2/transactions`
      );
      setAllTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
    setLoading(false);
  };

  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = allTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(allTransactions.length / itemsPerPage);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      {currentTransactions.length === 0 && !loading ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-2">
          {currentTransactions.map((transaction) => (
            <li key={transaction._id} className="p-4 border rounded-lg shadow-md">
              <p><strong>Product:</strong> {transaction.productName}</p>
              <p><strong>Original Price:</strong> ${transaction.originalPrice}</p>
              <p><strong>Final Price:</strong> ${transaction.finalPrice}</p>
              <p><strong>Purchase Savings:</strong> {transaction.purchaseSavings.map((s) => `${s.source}: $${s.amount}`).join(', ')}</p>
              <p><strong>Credit Savings:</strong> {transaction.creditSavings.map((s) => `${s.source}: $${s.amount}`).join(', ')}</p>
              <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
      {loading && <p>Loading...</p>}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index + 1)}
            className={`px-3 py-1 mx-1 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {!loading && allTransactions.length > 0 && currentTransactions.length === 0 && (
        <p>No more transactions found.</p>
      )}
    </div>
  );
};

export default Transactions;
