import mongoose, { Schema, Document } from 'mongoose';

export interface ITourBooking extends Document {
  propertyId: string;
  propertyType: 'rental' | 'buy';
  userId: string;
  tourDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const tourBookingSchema = new Schema({
  propertyId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'propertyType'
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['rental', 'buy']
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  tourDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true // This will automatically add createdAt and updatedAt fields
});

export const TourBooking = mongoose.model<ITourBooking>('TourBooking', tourBookingSchema); 