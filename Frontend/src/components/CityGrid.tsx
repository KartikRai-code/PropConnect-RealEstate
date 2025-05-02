import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface City {
  name: string;
  propertyCount: number;
  imageUrl: string;
  state: string;
}

const CityGrid: React.FC = () => {
  const navigate = useNavigate();
  
  const cities: City[] = [
    {
      name: 'Mumbai',
      state: 'Maharashtra',
      propertyCount: 1245,
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    },
    {
      name: 'Bangalore',
      state: 'Karnataka',
      propertyCount: 983,
      imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2148&q=80',
    },
    {
      name: 'Delhi',
      state: 'Delhi NCR',
      propertyCount: 1567,
      imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    },
    {
      name: 'Hyderabad',
      state: 'Telangana',
      propertyCount: 756,
      imageUrl: 'https://images.unsplash.com/photo-1606298855672-1c5b614a8ea2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    },
    {
      name: 'Chennai',
      state: 'Tamil Nadu',
      propertyCount: 892,
      imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    }
  ];

  const handleCityClick = (cityName: string) => {
    navigate(`/buy?city=${cityName}`);
    // Scroll to top to show filtered results
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">
          Browse Properties by City
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <button
              key={city.name}
              onClick={() => handleCityClick(city.name)}
              className="group relative overflow-hidden rounded-xl aspect-[4/3] shadow-lg hover:shadow-xl transition-all duration-300 w-full"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${city.imageUrl})`,
                }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {city.name}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {city.state}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {city.propertyCount}
                    </p>
                    <p className="text-white/90 text-sm">
                      Properties
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityGrid; 