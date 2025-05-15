import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProperties, Property } from '../services/propertyService';
import { motion, useScroll, useTransform } from 'framer-motion';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [listingType, setListingType] = useState<'buy' | 'rent'>('buy');
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const allProperties = await getProperties();
        setProperties(allProperties);
      } catch (err) {
        setError('Failed to fetch properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Auto-rotate featured properties
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % properties.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [properties.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/${listingType}?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Newsletter subscribe handler
  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNewsletterPopup(true);
    setNewsletterEmail('');
    setTimeout(() => setShowNewsletterPopup(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section with Parallax */}
      <motion.div 
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative h-screen"
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
            alt="Modern Home"
            className="absolute min-w-full min-h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Dream Home
            </h1>
            <p className="text-xl text-gray-200 mb-12">
              Discover the perfect property that matches your lifestyle
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl shadow-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex gap-3">
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as 'buy' | 'rent')}
                    className="px-6 py-4 rounded-xl border-0 bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 text-lg"
                  >
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                  </select>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter location, property type, or keywords..."
                    className="flex-1 px-6 py-4 rounded-xl border-0 bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Properties Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600">
              Discover our handpicked selection of premium properties
            </p>
          </motion.div>

          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {properties.map((property, index) => (
                  <motion.div
                    key={property._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="relative">
                        <img
                          src={property.images?.[0]}
                          alt={property.title}
                          className="w-full h-80 object-cover"
                        />
                        {property.featured && (
                          <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                            Featured
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h3>
                        <p className="text-gray-600 mb-4">{property.location}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-2xl font-bold text-blue-600">
                            ₹{property.price.toLocaleString('en-IN')}
                          </p>
                          <button
                            onClick={() => navigate(`/property/${property._id}`)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 gap-2">
              {properties.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'bg-blue-600 w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to find your perfect property
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Buy Property',
                description: 'Find your dream home from our extensive collection of properties',
                icon: '🏠',
                link: '/buy'
              },
              {
                title: 'Rent Property',
                description: 'Discover rental properties that match your lifestyle',
                icon: '🔑',
                link: '/rent'
              },
              {
                title: 'Sell Property',
                description: 'List your property and connect with potential buyers',
                icon: '💰',
                link: '/sell'
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <Link
                  to={service.link}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Learn More
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Subscribe to our newsletter for the latest property updates
            </p>
            <form className="max-w-md mx-auto" onSubmit={handleNewsletterSubscribe}>
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-lg"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 focus:ring-2 focus:ring-white text-lg font-medium transition-all duration-200"
                >
                  Subscribe
                </button>
              </div>
            </form>
            {showNewsletterPopup && (
              <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50">
                You have subscribed! You will now receive news regarding new properties through our platform.
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <span>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="20" fill="#222"/>
                  <ellipse cx="13.5" cy="17.5" rx="4.5" ry="5.5" fill="#fff"/>
                  <ellipse cx="26.5" cy="17.5" rx="4.5" ry="5.5" fill="#fff"/>
                  <circle cx="13.5" cy="18.5" r="2" fill="#222"/>
                  <circle cx="26.5" cy="18.5" r="2" fill="#222"/>
                  <ellipse cx="20" cy="28" rx="8" ry="3" fill="#fff"/>
                </svg>
              </span>
              <span>PropConnect Reviews</span>
            </h2>
            <div className="flex justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-6 h-6 text-green-500 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
              ))}
            </div>
            <p className="text-gray-600 text-lg">See how PropConnect has helped people find their dream home!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col">
              <div className="flex gap-2 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                ))}
              </div>
              <p className="text-gray-700 flex-1">“PropConnect made my home search so easy! I found my dream apartment in just a week. The listings were accurate and the support team was super helpful.”</p>
              <div className="flex items-center gap-3 mt-4">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="user" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-semibold text-gray-900">Priya Sharma</div>
                  <div className="text-gray-500 text-xs">2024-05-10</div>
                </div>
              </div>
            </div>
            {/* Review 2 */}
            <div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col">
              <div className="flex gap-2 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                ))}
              </div>
              <p className="text-gray-700 flex-1">“I was able to compare so many properties and finally found a house that fit my budget and needs. Highly recommend PropConnect to anyone looking for a new home!”</p>
              <div className="flex items-center gap-3 mt-4">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="user" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-semibold text-gray-900">Rahul Verma</div>
                  <div className="text-gray-500 text-xs">2024-05-08</div>
                </div>
              </div>
            </div>
            {/* Review 3 */}
            <div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col">
              <div className="flex gap-2 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                ))}
              </div>
              <p className="text-gray-700 flex-1">“The user interface is so clean and easy to use. I loved the detailed filters and the quick responses from property owners. Found my perfect flat in no time!”</p>
              <div className="flex items-center gap-3 mt-4">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="user" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-semibold text-gray-900">Sneha Patel</div>
                  <div className="text-gray-500 text-xs">2024-05-05</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 