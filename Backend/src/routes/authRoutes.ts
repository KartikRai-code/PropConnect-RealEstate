import express, { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User'; // Import User model and IUser interface
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();

// Secret for JWT - Should be in .env file for production
const JWT_SECRET = process.env.JWT_SECRET || 'your_very_secret_key_123'; // Add JWT_SECRET to your .env

// --- Registration Route --- 
// Route: POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // 2. Create new user instance (password will be hashed by pre-save hook)
    user = new User({
      name,
      email,
      password,
    });

    // 3. Save the user to the database
    await user.save();
    console.log('User saved successfully:', user);

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Generated token:', token);

    const response = {
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
    console.log('Sending response:', response);

    res.status(201).json(response);

  } catch (error: any) {
    console.error('Registration Error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

// --- Login Route --- 
// Route: POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    console.log('User found:', { id: user.id, email: user.email });

    // 2. Compare submitted password with stored hash
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match for user:', email);
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 3. Generate JWT with the exact same payload structure as expected in auth middleware
    const tokenPayload = {
      id: user.id,
      email: user.email
    };
    console.log('Creating token with payload:', tokenPayload);

    const token = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Generated token for user:', { id: user.id, tokenLength: token.length });

    const response = {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
    console.log('Sending login response:', { ...response, token: '***' });

    res.status(200).json(response);

  } catch (error: any) {
    console.error('Login Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Get current user information
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error while fetching user data' });
  }
});

export default router; 