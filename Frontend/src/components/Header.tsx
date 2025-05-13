import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* Logo/Brand - Make it clickable */}
          <Link to="/" className="flex items-center mr-0">
            <span className="text-indigo-600 text-xl font-bold">PropConnect</span>
          </Link>
          
          {/* Navigation Links - Removed Home link */}
          <nav className="flex space-x-8 ml-8">
            <Link to="/buy" className="text-gray-500 hover:text-indigo-600">Buy</Link>
            <Link to="/rent" className="text-gray-500 hover:text-indigo-600">Rent</Link>
            <Link to="/sell" className="text-gray-500 hover:text-indigo-600">Sell</Link>
          </nav>
          
          {/* Auth Buttons - Push to the right with ml-auto */}
          <div className="flex items-center space-x-4 ml-auto">
            {!user ? (
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-800 px-3 py-2 text-sm font-medium"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-indigo-600 hover:text-indigo-800 px-3 py-2 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            )}
            <Link
              to="/become-agent"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Become an Agent
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;