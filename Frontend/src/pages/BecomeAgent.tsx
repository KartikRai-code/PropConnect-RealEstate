import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitAgentApplication } from '../services/agentService';

const BecomeAgent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experience: '',
    licenseNumber: '',
    about: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Log the form data for debugging
      console.log('Form data being submitted:', formData);
      
      // Make sure experience is converted to a number
      const applicationData = {
        ...formData,
        experience: Number(formData.experience),
      };
      
      await submitAgentApplication(applicationData);
      navigate('/agent-verification-success');
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80"
          alt="Real Estate Office"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-indigo-900/80 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Join Our Elite Team of
              <span className="block text-indigo-400">Real Estate Professionals</span>
            </h1>
            <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
              Take your real estate career to the next level with PropConnect's innovative platform and supportive community.
            </p>
          </div>

          {/* Form Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>
              )}
              {/* Personal Information */}
              <div className="bg-indigo-50/50 rounded-xl p-6 space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 border-b border-indigo-100 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      required
                      className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      required
                      className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-indigo-50/50 rounded-xl p-6 space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 border-b border-indigo-100 pb-2">
                  Contact Details
                </h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-indigo-50/50 rounded-xl p-6 space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 border-b border-indigo-100 pb-2">
                  Professional Details
                </h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experience"
                      id="experience"
                      required
                      min="0"
                      className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                      License Number
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      id="licenseNumber"
                      required
                      className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                    Tell us about yourself
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    rows={4}
                    required
                    className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                    value={formData.about}
                    onChange={handleChange}
                    placeholder="Share your experience, specialties, and why you want to join PropConnect..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-lg font-semibold rounded-lg shadow-lg hover:from-indigo-700 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-150 hover:scale-105"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeAgent;