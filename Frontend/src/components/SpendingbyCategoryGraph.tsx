import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance from '../config/axios';

interface SpendingCategory {
  totalExpenditure: number;
  discountSavings: number;
  creditSavings: number;
  totalSavings: number;
}

interface CategoryData {
  [key: string]: SpendingCategory;
}

const SpendingByCategory: React.FC = () => {
  const [data, setData] = useState<CategoryData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

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

  const chartData = data && selectedCategory ? [{
    name: selectedCategory,
    ...data[selectedCategory]
  }] : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Spending by Category</h1>
      <select onChange={handleCategoryChange} className="mb-4 p-2 border border-gray-300">
        <option value="">Select a category</option>
        {data && Object.keys(data).map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
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
