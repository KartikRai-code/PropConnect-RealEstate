import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload';
import path from 'path';
import multer from 'multer';
import Image from './models/Image';

// Import Routes
import propertyRoutes from './routes/propertyRoutes';
import authRoutes from './routes/authRoutes';
import tourBookingRoutes from './routes/tourBookingRoutes';
import buyPropertyRoutes from './routes/buyPropertyRoutes';
import rentalPropertyRoutes from './routes/rentalProperty';
import becomeAgentRoutes from './routes/becomeAgentRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5001;

// CORS configuration
const corsOptions = {
  origin: ['https://propconnect.vercel.app', 'https://propconnect-realestate-2.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('Error: MONGO_URI is not defined in the .env file');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected successfully');
    
    // Serve static files from the uploads directory
    app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
    
    // API Routes - Only mount routes after successful DB connection
    // More specific routes first
    app.use('/api/properties/buy', buyPropertyRoutes);
    app.use('/api/properties', propertyRoutes);
    app.use('/api/rental-properties', rentalPropertyRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/tour-bookings', tourBookingRoutes);
    app.use('/api/upload', uploadRoutes);
    app.use('/api/becomeagent', becomeAgentRoutes);

    // Basic Route
    app.get('/', (req: Request, res: Response) => {
      res.send('PropConnect Backend API Running!');
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

const router = express.Router();
const upload = multer();

router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const newImage = new Image({
      data: req.file.buffer,
      contentType: req.file.mimetype,
      filename: req.file.originalname,
    });
    await newImage.save();
    res.json({ imageId: newImage._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save image to database', error: err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).send('Not found');
    res.contentType(image.contentType);
    res.send(image.data);
  } catch (err) {
    res.status(500).send('Error retrieving image');
  }
});

export default app; 