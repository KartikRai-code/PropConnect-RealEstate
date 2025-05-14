import { Request, Response } from 'express';
import BecomeAgent from '../models/becomeAgent';

export const submitAgentApplication = async (req: Request, res: Response) => {
  try {
    console.log('Received agent application request:', req.body);
    
    const { firstName, lastName, email, phone, experience, licenseNumber, about } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !phone || experience === undefined || !licenseNumber) {
      console.log('Validation failed:', { firstName, lastName, email, phone, experience, licenseNumber });
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    // Create new agent application
    const newAgentApplication = new BecomeAgent({
      firstName,
      lastName,
      email,
      phone,
      experience: Number(experience),
      licenseNumber,
      about,
      status: 'pending',
      submittedAt: new Date()
    });
    
    // Save to database
    const savedApplication = await newAgentApplication.save();
    console.log('Agent application saved successfully:', savedApplication._id);
    
    return res.status(201).json({ 
      message: 'Agent application submitted successfully',
      application: savedApplication
    });
  } catch (error) {
    console.error('Error submitting agent application:', error);
    return res.status(500).json({ message: 'Failed to submit application' });
  }
};