import express from 'express';
import BuyProperty from '../models/buyProperty';
import { authenticateToken } from '../middleware/auth';
import mongoose from 'mongoose';

const router = express.Router();

// Debug route to test the connection and show DB status
router.get('/test', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const stateMap: { [key: number]: string } = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Count documents in collection
    const count = await BuyProperty.countDocuments();
    
    res.json({ 
      message: 'Buy properties route is working',
      dbStatus: stateMap[dbState],
      propertiesCount: count
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error checking database status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all buy properties with search functionality
router.get('/', async (req, res) => {
  try {
    console.log('Attempting to fetch properties...'); // Debug log
    
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected. Current state:', mongoose.connection.readyState);
      return res.status(500).json({ message: 'Database connection not ready' });
    }

    const { search, city, type } = req.query;
    let query: any = {};

    // If search term exists, create a search query
    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { location: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
        { propertyType: searchRegex }
      ];
    }

    // If city filter exists
    if (city) {
      query.location = new RegExp(String(city), 'i');
    }

    // If property type filter exists
    if (type) {
      query.propertyType = new RegExp(String(type), 'i');
    }

    console.log('Search query:', query); // Debug log

    const properties = await BuyProperty.find(query)
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${properties.length} properties`); // Debug log
    
    if (!properties || properties.length === 0) {
      return res.status(404).json({ 
        message: 'No properties found',
        query: { search, city, type }
      });
    }

    res.json(properties);
  } catch (error) {
    console.error('Error in /api/properties/buy:', error); // Debug log
    res.status(500).json({ 
      message: 'Error fetching buy properties',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get a single buy property
router.get('/:id', async (req, res) => {
  try {
    const property = await BuyProperty.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Buy property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching buy property:', error);
    res.status(500).json({ 
      message: 'Error fetching buy property',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create a new buy property (protected route)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const property = new BuyProperty({
      ...req.body,
      agentId: req.user.id
    });
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating buy property:', error);
    res.status(400).json({ 
      message: 'Error creating buy property',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 