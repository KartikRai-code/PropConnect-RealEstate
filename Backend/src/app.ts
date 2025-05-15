import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import rentalPropertyRoutes from './routes/rentalProperty';
import listingPropertyRoutes from './routes/listingPropertyRoutes';
import uploadRoutes from './routes/upload';
import path from 'path';
import becomeAgentRoutes from './routes/becomeAgentRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rental-properties', rentalPropertyRoutes);
app.use('/api/listing-properties', listingPropertyRoutes);
app.use('/api/upload', uploadRoutes);

// Debug: Log all incoming requests to /api/becomeagent
app.use('/api/becomeagent', (req, res, next) => {
  console.log(`[DEBUG] Incoming request to /api/becomeagent:`, req.method, req.url, req.body);
  next();
});

// Register the becomeAgentRoutes after the logger
app.use('/api/becomeagent', becomeAgentRoutes); // This must come after the logger

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/realestate';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.error('Connection string used:', MONGO_URI);
  });

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;