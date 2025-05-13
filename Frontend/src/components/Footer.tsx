import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-indigo-400">PropConnect</h3>
            <p className="text-gray-400">Your trusted partner in finding the perfect property.</p>
          </div>
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/home" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/buy" className="text-gray-400 hover:text-white">Buy</Link></li>
              <li><Link to="/rent" className="text-gray-400 hover:text-white">Rent</Link></li>
              <li><Link to="/sell" className="text-gray-400 hover:text-white">Sell</Link></li>
              <li><Link to="/become-agent" className="text-gray-400 hover:text-white">Become an Agent</Link></li>
            </ul>
          </div>
          {/* Column 3: Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>PropConnect Headquarters</li>
              <li>Bangalore, Karnataka 560001</li>
              <li>Phone: +91 80 4567 8900</li>
              <li>Email: contact@propconnect.in</li>
            </ul>
          </div>
        </div>
        {/* Copyright and Signature */}
        <div className="mt-8 border-t border-gray-800 pt-8">
          <div className="text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} PropConnect. All rights reserved.</p>
            <p className="mt-2 text-sm">Designed & Developed by KARTIK RAI</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 