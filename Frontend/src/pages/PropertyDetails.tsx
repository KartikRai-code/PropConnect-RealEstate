import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  images: string[];
  features: string[];
}

interface BookingFormData {
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
  });

  // Sample property data - in a real app, this would come from an API
  const property: Property = {
    id: 1,
    title: 'Modern Downtown Apartment',
    price: 450000,
    address: '123 Main St, New York, NY',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    description: 'This stunning modern apartment features an open floor plan, high ceilings, and floor-to-ceiling windows offering breathtaking city views. The gourmet kitchen is equipped with stainless steel appliances and custom cabinetry. The master suite includes a walk-in closet and spa-like bathroom. Building amenities include a fitness center, rooftop terrace, and 24/7 concierge service.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ],
    features: [
      'Open floor plan',
      'High ceilings',
      'Floor-to-ceiling windows',
      'Gourmet kitchen',
      'Stainless steel appliances',
      'Walk-in closet',
      'Spa-like bathroom',
      'Fitness center',
      'Rooftop terrace',
      '24/7 concierge',
    ],
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would typically make an API call to save the booking
      console.log('Booking submitted:', bookingData);
      alert('Tour booking request submitted successfully! An agent will contact you shortly.');
      setShowBookingForm(false);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking. Please try again.');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Listings
        </button>

        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-x-8">
          <div>
            <div className="relative h-[500px] mb-8 rounded-lg overflow-hidden">
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                →
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`mx-1 w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{property.title}</h1>
            <p className="mt-2 text-2xl font-medium text-gray-900">
              ${property.price.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-gray-500">{property.address}</p>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Description</h2>
              <p className="mt-2 text-gray-500">{property.description}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Features</h2>
              <ul className="mt-2 grid grid-cols-2 gap-2">
                {property.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-500">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Property Details</h2>
              <dl className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Bedrooms</dt>
                  <dd className="text-sm text-gray-900">{property.bedrooms}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Bathrooms</dt>
                  <dd className="text-sm text-gray-900">{property.bathrooms}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Square Feet</dt>
                  <dd className="text-sm text-gray-900">{property.squareFeet.toLocaleString()}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-8">
              {!showBookingForm ? (
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Book a Tour
                </button>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4">Schedule a Tour</h3>
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Time
                      </label>
                      <select
                        value={bookingData.time}
                        onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                        required
                      >
                        <option value="">Select a time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={bookingData.name}
                        onChange={(e) => setBookingData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBookingForm(false)}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails; 