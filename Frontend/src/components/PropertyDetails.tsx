import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  amenities?: string[];
  reraId?: string;
  builderName?: string;
}

interface TourBooking {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [bookingForm, setBookingForm] = useState<TourBooking>({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [bookingStatus, setBookingStatus] = useState<{
    success?: string;
    error?: string;
  }>({});

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/properties/buy/${id}`);
        setProperty(response.data);
      } catch (err) {
        setError('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real application, this would make an API call to save the booking
      // await axios.post(`http://localhost:5001/api/tours/book`, {
      //   propertyId: id,
      //   ...bookingForm
      // });
      setBookingStatus({
        success: 'Tour request submitted successfully! We will contact you shortly.'
      });
      setBookingForm({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        message: ''
      });
    } catch (err) {
      setBookingStatus({
        error: 'Failed to submit tour request. Please try again.'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  if (!property) return <div className="container mx-auto px-4 py-8">Property not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative h-[400px]">
            <img
              src={property.images[activeImage]}
              alt={property.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {property.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${property.title} - ${index + 1}`}
                className={`w-full h-20 object-cover rounded cursor-pointer ${
                  activeImage === index ? 'ring-2 ring-emerald-500' : ''
                }`}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
          <p className="text-2xl font-semibold text-emerald-600">
            {formatPrice(property.price)}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-600">Location</p>
              <p className="font-semibold">{property.location}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Property Type</p>
              <p className="font-semibold">{property.propertyType}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Area</p>
              <p className="font-semibold">{property.area} sq.ft.</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Configuration</p>
              <p className="font-semibold">{property.bedrooms} BHK, {property.bathrooms} Baths</p>
            </div>
          </div>

          {property.reraId && (
            <div className="space-y-2">
              <p className="text-gray-600">RERA ID</p>
              <p className="font-semibold">{property.reraId}</p>
            </div>
          )}

          {property.builderName && (
            <div className="space-y-2">
              <p className="text-gray-600">Builder</p>
              <p className="font-semibold">{property.builderName}</p>
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-gray-700">{property.description}</p>
          </div>

          {property.amenities && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Amenities</h2>
              <div className="grid grid-cols-2 gap-2">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tour Booking Form */}
      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Book a Tour</h2>
        {bookingStatus.success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            {bookingStatus.success}
          </div>
        )}
        {bookingStatus.error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {bookingStatus.error}
          </div>
        )}
        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={bookingForm.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={bookingForm.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={bookingForm.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Preferred Date</label>
            <input
              type="date"
              name="preferredDate"
              value={bookingForm.preferredDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Preferred Time</label>
            <input
              type="time"
              name="preferredTime"
              value={bookingForm.preferredTime}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Message (Optional)</label>
            <textarea
              name="message"
              value={bookingForm.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border rounded focus:ring-emerald-500 focus:border-emerald-500"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
            >
              Schedule Tour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyDetails; 