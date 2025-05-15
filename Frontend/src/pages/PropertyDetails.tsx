import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPropertyById, getRentalPropertyById, Property } from '../services/propertyService';
import TourBookingForm from '../components/TourBookingForm';
import { FaShare, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const isRentalProperty = location.state?.isRental || location.pathname.includes('/rental') || document.referrer.includes('/rent');

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = isRentalProperty 
          ? await getRentalPropertyById(id)
          : await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, location, isRentalProperty]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out this property: ${property?.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || 'Property not found'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* Image Gallery */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative">
            <img
              src={property.images?.[currentImageIndex] || ''}
              alt={property.title}
              className="w-full h-[500px] object-cover"
            />
            {property.images && property.images.length > 1 && (
              <>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + property.images!.length) % property.images!.length)}
                    className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="bg-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {property.images?.length}
                  </span>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % property.images!.length)}
                    className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                {/* Thumbnail Navigation */}
                <div className="absolute bottom-20 left-0 right-0 px-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {property.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${property.title} - ${index + 1}`}
                        className={`w-20 h-20 object-cover rounded cursor-pointer ${
                          currentImageIndex === index ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Price */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                  <p className="text-gray-600 mt-2">
                    <FaMapMarkerAlt className="inline mr-2" />
                    {property.location}
                  </p>
                </div>
                <button
                  onClick={handleShare}
                  className="text-gray-600 hover:text-blue-600"
                >
                  <FaShare className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-blue-600">
                  ₹{property.price?.toLocaleString('en-IN') || 'Price on Request'}
                </p>
                <p className="text-gray-500">
                  {property.area?.toLocaleString('en-IN') || '0'} sq ft
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <FaBed className="text-blue-600 mr-2" />
                  <span>{property.bedrooms || 0} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <FaBath className="text-blue-600 mr-2" />
                  <span>{property.bathrooms || 0} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <FaRulerCombined className="text-blue-600 mr-2" />
                  <span>{property.area?.toLocaleString('en-IN') || '0'} sq ft</span>
                </div>
                <div className="flex items-center">
                  <FaBuilding className="text-blue-600 mr-2" />
                  <span>{property.propertyType || 'Not Specified'}</span>
                </div>
                {property.builder && (
                  <div className="flex items-center">
                    <FaInfoCircle className="text-blue-600 mr-2" />
                    <span>{property.builder}</span>
                  </div>
                )}
                {property.possession && (
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-blue-600 mr-2" />
                    <span>Possession: {property.possession}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tour Booking */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Schedule a Tour</h2>
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book a Tour
              </button>
              {property.floorPlan && property.floorPlan.length > 0 && (
                <button
                  onClick={() => {
                    const url = property.floorPlan?.[0];
                    if (url) window.open(url, '_blank');
                  }}
                  className="w-full mt-4 border border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  View Floor Plan
                </button>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium">{property.propertyType || 'Not Specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Area</span>
                  <span className="font-medium">{property.area?.toLocaleString('en-IN') || '0'} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms</span>
                  <span className="font-medium">{property.bedrooms || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms</span>
                  <span className="font-medium">{property.bathrooms || 0}</span>
                </div>
                {property.builder && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Builder</span>
                    <span className="font-medium">{property.builder}</span>
                  </div>
                )}
                {property.possession && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Possession</span>
                    <span className="font-medium">{property.possession}</span>
                  </div>
                )}
                {property.reraId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">RERA ID</span>
                    <span className="font-medium">{property.reraId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Booking Form Modal */}
      {showBookingForm && property && (
        <TourBookingForm
          propertyId={property._id}
          propertyType={isRentalProperty ? 'rental' : 'buy'}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
};

export default PropertyDetails; 