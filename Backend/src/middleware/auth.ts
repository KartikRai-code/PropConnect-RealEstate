import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

// Export the AuthRequest interface for type safety
export interface AuthRequest extends Request {
  user?: { 
    id: string;
    email?: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_very_secret_key_123';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    console.log('Extracted token:', token ? 'Token present' : 'No token');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email?: string };
    console.log('Decoded token:', { id: decoded.id, email: decoded.email });

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(403).json({ message: 'Invalid token.' });
  }
};

// Export protect as an alias for authenticateToken for backward compatibility
export const protect = authenticateToken;
export default protect; 