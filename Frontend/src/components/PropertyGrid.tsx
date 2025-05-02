import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  propertyType: string;
  description: string;
  area: number;
}

const PropertyGrid: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  
  const searchTerm = searchParams.get('search');
  const cityFilter = searchParams.get('city');
  const typeFilter = searchParams.get('type');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build the query string
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (cityFilter) params.append('city', cityFilter);
        if (typeFilter) params.append('type', typeFilter);
        
        const queryString = params.toString();
        const url = `http://localhost:5001/api/properties/buy${queryString ? `?${queryString}` : ''}`;
        
        const response = await axios.get(url);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchTerm, cityFilter, typeFilter]);

  // Function to format price in Indian format with ₹ symbol
  const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    });
    return formatter.format(price);
  };

  // Get the properties to display based on search criteria
  const displayProperties = () => {
    if (searchTerm || cityFilter || typeFilter) {
      // If there's a search query, show all matching properties
      return properties;
    }
    // If no search query, show only the first 3 properties
    return properties.slice(0, 3);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  const propertiesToShow = displayProperties();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">
        {searchTerm 
          ? `Search Results for "${searchTerm}"`
          : cityFilter 
          ? `Properties in ${cityFilter}`
          : typeFilter
          ? `${typeFilter} Properties`
          : "Featured Properties for Sale"}
      </h2>
      {propertiesToShow.length === 0 ? (
        <div className="text-center text-gray-500">
          No properties found for the selected criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propertiesToShow.map((property) => (
            <div key={property._id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="relative">
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {property.propertyType}
                </div>
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatPrice(property.price)}
                </div>
                <h3 className="text-xl text-gray-900 font-semibold mb-2">
                  {property.title}
                </h3>
                <p className="text-gray-600 mb-4">{property.location}</p>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>{property.propertyType}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>{property.bedrooms} BHK</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{property.bathrooms} Bath</span>
                  </div>
                </div>
                <Link
                  to={`/property/${property._id}`}
                  className="block w-full bg-emerald-600 text-white text-center py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGrid; 