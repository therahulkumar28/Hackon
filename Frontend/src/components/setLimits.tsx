import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';

const SetLimits: React.FC = () => {
  const [yearlyPurchaseLimit, setYearlyPurchaseLimit] = useState<number>();
  const [spendingNotifications, setSpendingNotifications] = useState<boolean>(false);
  const [thresholdLimit , setthresholdLimit] = useState<number>()
  const [customerId, setCustomerId] = useState<string>(''); // Assume this is fetched from authentication context

  useEffect(() => {
    setCustomerId('6673d641b5ce57594b4523c2')
    const fetchLimits = async () => {
      try {
        const response = await axiosInstance.get(`/customers/${customerId}/purchase-limit`);
        setYearlyPurchaseLimit(response.data.spendingLimit);
        setthresholdLimit(response.data.thresholdLimit)
        setSpendingNotifications(response.data.spendingNotifications);
      } catch (error) {
        console.error('Error fetching purchase limit:', error);
      }
    };

    if (customerId) {
      fetchLimits();
    }
  }, [customerId]);

  const saveLimits = async () => {
    try {
      await axiosInstance.put(`/customers/${customerId}/purchase-limit`, {
        spendingLimit :yearlyPurchaseLimit,
        thresholdLimit:thresholdLimit ,
        spendingNotifications : spendingNotifications 
      });
      alert('Limits saved successfully');
    } catch (error) {
      console.error('Error saving purchase limit:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Set Purchase Limits</h2>
      <div className="mb-4">
        <label htmlFor="yearlyPurchaseLimit" className="block mb-2">
          Yearly Purchase Limit:
        </label>
        <input
          type="text"
          id="yearlyPurchaseLimit"
          value={yearlyPurchaseLimit}
          placeholder='Enter Your Limit'
          onChange={(e) => setYearlyPurchaseLimit(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="yearlyPurchaseLimit" className="block mb-2">
          Threshold Limit:
        </label>
        <input
          type="text"
          id="thresholdLimit"
          value={thresholdLimit}
          placeholder='Enter Your Limit (Optional) This is to inform you just before'
          onChange={(e) => setthresholdLimit(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="spendingNotifications" className="block mb-2">
          Enable Spending Notifications:
        </label>
        <input
          type="checkbox"
          id="spendingNotifications"
          checked={spendingNotifications}
          onChange={(e) => setSpendingNotifications(e.target.checked)}
          className="p-2"
        />
      </div>
      <button onClick={saveLimits} className="p-2 bg-blue-500 text-white rounded">
        Save
      </button>
    </div>
  );
};

export default SetLimits;
