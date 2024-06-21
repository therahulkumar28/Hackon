import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance from '../config/axios';

interface SpendingCategory {
  totalExpenditure: number;
  discountSavings: number;
  creditSavings: number;
  totalSavings: number;
}
interface ExchangeRates {
  [key: string]: number;
}

interface CategoryData {
  [key: string]: SpendingCategory;
}

const exchangeRates:ExchangeRates = {
  INR: 1,
  USD: 0.012, // Example exchange rate, 1 INR = 0.012 USD
};

const convertCurrency = (amount: number, from: string, to: string) => {
  if (from === to) {
    return amount;
  }
  const conversionRate = exchangeRates[to] / exchangeRates[from];
  return amount * conversionRate;
};

const SpendingByCategory: React.FC = () => {
  const [data, setData] = useState<CategoryData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currency, setCurrency] = useState<string>('INR');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/customers/6673d641b5ce57594b4523c2/spending-by-category'); // Replace with actual customer ID
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value);
  };

  const chartData = data && selectedCategory ? [{
    name: selectedCategory,
    totalExpenditure: convertCurrency(data[selectedCategory].totalExpenditure, 'INR', currency),
    discountSavings: convertCurrency(data[selectedCategory].discountSavings, 'INR', currency),
    creditSavings: convertCurrency(data[selectedCategory].creditSavings, 'INR', currency),
    totalSavings: convertCurrency(data[selectedCategory].totalSavings, 'INR', currency),
  }] : [];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      {/* {<h1 className="text-2xl mb-4">Spending by Category</h1>} */}
      <div className="mb-4">
        <select onChange={handleCategoryChange} className="p-2 border border-gray-300 mr-4">
          <option value="">Select a category</option>
          {data && Object.keys(data).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select onChange={handleCurrencyChange} value={currency} className="p-2 border border-gray-300">
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
      </div>
      {selectedCategory && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalExpenditure" fill="#8884d8" />
            <Bar dataKey="discountSavings" fill="#82ca9d" />
            <Bar dataKey="creditSavings" fill="#ffc658" />
            <Bar dataKey="totalSavings" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SpendingByCategory;
