import React, { useState, useEffect } from 'react';

import { Bar } from 'react-chartjs-2';
import axiosInstance from '../config/axios';

interface Transaction {
  productId: string;
  productName: string;
  type: string;
  originalPrice: number;
  finalPrice: number;
  category: string;
  purchaseSavings: { source: string; amount: number }[];
  creditSavings: { source: string; amount: number }[];
  createdAt: string;
}

const TransactionGraph: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [monthOptions, setMonthOptions] = useState<number[]>([]);
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('INR'); // Default to INR

  // Exchange rates
  const exchangeRates: { [key: string]: number } = {
    INR: 1,
    USD: 0.012, // Example exchange rate: 1 INR = 0.012 USD
  };

  useEffect(() => {
    fetchTransactionOptions();
  }, []);

  const fetchTransactionOptions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<Transaction[]>(`/customers/6673d641b5ce57594b4523c2/transactions`);
      if (Array.isArray(response.data)) {
        const sortedTransactions = response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const uniqueMonths = Array.from(new Set(sortedTransactions.map(transaction => new Date(transaction.createdAt).getMonth() + 1)));
        const uniqueYears = Array.from(new Set(sortedTransactions.map(transaction => new Date(transaction.createdAt).getFullYear())));
        setMonthOptions(uniqueMonths);
        setYearOptions(uniqueYears);
        // Set default selected month and year to the latest available
        setSelectedMonth(uniqueMonths[0]?.toString() || '');
        setSelectedYear(uniqueYears[0]?.toString() || '');
        setTransactions(sortedTransactions);
      } else {
        console.error('Expected an array but received:', response.data);
      }
    } catch (error) {
      console.error('Error fetching transaction options:', error);
    }
    setLoading(false);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(event.target.value);
    // After changing currency, refetch data to apply new currency conversion
    fetchData(selectedMonth, selectedYear, event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchData(selectedMonth, selectedYear, selectedCurrency);
  };

  const fetchData = async (month: string, year: string, currency: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<Transaction[]>(`/customers/6673d641b5ce57594b4523c2/transactions`);
      const filteredTransactions = response.data.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        return transactionDate.getMonth() + 1 === parseInt(month) && transactionDate.getFullYear() === parseInt(year);
      });

      // Convert prices based on selected currency
      const convertedTransactions = filteredTransactions.map(transaction => {
       
        return {
          ...transaction,
          originalPrice: currency === 'USD' ? transaction.originalPrice * exchangeRates['USD'] : transaction.originalPrice,
          finalPrice: currency === 'USD' ? transaction.finalPrice * exchangeRates['USD'] : transaction.finalPrice,
          purchaseSavings: transaction.purchaseSavings.map(saving => ({
            ...saving,
            amount: currency === 'USD' ? saving.amount * exchangeRates['USD'] : saving.amount
          })),
          creditSavings: transaction.creditSavings.map(saving => ({
            ...saving,
            amount: currency === 'USD' ? saving.amount * exchangeRates['USD'] : saving.amount
          }))
        };
      });

      setTransactions(convertedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4" style={{ overflowX: 'auto' }}>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center">
          <label htmlFor="month" className="mr-2">Month:</label>
          <select id="month" value={selectedMonth} onChange={handleMonthChange} className="p-2 border rounded-lg mr-4">
            <option value="">Select Month</option>
            {monthOptions.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <label htmlFor="year" className="mr-2">Year:</label>
          <select id="year" value={selectedYear} onChange={handleYearChange} className="p-2 border rounded-lg mr-4">
            <option value="">Select Year</option>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Fetch Transactions</button>
        </div>
      </form>
      <div className="flex items-center mb-4">
        <label className="mr-2">Show prices in:</label>
        <select value={selectedCurrency} onChange={handleCurrencyChange} className="p-2 border rounded-lg mr-2">
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowY: 'auto', maxHeight: '80vh' }}>
          {transactions.length === 0 ? (
            <p>No transactions found for the selected month and year.</p>
          ) : (
            <Bar
              data={{
                labels: transactions.map((transaction) => transaction.productName),
                datasets: [
                  {
                    label: selectedCurrency === 'USD' ? 'Original Price (USD)' : 'Original Price (INR)',
                    data: transactions.map((transaction) => transaction.originalPrice),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  },
                  {
                    label: selectedCurrency === 'USD' ? 'Final Price (USD)' : 'Final Price (INR)',
                    data: transactions.map((transaction) => transaction.finalPrice),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                  },
                  {
                    label: selectedCurrency === 'USD' ? 'Discount Savings (USD)' : 'Discount Savings (INR)',
                    data: transactions.map((transaction) => transaction.purchaseSavings.reduce((total, saving) => total + saving.amount, 0)),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  },
                  {
                    label: selectedCurrency === 'USD' ? 'Credit Savings (USD)' : 'Credit Savings (INR)',
                    data: transactions.map((transaction) => transaction.creditSavings.reduce((total, saving) => total + saving.amount, 0)),
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                  },
                ],
              }}
              options={{
                indexAxis: 'y',
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                  },
                },
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionGraph;
