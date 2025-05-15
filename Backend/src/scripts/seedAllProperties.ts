import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/property';
import RentalProperty from '../models/rentalProperty';
import BuyProperty from '../models/buyProperty';

dotenv.config();

const sampleProperties = [
  {
    title: "Featured Luxury Apartment",
    description: "Amazing luxury apartment with both buying and renting options",
    price: 450000,
    location: "100 Premium Ave, City Center",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    propertyType: "apartment",
    images: ["luxury1.jpg", "luxury2.jpg"],
    amenities: ["Pool", "Gym", "Security", "Parking"],
    featured: true,
    status: "both",
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "Modern Family Home",
    description: "Beautiful modern home in a prime location",
    price: 350000,
    location: "200 Family Lane, Suburbs",
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    propertyType: "house",
    images: ["modern1.jpg"],
    amenities: ["Garden", "Garage", "Security"],
    featured: true,
    status: "forSale",
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "City View Apartment",
    description: "Stunning apartment with panoramic city views",
    price: 2800,
    location: "300 Sky Tower, Downtown",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    propertyType: "apartment",
    images: ["cityview1.jpg"],
    amenities: ["Balcony", "Gym", "Concierge"],
    featured: true,
    status: "forRent",
    agentId: new mongoose.Types.ObjectId()
  }
];

const sampleRentalProperties = [
  {
    title: "Modern Downtown Apartment",
    description: "Luxurious 2-bedroom apartment in the heart of downtown",
    price: 2500,
    location: "123 Downtown Ave, City Center",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    propertyType: "apartment",
    images: ["apartment1.jpg"],
    amenities: ["Parking", "Gym", "Pool", "Security"],
    availableFrom: new Date("2024-05-01"),
    minimumLease: 12,
    deposit: 2500,
    petsAllowed: true,
    furnished: true,
    utilities: ["Water", "Internet", "Cable"],
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "Cozy Studio near University",
    description: "Perfect for students, fully furnished studio apartment",
    price: 1200,
    location: "456 College St, University District",
    bedrooms: 0,
    bathrooms: 1,
    area: 500,
    propertyType: "studio",
    images: ["studio1.jpg"],
    amenities: ["Furnished", "Internet", "Laundry"],
    availableFrom: new Date("2024-04-15"),
    minimumLease: 6,
    deposit: 1200,
    petsAllowed: false,
    furnished: true,
    utilities: ["All Inclusive"],
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "Family House for Rent",
    description: "Spacious family home in quiet neighborhood",
    price: 3000,
    location: "789 Suburban Lane, Green Valley",
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    propertyType: "house",
    images: ["house1.jpg"],
    amenities: ["Garage", "Garden", "Central AC"],
    availableFrom: new Date("2024-06-01"),
    minimumLease: 12,
    deposit: 3000,
    petsAllowed: true,
    furnished: false,
    utilities: ["Tenant Responsible"],
    agentId: new mongoose.Types.ObjectId()
  }
];

const sampleBuyProperties = [
  {
    title: "Luxury Penthouse",
    description: "Exclusive penthouse with premium finishes",
    price: 1200000,
    location: "1000 Skyline Blvd, Downtown",
    bedrooms: 3,
    bathrooms: 3.5,
    area: 2800,
    propertyType: "penthouse",
    images: ["penthouse1.jpg"],
    amenities: ["Private Elevator", "Terrace", "Wine Cellar"],
    yearBuilt: 2023,
    parkingSpaces: 2,
    propertyTax: 12000,
    constructionStatus: "ready",
    possession: new Date("2024-05-01"),
    builder: "Premium Developers",
    reraId: "RERA123456",
    floorPlan: ["floorplan1.jpg", "floorplan2.jpg"],
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "New Construction Townhouse",
    description: "Modern townhouse in upcoming neighborhood",
    price: 450000,
    location: "777 Green Street, Eco Village",
    bedrooms: 3,
    bathrooms: 2.5,
    area: 1800,
    propertyType: "townhouse",
    images: ["townhouse1.jpg"],
    amenities: ["Solar Panels", "Smart Home", "EV Charging"],
    yearBuilt: 2024,
    parkingSpaces: 1,
    propertyTax: 4500,
    constructionStatus: "underConstruction",
    possession: new Date("2024-12-01"),
    builder: "Green Builders",
    reraId: "RERA789012",
    floorPlan: ["floorplan3.jpg"],
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "Historic Villa",
    description: "Beautifully restored historic villa",
    price: 850000,
    location: "321 Heritage Ave, Old Town",
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    propertyType: "villa",
    images: ["villa1.jpg"],
    amenities: ["Pool", "Wine Cellar", "Garden"],
    yearBuilt: 1935,
    parkingSpaces: 2,
    propertyTax: 8500,
    constructionStatus: "ready",
    possession: new Date("2024-06-01"),
    builder: "Heritage Restoration",
    reraId: "RERA345678",
    floorPlan: ["floorplan4.jpg"],
    agentId: new mongoose.Types.ObjectId()
  }
];

async function seedAllProperties() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing properties
    await Property.deleteMany({});
    await RentalProperty.deleteMany({});
    await BuyProperty.deleteMany({});
    console.log('Cleared existing properties');

    // Insert new properties
    const properties = await Property.insertMany(sampleProperties);
    const rentalProperties = await RentalProperty.insertMany(sampleRentalProperties);
    const buyProperties = await BuyProperty.insertMany(sampleBuyProperties);
    
    console.log(`Successfully inserted:
    - ${properties.length} featured properties
    - ${rentalProperties.length} rental properties
    - ${buyProperties.length} properties for sale`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding properties:', error);
    process.exit(1);
  }
}

seedAllProperties(); 