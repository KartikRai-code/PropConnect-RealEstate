import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  images: string[];
  amenities: string[];
  featured: boolean;
  status: 'forSale' | 'forRent' | 'both';
  agentId: mongoose.Types.ObjectId;
  postedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true },
  propertyType: { type: String, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['forSale', 'forRent', 'both'], required: true },
  agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});

// Update the updatedAt field before saving
propertySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IProperty>('Property', propertySchema); 