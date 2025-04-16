import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the search logic
    console.log('Searching for:', searchQuery);
    // For now, we'll just navigate to the buy page with the search query
    navigate(`/buy?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="bg-gray-100">
      {/* Hero Section with Background Image */}
      <div className="relative h-[600px]">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Real Estate Background"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Dream Home
            </h1>
            <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
              Discover the perfect property for your needs with our extensive listings and expert guidance.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter location, property type, or keywords..."
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Explore Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/buy" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Buy a Home</h2>
            <p className="text-gray-600">Browse our selection of properties for sale</p>
          </Link>
          <Link to="/rent" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Rent a Property</h2>
            <p className="text-gray-600">Find your perfect rental property</p>
          </Link>
          <Link to="/sell" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sell Your Property</h2>
            <p className="text-gray-600">List your property with us</p>
          </Link>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Featured Property Cards */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                className="w-full h-48 object-cover"
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3"
                alt="Luxury Home"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">Luxury Villa</h3>
                <p className="text-gray-600 mt-2">$1,200,000</p>
                <p className="text-gray-500 mt-2">4 beds • 3 baths • 2,500 sqft</p>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
                  View Details
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                className="w-full h-48 object-cover"
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3"
                alt="Modern Apartment"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">Modern Apartment</h3>
                <p className="text-gray-600 mt-2">$450,000</p>
                <p className="text-gray-500 mt-2">2 beds • 2 baths • 1,200 sqft</p>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
                  View Details
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                className="w-full h-48 object-cover"
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3"
                alt="Family Home"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">Family Home</h3>
                <p className="text-gray-600 mt-2">$850,000</p>
                <p className="text-gray-500 mt-2">3 beds • 2.5 baths • 2,000 sqft</p>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted by Thousands</h3>
              <p className="text-gray-600">Over 10,000 satisfied customers</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Always here when you need us</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">Safe and secure process</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Agents</h3>
              <p className="text-gray-600">Professional guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section is removed as it will be handled globally */}
    </div>
  );
};

export default Home; 