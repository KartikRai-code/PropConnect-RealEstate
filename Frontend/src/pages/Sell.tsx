import React from 'react';
import { Link } from 'react-router-dom';

const Sell: React.FC = () => {
  return (
    <div className="bg-gray-50">
      {/* Optional Top Bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-sm font-medium text-gray-700">List my home for sale</span>
            <Link 
              to="/list-property" // Link to the actual listing form page
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-24 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Column: Text Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              List your home
              <span className="block">for sale on</span>
              <span className="block text-indigo-600">PropConnect</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Post your home in minutes and reach millions of potential buyers for free.
            </p>
            <div className="mt-10">
              <Link
                to="/list-property" // Link to the actual listing form page
                className="inline-block px-8 py-3 bg-indigo-600 text-white text-lg font-medium rounded-md hover:bg-indigo-700"
              >
                Get started
              </Link>
            </div>
          </div>

          {/* Right Column: Illustration/Graphic (Optional) */}
          {/* Placeholder for illustration - could add an SVG or image later */}
          <div className="hidden md:block text-center">
             {/* Example of adding a simple SVG placeholder */}
             <svg className="inline-block h-64 w-auto text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm2-2h14v10h-4v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2H5V5z m3 8h2v-2H8v2zm4 0h2v-2h-2v2z"/>
             </svg>
             
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left Column: Image */}
            <div className="flex justify-center">
              {/* Replace with a relevant image. Using a placeholder for now. */}
              <img 
                className="rounded-lg shadow-xl max-h-96"
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="PropConnect Features"
              />
            </div>

            {/* Right Column: Feature Text */}
            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Post sale listings for free</h3>
                <p className="mt-3 text-lg text-gray-600">
                  With PropConnect, you can list your property for sale at no cost. There are absolutely no hidden fees.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Reach millions of buyers</h3>
                <p className="mt-3 text-lg text-gray-600">
                  When you list your property for sale with PropConnect, you gain access to millions of potential buyers actively searching in your area.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Manage inquiries and viewings</h3>
                <p className="mt-3 text-lg text-gray-600">
                  Easily manage inquiries from interested buyers, schedule viewings, and keep track of offers all in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900">How it works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 Card */}
            <div className="bg-white p-8 rounded-lg shadow text-center">
              {/* Icon Placeholder */}
              <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-indigo-100 mx-auto">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create an account</h3>
              <p className="text-gray-600">
                Easily register for a PropConnect account to start listing your properties for sale.
              </p>
            </div>

            {/* Step 2 Card */}
            <div className="bg-white p-8 rounded-lg shadow text-center">
              {/* Icon Placeholder */}
              <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-indigo-100 mx-auto">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tell us about your property</h3>
              <p className="text-gray-600">
                Upload photos and details like the number of beds and bathrooms, amenities, price, and more.
              </p>
            </div>

            {/* Step 3 Card */}
            <div className="bg-white p-8 rounded-lg shadow text-center">
              {/* Icon Placeholder */}
              <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-indigo-100 mx-auto">
                 <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
                 </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Publish your listing</h3>
              <p className="text-gray-600">
                After a quick review process, your listing will be shared with millions of potential buyers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sell;