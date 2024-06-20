import  { useState, useEffect } from 'react';
import axios from 'axios';

interface Customer {
    name : string ;
    email : string ;
    address : string ;
    phone : string ;
    createdAt : string ;
}
const CustomerDetails = () => {
  const [customer, setCustomer] = useState<Customer>(null);

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const fetchCustomerDetails = async () => {
    try {
      const customerId = '6673d641b5ce57594b4523c2'; // Replace with actual customer ID
      const response = await axios.get(`http://localhost:3000/api/customers/${customerId}`);
      setCustomer(response.data);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const renderCustomerInfo = () => {
    if (!customer) return null;

    return (
      <div className="flex justify-center w-full items-center">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.DLyBOY6GEBZasl1qsjqZ3QHaG7%26pid%3DApi&f=1&ipt=7fd211950cd13b5cf61edfa9cc3fcd4fe45daabd7d8279ee30ea18a72b2974cc&ipo=images" alt="Customer Avatar" />
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Details</h2>
            <div className="flex items-center  mb-4">
              <span className="text-gray-600 mr-2">Name:</span>
              <span className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{customer.name}</span>
            </div>
            <div className="flex items-center mb-4">
              <span className="text-gray-600 mr-2">Email:</span>
              <span className="text-gray-500">{customer.email}</span>
            </div>
            <div className="flex items-center mb-4">
              <span className="text-gray-600 mr-2">Phone:</span>
              <span className="text-gray-500">{customer.phone}</span>
            </div>
            <div className="flex items-center mb-4">
              <span className="text-gray-600 mr-2">Address:</span>
              <span className="text-gray-500">{customer.address}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Joined Us:</span>
              <span className="text-gray-500">{new Date(customer.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto mt-8">
      {renderCustomerInfo()}
    </div>
  );
};

export default CustomerDetails;
