import mongoose from 'mongoose';
import RentalProperty from '../models/rentalProperty';
import BuyProperty from '../models/buyProperty';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

async function seedData() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create dummy rental property
    const dummyRental = {
      title: "Luxury 2BHK Apartment for Rent",
      description: "Beautiful apartment with modern amenities",
      price: 25000,
      location: "Bangalore, Karnataka",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      propertyType: "Apartment",
      images: ["https://example.com/image1.jpg"],
      amenities: ["Swimming Pool", "Gym", "Security"],
      availableFrom: new Date(),
      minimumLease: 12,
      deposit: 50000,
      petsAllowed: true,
      furnished: true,
      utilities: ["Water", "Electricity", "Internet"],
      agentId: new mongoose.Types.ObjectId()
    };

    // Create dummy buy property
    const dummyBuy = {
      title: "3BHK Villa for Sale",
      description: "Spacious villa in prime location",
      price: 9500000,
      location: "Mumbai, Maharashtra",
      bedrooms: 3,
      bathrooms: 3,
      area: 2000,
      propertyType: "Villa",
      images: ["https://example.com/image2.jpg"],
      amenities: ["Garden", "Parking", "24/7 Security"],
      yearBuilt: 2020,
      parkingSpaces: 2,
      propertyTax: 12000,
      constructionStatus: "ready",
      possession: new Date(),
      builder: "Premium Builders",
      reraId: "RERA123456",
      floorPlan: ["https://example.com/floorplan1.jpg"],
      agentId: new mongoose.Types.ObjectId()
    };

    // Insert the dummy data
    const rental = await RentalProperty.create(dummyRental);
    console.log('Rental property created:', rental._id);
    
    const buy = await BuyProperty.create(dummyBuy);
    console.log('Buy property created:', buy._id);

    console.log('Dummy data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

seedData(); 