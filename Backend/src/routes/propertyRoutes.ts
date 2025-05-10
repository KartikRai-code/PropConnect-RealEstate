import express, { Router, Request, Response } from 'express';
import Property from '../models/property';
import mongoose from 'mongoose';
import protect, { AuthRequest } from '../middleware/authMiddleware';
import { 
  getAllProperties, 
  getPropertyById, 
  createProperty, 
  updateProperty, 
  deleteProperty,
  getFeaturedProperties 
} from '../controllers/propertyController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();

// Public routes
router.get('/', getAllProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:id', getPropertyById);

// Protected routes
router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

// Route: GET /api/properties
router.get('/', async (req: Request, res: Response) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    if (!properties || properties.length === 0) {
      return res.status(404).json({ message: 'No properties found.' });
    }
    res.status(200).json(properties);
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Server error while fetching properties.', error: error.message });
  }
});

// Route: GET /api/properties/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const propertyId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid property ID format.' });
    }
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }
    res.status(200).json(property);
  } catch (error: any) {
    console.error(`Error fetching property with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error while fetching property.', error: error.message });
  }
});

// Route: PUT /api/properties/:id
// Desc:  Update an existing property by ID
router.put('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = req.params.id;
    const updateData = req.body;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid property ID format.' });
    }

    // Find the property first to check ownership
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Check if the property being updated belongs to the logged-in user
    if (property.postedBy?.toString() !== req.user?.id) {
      return res.status(401).json({ message: 'User not authorized to update this property' });
    }

    // Now update the property
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      updateData,
      { new: true, runValidators: true }
    );

    // Although we found it earlier, check again in case of race conditions or deletion
    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found during update.' });
    }

    res.status(200).json(updatedProperty);

  } catch (error: any) {
    console.error(`Error updating property with ID ${req.params.id}:`, error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while updating property.', error: error.message });
  }
});

// Route: DELETE /api/properties/:id
// Desc:  Delete a property by ID
router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = req.params.id;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid property ID format.' });
    }

    // Find the property first to check ownership
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Check if the property being deleted belongs to the logged-in user
    if (property.postedBy?.toString() !== req.user?.id) {
      return res.status(401).json({ message: 'User not authorized to delete this property' });
    }
    
    // Now delete the property
    const deletedProperty = await Property.findByIdAndDelete(propertyId);

    // Check if deletion was successful (might fail in rare race conditions)
    if (!deletedProperty) {
       return res.status(404).json({ message: 'Property not found for deletion, possibly already deleted.' });
    }

    res.status(200).json({ message: 'Property deleted successfully.', property: deletedProperty });

  } catch (error: any) {
    console.error(`Error deleting property with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error while deleting property.', error: error.message });
  }
});

export default router;