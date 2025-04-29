import axios from 'axios';

const API_URL = 'http://localhost:5001/api/properties';

export interface Property {
  _id: string;
  title: string;
  type: string;
  address: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  image: string;
  description: string;
  keyFeatures: string[];
  amenities: string[];
  builder?: string;
  possession?: string;
  rera?: string;
  floorPlan?: string;
  images?: string[];
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getProperties = async (): Promise<Property[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getPropertyById = async (id: string): Promise<Property> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const getFeaturedProperties = async (): Promise<Property[]> => {
  const response = await axios.get(`${API_URL}?featured=true`);
  return response.data;
}; 