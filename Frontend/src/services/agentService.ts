import axios from 'axios';

// Make sure this URL matches your backend server address and port
const API_URL = 'http://localhost:5001/api';

export interface AgentApplication {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: number;
  licenseNumber: string;
  about?: string;
}

export const submitAgentApplication = async (applicationData: AgentApplication) => {
  try {
    console.log('Submitting agent application:', applicationData);
    // Make sure this endpoint matches exactly what's in your app.ts file
    const response = await axios.post(`${API_URL}/becomeagent`, applicationData);
    console.log('Agent application submitted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting agent application:', error);
    throw error;
  }
};