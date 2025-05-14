import express, { Request, Response } from 'express';
import ListingProperty from '../models/ListingProperty';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Create a new listing
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const {
      listFor,
      propertyType,
      askingPrice,
      address,
      propertyDetails,
      description,
      images,
    } = req.body;

    // Validation
    if (!listFor || !['Sale', 'Rent'].includes(listFor)) {
      return res.status(400).json({ message: 'listFor (Sale or Rent) is required.' });
    }
    if (!propertyType) return res.status(400).json({ message: 'propertyType is required.' });
    if (!askingPrice) return res.status(400).json({ message: 'askingPrice is required.' });
    if (!address || !address.streetAddress || !address.city || !address.state || !address.zipCode) {
      return res.status(400).json({ message: 'Complete address is required.' });
    }
    if (
      !propertyDetails ||
      propertyDetails.bedrooms == null ||
      propertyDetails.bathrooms == null ||
      propertyDetails.area == null
    ) {
      return res.status(400).json({ message: 'Complete propertyDetails are required.' });
    }
    if (!description) return res.status(400).json({ message: 'description is required.' });
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }

    const newListing = new ListingProperty({
      listFor,
      propertyType,
      askingPrice,
      address,
      propertyDetails,
      description,
      images,
      postedBy: req.user!.id,
      postedAt: new Date(),
    });

    await newListing.save();
    res.status(201).json({ message: 'Property listed successfully!', listing: newListing });
  } catch (error: any) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

export default router; 