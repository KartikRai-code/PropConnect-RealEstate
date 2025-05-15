import React from 'react';
import BuyHero from '../components/BuyHero';
import PropertyGrid from '../components/PropertyGrid';
import CityGrid from '../components/CityGrid';

const Buy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BuyHero />
      <div className="space-y-12">
        <PropertyGrid />
        <CityGrid />

        {/* Why Choose Us Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose PropConnect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center">
              <span className="text-4xl mb-4">✅</span>
              <h3 className="text-xl font-semibold mb-2">Most Trusted</h3>
              <p className="text-gray-600">Thousands of happy customers have found their dream home with us.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center">
              <span className="text-4xl mb-4">🔒</span>
              <h3 className="text-xl font-semibold mb-2">Verified Properties</h3>
              <p className="text-gray-600">All listings are verified for authenticity and transparency.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center">
              <span className="text-4xl mb-4">🤝</span>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">Our team is here to guide you at every step of your property journey.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Buy; 