import mongoose, { Document, Schema } from 'mongoose';

export interface IBuyProperty extends Document {
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
  yearBuilt: number;
  parkingSpaces: number;
  propertyTax: number;
  constructionStatus: 'ready' | 'underConstruction' | 'preConstruction';
  possession: Date;
  builder: string;
  reraId: string;
  floorPlan: string[];
  agentId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const buyPropertySchema = new Schema<IBuyProperty>({
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
  yearBuilt: { type: Number },
  parkingSpaces: { type: Number, default: 0 },
  propertyTax: { type: Number },
  constructionStatus: { 
    type: String, 
    enum: ['ready', 'underConstruction', 'preConstruction'],
    required: true 
  },
  possession: { type: Date },
  builder: { type: String },
  reraId: { type: String },
  floorPlan: [{ type: String }],
  agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true,
  collection: 'buyproperties'
});

export default mongoose.model<IBuyProperty>('BuyProperty', buyPropertySchema); 