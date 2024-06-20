import React, { useEffect, useState } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Transaction {
  productId: string;
  productName: string;
  type: string;
  originalPrice: number;
  finalPrice: number;
  purchaseSavings: { source: string; amount: number }[];
  creditSavings: { source: string; amount: number }[];
  createdAt: string;
}

const SavingsGraph: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/customers/66713089826e5eb033b0af8d/transactions');
        setTransactions(response.data);
        const uniqueYears: string[] = Array.from(new Set(response.data.map((transaction: Transaction) => new Date(transaction.createdAt).getFullYear().toString())));
        setYears(uniqueYears.sort((a, b) => parseInt(b) - parseInt(a))); // Sort years in descending order
        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0]);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => new Date(transaction.createdAt).getFullYear().toString() === selectedYear);

  const groupedData = filteredTransactions.reduce((acc: any, transaction) => {
    const month = new Date(transaction.createdAt).toLocaleString('default', { month: 'short' });
    const key = `${month} ${selectedYear}`;

    if (!acc[key]) {
      acc[key] = {
        totalExpenditure: 0,
        discountSavings: 0,
        creditSavings: 0,
      };
    }

    acc[key].totalExpenditure += transaction.finalPrice;
    acc[key].discountSavings += transaction.purchaseSavings.reduce((sum, saving) => sum + saving.amount, 0);
    acc[key].creditSavings += transaction.creditSavings.reduce((sum, saving) => sum + saving.amount, 0);

    return acc;
  }, {});

  const labels = Object.keys(groupedData);
  const totalExpenditureData = labels.map(label => groupedData[label].totalExpenditure);
  const discountSavingsData = labels.map(label => groupedData[label].discountSavings);
  const creditSavingsData = labels.map(label => groupedData[label].creditSavings);

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Expenditure',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: totalExpenditureData,
      },
      {
        label: 'Savings due to Discounts',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        data: discountSavingsData,
      },
      {
        label: 'Savings due to Credits',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        data: creditSavingsData,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <h2 className="text-xl font-bold mb-4">Monthly Savings and Expenditure</h2>
      <div className="mb-4">
        <label htmlFor="yearSelect" className="mr-2">Select Year:</label>
        <select
          id="yearSelect"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full lg:w-3/4 xl:w-1/2 h-96">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default SavingsGraph;
