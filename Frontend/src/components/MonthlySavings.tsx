import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

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

const TransactionGraph = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [monthOptions, setMonthOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    fetchTransactionOptions();
  }, []);

  const fetchTransactionOptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/customers/6673d641b5ce57594b4523c2/transactions`);
      const sortedTransactions = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const uniqueMonths = Array.from(new Set(sortedTransactions.map(transaction => new Date(transaction.createdAt).getMonth() + 1)));
      const uniqueYears = Array.from(new Set(sortedTransactions.map(transaction => new Date(transaction.createdAt).getFullYear())));
      setMonthOptions(uniqueMonths);
      setYearOptions(uniqueYears);
    } catch (error) {
      console.error('Error fetching transaction options:', error);
    }
    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/customers/6673d641b5ce57594b4523c2/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
    setLoading(false);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
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
                    label: 'Original Price',
                    data: transactions.map((transaction) => transaction.originalPrice),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  },
                  {
                    label: 'Final Price',
                    data: transactions.map((transaction) => transaction.finalPrice),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                  },
                  {
                    label: 'Discount Savings',
                    data: transactions.map((transaction) => transaction.purchaseSavings.reduce((total, saving) => total + saving.amount, 0)),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  },
                  {
                    label: 'Credit Savings',
                    data: transactions.map((transaction) => transaction.creditSavings.reduce((total, saving) => total + saving.amount, 0)),
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                  },
                  {
                    label: 'Total Expenditure',
                    data: transactions.map((transaction) => transaction.finalPrice),
                    backgroundColor: 'rgba(255, 206, 86, 0.6)',
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
