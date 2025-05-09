import express from 'express';
import RentalProperty from '../models/rentalProperty';
import { authenticateToken } from '../middleware/auth';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

const router = express.Router();

// Get newly added properties
router.get('/newly-added', async (req, res) => {
  try {
    const properties = await RentalProperty.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('agentId', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching newly added properties' });
  }
});

// Get all rental properties
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all rental properties');
    const properties = await RentalProperty.find().populate('agentId', 'name email');
    console.log('Found properties:', properties);
    res.json(properties);
  } catch (error) {
    console.error('Error in rental properties route:', error);
    res.status(500).json({ message: 'Error fetching rental properties' });
  }
});

// Get a single rental property
router.get('/:id', async (req, res) => {
  try {
    const property = await RentalProperty.findById(req.params.id).populate('agentId', 'name email');
    if (!property) {
      return res.status(404).json({ message: 'Rental property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rental property' });
  }
});

// Create a new rental property (protected route)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const property = new RentalProperty({
      ...req.body,
      agentId: req.user.id
    });
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: 'Error creating rental property' });
  }
});

// Update a rental property (protected route)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const property = await RentalProperty.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Rental property not found' });
    }
    if (property.agentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }
    const updatedProperty = await RentalProperty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProperty);
  } catch (error) {
    res.status(400).json({ message: 'Error updating rental property' });
  }
});

// Delete a rental property (protected route)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const property = await RentalProperty.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Rental property not found' });
    }
    if (property.agentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }
    await RentalProperty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rental property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting rental property' });
  }
});

export default router; 