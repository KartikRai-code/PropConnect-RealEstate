import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

// Retrieve ENV vars once at the top level
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001'; // Add backend URL to .env or use default

const ListProperty: React.FC = () => {
  const [formData, setFormData] = useState({
    listingType: 'sell',
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
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for API errors
  const [isSubmitting, setIsSubmitting] = useState(false); // State for loading indicator
  const [uploadProgress, setUploadProgress] = useState<number | null>(null); // Track upload progress
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
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

  // Function to upload images to Cloudinary
  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      console.error('Cloudinary ENV vars missing!');
      throw new Error('Image upload is not configured. Please contact support.');
    }
    setUploadProgress(0);
    const uploadedUrls: string[] = [];
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`; // Use constant

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); // Use constant

      try {
        const response = await axios.post(url, uploadFormData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              const overallPercent = Math.round(((i + percentCompleted / 100) / files.length) * 100);
              setUploadProgress(overallPercent);
            }
          }
        });
        uploadedUrls.push(response.data.secure_url);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        throw new Error(`Failed to upload image ${file.name}.`);
      }
    }
    setUploadProgress(100);
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
        setError('Please select at least one image.');
        return;
    }
    // Check constants directly
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setError('Image upload configuration is missing. Contact support.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const imageUrls = await uploadImages(formData.images);
      setUploadProgress(null);
      const apiData = { 
        ...formData,
        images: imageUrls, // Use the URLs from Cloudinary
      };
      
      // Retrieve token safely
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = userInfo?.token;
      
      const config = {
        headers: {
           Authorization: token ? `Bearer ${token}` : '', // Only add header if token exists
        }
      };

      // Use API_BASE_URL constant
      const response = await axios.post(`${API_BASE_URL}/api/properties`, apiData, config);

      if (response.status === 201) {
        console.log('Property listed:', response.data);
        setIsSubmitted(true);
        setTimeout(() => {
          navigate('/home');
        }, 3000);
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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            List Your Property
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Fill out the details below. Fields marked with * are required.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
           {/* Listing Type (Sale/Rent) */}
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">List for *</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="listingType"
                    value="sell"
                    checked={formData.listingType === 'sell'}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Sale</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="listingType"
                    value="rent"
                    checked={formData.listingType === 'rent'}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Rent</span>
                </label>
              </div>
            </div>

          {/* Property Type and Price */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Property Type *</label>
              <select
                name="propertyType"
                id="propertyType"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                {formData.listingType === 'rent' ? 'Monthly Rent (₹) *' : 'Asking Price (₹) *'}
              </label>
              <input
                type="number"
                name="price"
                id="price"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.price}
                onChange={handleChange}
                placeholder={formData.listingType === 'rent' ? 'e.g., 15000' : 'e.g., 5000000'}
              />
            </div>
          </div>

          {/* Address Fields */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street Address *</label>
            <input
              type="text"
              name="address"
              id="address"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
              <input type="text" name="city" id="city" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.city} onChange={handleChange}/>
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State *</label>
              <input type="text" name="state" id="state" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.state} onChange={handleChange}/>
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP / Postal Code *</label>
              <input type="text" name="zipCode" id="zipCode" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.zipCode} onChange={handleChange}/>
            </div>
          </div>

          {/* Bed/Bath/SqFt */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms *</label>
              <input type="number" name="bedrooms" id="bedrooms" required min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.bedrooms} onChange={handleChange}/>
            </div>
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms *</label>
              <input type="number" name="bathrooms" id="bathrooms" required min="0" step="0.5" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.bathrooms} onChange={handleChange}/>
            </div>
            <div>
              <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700">Square Feet *</label>
              <input type="number" name="squareFeet" id="squareFeet" required min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.squareFeet} onChange={handleChange}/>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              name="description"
              id="description"
              rows={4}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your property, including features, amenities, and nearby attractions..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">Property Images *</label>
            <input
              type="file"
              name="images"
              id="images"
              multiple
              accept="image/*"
              required
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500">Select one or more images.</p>
            {/* Display selected file names (optional) */}
            {formData.images.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                Selected: {formData.images.map(f => f.name).join(', ')}
              </div>
            )}
          </div>

          {/* Upload Progress Bar */}
          {uploadProgress !== null && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                      className="bg-indigo-600 h-2.5 rounded-full transition-width duration-300 ease-in-out" 
                      style={{ width: `${uploadProgress}%` }}
                  ></div>
              </div>
          )}

          {/* Display API Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || uploadProgress !== null && uploadProgress < 100}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${isSubmitting || uploadProgress !== null && uploadProgress < 100 ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isSubmitting ? (uploadProgress !== null ? `Uploading (${uploadProgress}%)...` : 'Submitting...') : 'Submit Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListProperty; 