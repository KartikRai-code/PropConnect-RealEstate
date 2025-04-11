import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Website Name */}
              <Link to="/" className="text-2xl font-bold text-indigo-600">
                PropConnect
              </Link>
            </div>
            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/home" 
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                // Add activeClassName logic if needed, e.g., using NavLink from react-router-dom
              >
                Home
              </Link>
              <Link 
                to="/buy" 
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Buy
              </Link>
              <Link 
                to="/rent" 
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Rent
              </Link>
              <Link 
                to="/sell" 
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Sell
              </Link>
            </div>
          </div>
          {/* Right Side Actions (e.g., Login/Register or Agent Link) */}
          <div className="flex items-center">
            <Link
              to="/become-agent"
              className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Become an Agent
            </Link>
            {/* Add Login/Register buttons if needed */}
            {/* Example:
            <Link to="/login" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">Sign in</Link>
            <Link to="/register" className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Sign up</Link>
            */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header; 