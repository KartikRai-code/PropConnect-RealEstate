import axios from 'axios';

const API_URL = 'http://localhost:5001/api';
const BUY_API_URL = `${API_URL}/properties/buy`;
const RENT_API_URL = `${API_URL}/rental-properties`;

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  images: string[];
  amenities: string[];
  featured?: boolean;
  yearBuilt?: number;
  parkingSpaces?: number;
  propertyTax?: number;
  constructionStatus?: 'ready' | 'underConstruction' | 'preConstruction';
  possession?: string;
  builder?: string;
  reraId?: string;
  floorPlan?: string[];
  agentId: string;
  createdAt?: string;
  updatedAt?: string;
  // Rental specific properties
  availableFrom?: Date;
  minimumLease?: number;
  deposit?: number;
  petsAllowed?: boolean;
  furnished?: boolean;
  utilities?: string[];
}

export const getProperties = async (): Promise<Property[]> => {
  const response = await axios.get(BUY_API_URL);
  return response.data;
};

export const getRentalProperties = async (): Promise<Property[]> => {
  try {
    const response = await axios.get(RENT_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching rental properties:', error);
    throw error;
  }
};

export const getNewlyAddedRentalProperties = async (): Promise<Property[]> => {
  try {
    const response = await axios.get(`${RENT_API_URL}/newly-added`);
    return response.data;
  } catch (error) {
    console.error('Error fetching newly added properties:', error);
    throw error;
  }
};

export const getPropertyById = async (id: string): Promise<Property> => {
  try {
    const response = await axios.get(`${BUY_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};

export const getRentalPropertyById = async (id: string): Promise<Property> => {
  try {
    const response = await axios.get(`${RENT_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rental property:', error);
    throw error;
  }
};

export const getFeaturedProperties = async (): Promise<Property[]> => {
  const response = await axios.get(`${BUY_API_URL}?featured=true`);
  return response.data;
};

export const submitAgentApplication = async (formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: number;
  licenseNumber: string;
  about?: string;
}) => {
  const response = await axios.post(`${API_URL}/becomeagent`, formData);
  return response.data;
};