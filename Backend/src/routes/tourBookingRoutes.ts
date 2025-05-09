import express, { Request, Response } from 'express';
import { TourBooking } from '../models/tourBooking';
import RentalProperty from '../models/rentalProperty';
import BuyProperty from '../models/buyProperty';
import { authenticateToken } from '../middleware/auth';
import { Model } from 'mongoose';

const router = express.Router();

// Create a new tour booking
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    console.log('Received tour booking request:', {
      body: req.body,
      user: req.user,
      headers: {
        ...req.headers,
        authorization: req.headers.authorization ? 'Bearer [token]' : undefined
      }
    });

    const { propertyId, propertyType, tourDate } = req.body;
    
    if (!req.user?.id) {
      console.log('User not authenticated');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!propertyId || !tourDate || !propertyType) {
      console.log('Missing required fields:', { propertyId, propertyType, tourDate });
      return res.status(400).json({ message: 'PropertyId, propertyType, and tourDate are required' });
    }

    const booking = new TourBooking({
      propertyId,
      propertyType,
      userId: req.user.id,
      tourDate: new Date(tourDate)
    });

    console.log('Creating tour booking:', booking);

    await booking.save();
    console.log('Tour booking saved successfully:', booking);
    
    res.status(201).json(booking);
  } catch (error: any) {
    console.error('Error creating tour booking:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: 'Error creating tour booking', error: error.message });
  }
});

// Get user's tour bookings
router.get('/user', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const bookings = await TourBooking.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    const populatedBookings = await Promise.all(bookings.map(async (booking) => {
      try {
        const PropertyModel: Model<any> = booking.propertyType === 'rental' ? RentalProperty : BuyProperty;
        const property = await PropertyModel.findById(booking.propertyId).exec();
        
        return {
          ...booking.toObject(),
          propertyId: booking.propertyId,
          propertyType: booking.propertyType,
          property: property ? {
            _id: property._id,
            title: property.title,
            location: property.location,
            images: property.images
          } : null
        };
      } catch (err) {
        console.error(`Error fetching property for booking ${booking._id}:`, err);
        return {
          ...booking.toObject(),
          propertyId: booking.propertyId,
          propertyType: booking.propertyType,
          property: null
        };
      }
    }));

    res.json(populatedBookings);
  } catch (error) {
    console.error('Error fetching tour bookings:', error);
    res.status(500).json({ message: 'Error fetching tour bookings', error });
  }
});

export default router; 