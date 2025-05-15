import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getRentalProperties, getNewlyAddedRentalProperties, Property } from '../services/propertyService';

const Rent: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [properties, setProperties] = useState<Property[]>([]);
  const [newlyAddedProperties, setNewlyAddedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        const [allProperties, newProperties] = await Promise.all([
          getRentalProperties(),
          getNewlyAddedRentalProperties()
        ]);
        setProperties(allProperties);
        setNewlyAddedProperties(newProperties);
      } catch (err: any) {
        console.error('Error fetching properties:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch properties';
        setError(errorMessage);
        setProperties([]);
        setNewlyAddedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter properties based on search query and filters
  const filteredProperties = properties.filter(property => {
    // Search query filter
    if (searchQuery && !property.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Price filters
    if (filters.minPrice && property.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && property.price > Number(filters.maxPrice)) return false;
    
    // Bedroom and bathroom filters
    if (filters.bedrooms && property.bedrooms !== Number(filters.bedrooms)) return false;
    if (filters.bathrooms && property.bathrooms !== Number(filters.bathrooms)) return false;
    
    return true;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            alt="Rental Properties Background"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Perfect Rental
            </h1>
            <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
              {searchQuery ? `Showing rentals in ${searchQuery}` : 'Discover the perfect rental property for your needs'}
            </p>
            {/* Search Bar */}
            <form
              onSubmit={e => {
                e.preventDefault();
                navigate(`/rent?search=${encodeURIComponent(searchInput.trim())}`);
              }}
              className="mt-8 flex justify-center"
            >
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Enter location (e.g., Mumbai, Delhi, Bangalore)"
                className="w-full max-w-md px-6 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-medium"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Rental Properties Search Results */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Showing rentals in "{searchQuery}"
          </h2>
          {filteredProperties.length === 0 ? (
            <div className="text-gray-500 text-center">No rental properties found for this location.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      ₹{property.price.toLocaleString('en-IN')}/mo
                    </div>
                    <h3 className="text-xl text-gray-900 font-semibold mb-2">
                      {property.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{property.location}</p>
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <span>{property.bedrooms} BHK</span>
                      <span>{property.bathrooms} Bath</span>
                    </div>
                    <Link
                      to={`/property/${property._id}`}
                      state={{ isRental: true }}
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
      )}

      {/* Newly Added Properties Section */}
      {!searchQuery && (
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-gray-900">Newly-added properties</h2>
            <p className="mt-1 text-sm text-gray-600">Fresh listings to check out</p>
            <div className="mt-6 relative">
              <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                {newlyAddedProperties.map((property) => (
                  <div key={property._id} className="flex-shrink-0 w-72 bg-white rounded-lg shadow overflow-hidden">
                    <Link 
                      to={`/property/${property._id}`}
                      state={{ isRental: true }}
                      className="block"
                    >
                      <img
                        className="h-40 w-full object-cover"
                        src={property.images[0]}
                        alt={property.title}
                      />
                    </Link>
                    <div className="p-4">
                      <Link 
                        to={`/property/${property._id}`}
                        state={{ isRental: true }}
                        className="block hover:text-indigo-600"
                      >
                        <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{property.propertyType}</p>
                        <p className="text-sm text-gray-500 truncate mt-1">{property.location}</p>
                        <p className="text-[20px] font-semibold text-blue-600 mt-2">
                          ₹{property.price.toLocaleString('en-IN')}/mo
                        </p>
                      </Link>
                      <Link
                        to={`/property/${property._id}`}
                        state={{ isRental: true }}
                        className="mt-4 w-full inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-[15px] text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
                {/* Optional: Add a 'View More' card or button here */}
              </div>
              {/* Optional: Add scroll arrows if needed for better UX on non-touch devices */}
            </div>
          </div>
        </div>
      )}

      {/* "Have a property to sell?" CTA Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Have a property to sell?</h2>
          <Link 
            to="/sell"
            className="block bg-gradient-to-r from-indigo-100 via-purple-50 to-indigo-100 p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-lg font-medium text-gray-700 text-center sm:text-left">
                List your property & connect with clients faster!
              </p>
              <button 
                className="flex-shrink-0 px-6 py-2 bg-white text-indigo-700 border border-indigo-600 rounded-md font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sell your property
              </button>
            </div>
          </Link>
        </div>
      </div>

      {/* Popular Searches Section - REMOVED */}

      {/* Trust & Verification Section */}
      <div className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Why Rent with PropConnect?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We are committed to providing you with the most trusted and verified rental properties in India. Every listing goes through a rigorous 3-step verification process to ensure your peace of mind.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-indigo-50 rounded-xl shadow">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-indigo-700">Trusted Properties</h3>
              <p className="text-gray-600">All listings are handpicked and regularly reviewed for authenticity and quality.</p>
            </div>
            <div className="p-8 bg-indigo-50 rounded-xl shadow">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-indigo-700">3-Step Verified Listings</h3>
              <p className="text-gray-600">Background checks, on-site visits, and document verification for every property.</p>
            </div>
            <div className="p-8 bg-indigo-50 rounded-xl shadow">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-indigo-700">Expert Support</h3>
              <p className="text-gray-600">Our team is here to guide you at every step, from search to move-in.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* If you have a Footer component, use it here: */}
      {/* <Footer /> */}
    </div>
  );
};

// Helper CSS to hide scrollbar (optional, might need browser prefixes)
const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;

document.head.appendChild(document.createElement('style')).textContent = styles;

export default Rent;