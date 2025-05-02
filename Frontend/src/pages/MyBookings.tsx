import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Property {
  _id: string;
  title: string;
  location: string;
  images: string[];
}

interface Booking {
  _id: string;
  propertyId: string;
  propertyType: 'rental' | 'buy';
  tourDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  property?: Property;
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view your bookings');
          return;
        }

        // Fetch bookings
        const bookingsResponse = await axios.get('http://localhost:5001/api/tour-bookings/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const bookingsData = bookingsResponse.data;

        // Fetch property details for each booking
        const bookingsWithProperties = await Promise.all(
          bookingsData.map(async (booking: Booking) => {
            try {
              const endpoint = booking.propertyType === 'rental'
                ? `http://localhost:5001/api/rental-properties/${booking.propertyId}`
                : `http://localhost:5001/api/properties/buy/${booking.propertyId}`;

              const propertyResponse = await axios.get(endpoint);
              return {
                ...booking,
                property: propertyResponse.data
              };
            } catch (err) {
              console.error(`Error fetching property ${booking.propertyId}:`, err);
              return booking;
            }
          })
        );

        setBookings(bookingsWithProperties);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">{error}</h1>
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tour Bookings</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your property tour appointments
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600">No bookings found</h2>
            <Link
              to="/"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {booking.property ? (
                  <>
                    <div className="relative h-48">
                      <img
                        src={booking.property.images[0] || '/placeholder-property.jpg'}
                        alt={booking.property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {booking.property.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        {booking.property.location}
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Tour Date</span>
                          <span className="text-sm font-medium">
                            {new Date(booking.tourDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Time</span>
                          <span className="text-sm font-medium">
                            {new Date(booking.tourDate).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            })}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Status</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Type</span>
                          <span className="text-sm font-medium capitalize">
                            {booking.propertyType}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Link
                          to={`/property/${booking.propertyId}`}
                          state={{ isRental: booking.propertyType === 'rental' }}
                          className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          View Property
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">Property no longer available</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Tour Date</span>
                        <span className="text-sm font-medium">
                          {new Date(booking.tourDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Cancelled
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings; 