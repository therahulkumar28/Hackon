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
  const [currency, setCurrency] = useState('INR');
  const itemsPerPage = 4;

  const exchangeRates : { [key: string]: number } = {
    INR: 1,
    USD: 0.012, // Example exchange rate, 1 INR = 0.012 USD
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/customers/6673d641b5ce57594b4523c2/transactions`
      );
      const sortedTransactions = response.data.sort((a: Transaction, b: Transaction) => {
        // Sort by createdAt in descending order (latest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setAllTransactions(sortedTransactions);
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

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value);
  };

  const convertCurrency = (amount: number, from: string, to: string) => {
    if (from === to) {
      return amount;
    }
    const conversionRate = exchangeRates[to] / exchangeRates[from];
    return amount * conversionRate;
  };

  return (
    <div className=" relative  p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Transaction History</h2>
        <select value={currency} onChange={handleCurrencyChange} className="p-2 border rounded-lg">
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
      </div>
      {currentTransactions.length === 0 && !loading ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-2">
          {currentTransactions.map((transaction) => (
            <li key={transaction._id} className="p-4 border rounded-lg shadow-md">
              <p><strong>Product:</strong> {transaction.productName}</p>
              <p><strong>Original Price:</strong> {currency} {convertCurrency(transaction.originalPrice, 'INR', currency).toFixed(2)}</p>
              <p><strong>Final Price:</strong> {currency} {convertCurrency(transaction.finalPrice, 'INR', currency).toFixed(2)}</p>
              <p><strong>Purchase Savings:</strong> {transaction.purchaseSavings.map((s) => `${s.source}: ${currency} ${convertCurrency(s.amount, 'INR', currency).toFixed(2)}`).join(', ')}</p>
              <p><strong>Credit Savings:</strong> {transaction.creditSavings.map((s) => `${s.source}: ${currency} ${convertCurrency(s.amount, 'INR', currency).toFixed(2)}`).join(', ')}</p>
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
