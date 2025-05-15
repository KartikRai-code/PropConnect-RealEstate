import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import Select from 'react-select';

// Retrieve ENV vars once at the top level
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001'; // Add backend URL to .env or use default

const ListProperty: React.FC = () => {
  const [formData, setFormData] = useState({
    listingType: 'sell',
    title: '',
    propertyType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    description: '',
    images: [] as File[], // Still storing File objects locally
    amenities: [] as string[], // Multi-select amenities
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for API errors
  const [isSubmitting, setIsSubmitting] = useState(false); // State for loading indicator
  const [uploadProgress, setUploadProgress] = useState<number | null>(null); // Track upload progress
  const navigate = useNavigate();

  // List of available amenities
  const amenitiesList = [
    'Gym',
    'Swimming Pool',
    'Park',
    'Club House',
    'Power Backup',
    'Security',
    'Lift',
    'Parking',
    'Children Play Area',
    'Garden',
  ];

  // For react-select
  const amenitiesOptions = amenitiesList.map(a => ({ value: a, label: a }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Validation for city and state (alphabets only)
    if (name === 'city' || name === 'state') {
      if (!/^[a-zA-Z ]*$/.test(value)) return;
    }
    // Validation for zipCode (digits only)
    if (name === 'zipCode') {
      if (!/^\d*$/.test(value)) return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        images: Array.from(e.target.files as FileList)
      }));
    }
  };

  // Function to upload images to backend
  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      
      try {
        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100);
        
        const response = await axios.post(
          `${API_BASE_URL}/api/upload`,
          uploadFormData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
              }
            },
          }
        );
        
        if (response.data && response.data.imageUrl) {
        uploadedUrls.push(response.data.imageUrl);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (uploadError: any) {
        console.error('Upload error:', uploadError);
        throw new Error(`Failed to upload image ${file.name}: ${uploadError.message}`);
      }
    }
    return uploadedUrls;
  };

  // Handle react-select multi-select
  const handleAmenitiesChange = (selectedOptions: any) => {
    setFormData(prev => ({
      ...prev,
      amenities: selectedOptions ? selectedOptions.map((opt: any) => opt.value) : []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      setError('Please select at least one image.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const imageUrls = await uploadImages(formData.images);
      setUploadProgress(null);
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const userId = userInfo?.id || userInfo?._id;
      if (!userId) {
        setError('User ID not found. Please log in again.');
        setIsSubmitting(false);
        return;
      }
      const apiData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        location: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.squareFeet),
        propertyType: formData.propertyType,
        images: imageUrls,
        amenities: formData.amenities,
        featured: false,
        status: formData.listingType === 'sell' ? 'forSale' : 'forRent',
        agentId: userId,
        postedBy: userId,
      };
      
      // Retrieve token safely
      const token = localStorage.getItem('token');
      console.log('userInfo from localStorage:', localStorage.getItem('userInfo'));
      console.log('token from localStorage:', localStorage.getItem('token'));
      console.log('token used in header:', token);
      
      const config = {
        headers: {
           Authorization: token ? `Bearer ${token}` : '', // Only add header if token exists
        }
      };
      console.log('config.headers:', config.headers);

      // Use API_BASE_URL constant
      const response = await axios.post(`${API_BASE_URL}/api/properties`, apiData, config);

      if (response.status === 201) {
        console.log('Property listed:', response.data);
        setIsSubmitted(true);
        setTimeout(() => {
          navigate('/home');
        }, 10000);
      } else {
        setError('Failed to list property. Unexpected response.');
      }

    } catch (err: any) {
      console.error('Submission Error:', err);
      setUploadProgress(null); // Clear progress on error
      let errorMessage = 'An error occurred during submission.';
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data.message || JSON.stringify(err.response.data.errors) || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message; // Use error message directly if it has one (e.g., from uploadImages)
      }
      // Handle potential 401 Unauthorized error specifically
      if (err.response?.status === 401) {
         errorMessage = 'Authentication failed. Please log in again. ' + errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      // Keep uploadProgress null after final state
    }
  };

  // Success Message Component
  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Listing Submitted Successfully!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for listing your property with PropConnect. We will review your listing shortly.
          </p>
        </div>
      </div>
    );
  }

  // Form Component
  return (
    <div className="min-h-[calc(100vh-4rem)] relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Real Estate Background"
        />
        <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
      </div>

      <div className="relative max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900">
            List Your Property
          </h2>
            <p className="mt-2 text-lg text-gray-600">
            Fill out the details below. Fields marked with * are required.
          </p>
        </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
           {/* Listing Type (Sale/Rent) */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <label className="block text-lg font-medium text-gray-700 mb-4">List for *</label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="listingType"
                    value="sell"
                    checked={formData.listingType === 'sell'}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300"
                  />
                  <span className="ml-3 text-lg text-gray-700">Sale</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="listingType"
                    value="rent"
                    checked={formData.listingType === 'rent'}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300"
                  />
                  <span className="ml-3 text-lg text-gray-700">Rent</span>
                </label>
              </div>
            </div>

          {/* Property Type and Price */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="bg-indigo-50 p-6 rounded-lg">
                <label htmlFor="title" className="block text-lg font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Spacious Apartment in Delhi"
                />
              </div>
              <div className="bg-indigo-50 p-6 rounded-lg">
                <label htmlFor="propertyType" className="block text-lg font-medium text-gray-700">Property Type *</label>
              <select
                name="propertyType"
                id="propertyType"
                required
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                value={formData.propertyType}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="builder_floor">Builder Floor</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="villa">Villa</option>
                <option value="other">Other</option>
              </select>
            </div>
              <div className="bg-indigo-50 p-6 rounded-lg">
                <label htmlFor="price" className="block text-lg font-medium text-gray-700">
                {formData.listingType === 'rent' ? 'Monthly Rent (₹) *' : 'Asking Price (₹) *'}
              </label>
              <input
                type="number"
                name="price"
                id="price"
                required
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                value={formData.price}
                onChange={handleChange}
                placeholder={formData.listingType === 'rent' ? 'e.g., 15000' : 'e.g., 5000000'}
              />
            </div>
          </div>

            {/* Address Information */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street Address *</label>
            <input
              type="text"
              name="address"
              id="address"
              required
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    required
                    pattern="[A-Za-z ]+"
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    value={formData.city}
                    onChange={handleChange}
                  />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State *</label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    required
                    pattern="[A-Za-z ]+"
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    value={formData.state}
                    onChange={handleChange}
                  />
            </div>
            <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    id="zipCode"
                    required
                    pattern="\d+"
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    value={formData.zipCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
          </div>

            {/* Property Details */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Property Details</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms *</label>
                  <input
                    type="number"
                    name="bedrooms"
                    id="bedrooms"
                    required
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    value={formData.bedrooms}
                    onChange={handleChange}
                  />
            </div>
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms *</label>
                  <input
                    type="number"
                    name="bathrooms"
                    id="bathrooms"
                    required
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    value={formData.bathrooms}
                    onChange={handleChange}
                  />
            </div>
            <div>
                  <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700">Area (sq ft) *</label>
                  <input
                    type="number"
                    name="squareFeet"
                    id="squareFeet"
                    required
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    value={formData.squareFeet}
                    onChange={handleChange}
                  />
                </div>
              </div>
          </div>

          {/* Description */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description *</label>
            <textarea
              name="description"
              id="description"
                required
              rows={4}
                className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              value={formData.description}
              onChange={handleChange}
                placeholder="Describe your property in detail..."
            />
          </div>

          {/* Amenities Multi-Select Dropdown with Checkboxes */}
          <div className="bg-indigo-50 p-6 rounded-lg">
            <label htmlFor="amenities" className="block text-lg font-medium text-gray-700">Amenities</label>
            <Select
              isMulti
              name="amenities"
              options={amenitiesOptions}
              className="mt-2 basic-multi-select"
              classNamePrefix="select"
              value={amenitiesOptions.filter(opt => formData.amenities.includes(opt.value))}
              onChange={handleAmenitiesChange}
              closeMenuOnSelect={false}
            />
          </div>

          {/* Image Upload */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <label className="block text-lg font-medium text-gray-700">Property Images *</label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload images</span>
            <input
                        id="images"
                        name="images"
              type="file"
              multiple
              accept="image/*"
                        className="sr-only"
              onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {formData.images.length} image{formData.images.length !== 1 ? 's' : ''} selected
                  </p>
                  {uploadProgress !== null && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Uploading... {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
            </div>
          )}

          {/* Submit Button */}
            <div className="flex justify-center">
            <button
              type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'List Property'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ListProperty; 