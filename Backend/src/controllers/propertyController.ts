import { Request, Response } from 'express';
import Property from '../models/property';

export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties' });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching property' });
  }
};

export const createProperty = async (req: Request, res: Response) => {
  try {
    const newProperty = new Property(req.body);
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Error creating property' });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Error updating property' });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deletedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ message: 'Property deleted', property: deletedProperty });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property' });
  }
};

export const getFeaturedProperties = async (req: Request, res: Response) => {
  try {
    const featuredProperties = await Property.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(6);
    
    res.status(200).json(featuredProperties);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    res.status(500).json({ message: 'Error fetching featured properties' });
  }
}; 