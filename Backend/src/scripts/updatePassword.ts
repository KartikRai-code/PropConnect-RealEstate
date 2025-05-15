import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const updatePassword = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in environment variables');
    }
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Get the users collection
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    const users = db.collection('users');

    // Find the user by email
    const user = await users.findOne({ email: 'raikartik2004@gmail.com' });
    if (!user) {
      throw new Error('User not found');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // Update the user's password
    await users.updateOne(
      { email: 'raikartik2004@gmail.com' },
      { $set: { password: hashedPassword } }
    );

    console.log('Password updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
  }
};

updatePassword(); 