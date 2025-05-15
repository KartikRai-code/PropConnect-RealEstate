import mongoose from 'mongoose';
import dotenv from 'dotenv';
import RentalProperty from '../models/rentalProperty';

dotenv.config();

const sampleProperties = [
  {
    title: "Modern Downtown Apartment",
    description: "Luxurious 2-bedroom apartment in the heart of downtown with city views",
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
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "Cozy Studio near University",
    description: "Perfect for students, fully furnished studio apartment near campus",
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
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "Spacious Family Home",
    description: "Beautiful 4-bedroom house with large backyard and modern amenities",
    price: 3500,
    location: "789 Suburban Lane, Green Valley",
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    propertyType: "house",
    images: ["house1.jpg"],
    amenities: ["Garage", "Garden", "Central AC", "Fireplace"],
    availableFrom: new Date("2024-06-01"),
    minimumLease: 12,
    deposit: 3500,
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "Luxury Penthouse Suite",
    description: "Stunning penthouse with panoramic views and high-end finishes",
    price: 5000,
    location: "1000 Skyline Blvd, Downtown",
    bedrooms: 3,
    bathrooms: 3.5,
    area: 2800,
    propertyType: "penthouse",
    images: ["penthouse1.jpg"],
    amenities: ["Private Elevator", "Terrace", "Smart Home", "Wine Cellar"],
    availableFrom: new Date("2024-05-15"),
    minimumLease: 12,
    deposit: 7500,
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "Charming Cottage",
    description: "Quaint 2-bedroom cottage with beautiful garden and vintage charm",
    price: 1800,
    location: "321 Garden Road, Historic District",
    bedrooms: 2,
    bathrooms: 1,
    area: 1000,
    propertyType: "cottage",
    images: ["cottage1.jpg"],
    amenities: ["Garden", "Porch", "Hardwood Floors"],
    availableFrom: new Date("2024-04-01"),
    minimumLease: 12,
    deposit: 1800,
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "Modern Loft Space",
    description: "Industrial-style loft with high ceilings and exposed brick",
    price: 2200,
    location: "555 Artist Ave, Arts District",
    bedrooms: 1,
    bathrooms: 1.5,
    area: 1100,
    propertyType: "loft",
    images: ["loft1.jpg"],
    amenities: ["High Ceilings", "Industrial Kitchen", "Large Windows"],
    availableFrom: new Date("2024-05-01"),
    minimumLease: 12,
    deposit: 2200,
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "Waterfront Condo",
    description: "Beautiful 2-bedroom condo with stunning water views",
    price: 2800,
    location: "888 Harbor View, Marina District",
    bedrooms: 2,
    bathrooms: 2,
    area: 1300,
    propertyType: "condo",
    images: ["condo1.jpg"],
    amenities: ["Balcony", "Pool", "Gym", "Marina Access"],
    availableFrom: new Date("2024-06-15"),
    minimumLease: 12,
    deposit: 2800,
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "Student-Friendly Apartment",
    description: "Affordable 3-bedroom apartment perfect for student sharing",
    price: 1800,
    location: "444 Campus Drive, University Area",
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    propertyType: "apartment",
    images: ["student1.jpg"],
    amenities: ["Study Room", "Internet", "Bike Storage"],
    availableFrom: new Date("2024-08-01"),
    minimumLease: 9,
    deposit: 1800,
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "Eco-Friendly Townhouse",
    description: "Modern townhouse with solar panels and energy-efficient features",
    price: 2600,
    location: "777 Green Street, Eco Village",
    bedrooms: 3,
    bathrooms: 2.5,
    area: 1800,
    propertyType: "townhouse",
    images: ["townhouse1.jpg"],
    amenities: ["Solar Panels", "EV Charging", "Smart Thermostat"],
    availableFrom: new Date("2024-07-01"),
    minimumLease: 12,
    deposit: 2600,
    agentId: new mongoose.Types.ObjectId()
  },
  {
    title: "Mountain View Cabin",
    description: "Rustic cabin with modern amenities and spectacular mountain views",
    price: 1600,
    location: "999 Mountain Road, Highland Area",
    bedrooms: 2,
    bathrooms: 1,
    area: 900,
    propertyType: "cabin",
    images: ["cabin1.jpg"],
    amenities: ["Fireplace", "Deck", "Mountain Views"],
    availableFrom: new Date("2024-06-01"),
    minimumLease: 6,
    deposit: 1600,
    agentId: new mongoose.Types.ObjectId()
  }
];

async function seedProperties() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing properties
    await RentalProperty.deleteMany({});
    console.log('Cleared existing properties');

    // Insert new properties
    const result = await RentalProperty.insertMany(sampleProperties);
    console.log(`Successfully inserted ${result.length} properties`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding properties:', error);
    process.exit(1);
  }
}

seedProperties(); 