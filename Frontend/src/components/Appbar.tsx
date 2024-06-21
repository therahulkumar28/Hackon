import  { useState } from 'react';
import { Link } from 'react-router-dom'; 

const Appbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

 

  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <div className="flex items-center justify-center space-x-4">
        <button className="p-2" onClick={toggleSidebar}>
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <span className="text-xl font-extrabold">HACKON</span>
      </div>
      <div className="relative">
        <button className="rounded-full overflow-hidden" onClick={toggleDropdown}>
          <div className="flex items-center space-x-2 p-2 cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              H
            </div>
           
          </div>
        </button>
        
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed left-0 top-20 h-full w-64 bg-gray-200 shadow-md z-20 transform transition-transform ease-in-out duration-300">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg p-4 font-semibold">Menu</p>
              <button className="text-gray-600" onClick={toggleSidebar}>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <ul>
              {/* Use Link components for navigation */}
              <li className="mb-2">
                <Link to="/" className="block text-left w-full px-4 py-2 text-gray-800 hover:bg-gray-300">
                  HOME
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/ai-recommendation" className="block text-left w-full px-4 py-2 text-gray-800 hover:bg-gray-300">
                  AI Recommendation
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/ai-chatbot" className="block text-left w-full px-4 py-2 text-gray-800 hover:bg-gray-300">
                  AI Chatbot
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/payment-history" className="block text-left w-full px-4 py-2 text-gray-800 hover:bg-gray-300">
                  View Spending on Product or Category
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/budget-saving" className="block text-left w-full px-4 py-2 text-gray-800 hover:bg-gray-300">
                  View Monthly Expenditure
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appbar;
