import React from 'react';


import SavingsGraph from '../components/SavingsGraph';

const Dashboard: React.FC = () => {
 // const [customer, setCustomer] = useState<any>(null);

  // useEffect(() => {
  //   // Replace with your customer ID
  //   const customerId = 'your-customer-id';
  //   axios.get(`/api/customers/${customerId}`)
  //     .then(response => {
  //       setCustomer(response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching customer data:', error);
  //     });
  // }, []);
//  const customerId = '66713089826e5eb033b0af8d';
  return (
    <div className="App">
      <h1>Customer Savings and Expenditure</h1>
      <SavingsGraph  />
    </div>
  );
};

export default Dashboard;
