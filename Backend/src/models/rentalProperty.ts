import mongoose, { Document, Schema } from 'mongoose';

export interface IRentalProperty extends Document {
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
  availableFrom: Date;
  minimumLease: number;
  deposit: number;
  petsAllowed: boolean;
  furnished: boolean;
  utilities: string[];
  agentId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const rentalPropertySchema = new Schema<IRentalProperty>({
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
  availableFrom: { type: Date, required: true },
  minimumLease: { type: Number, required: true },
  deposit: { type: Number, required: true },
  petsAllowed: { type: Boolean, default: false },
  furnished: { type: Boolean, default: false },
  utilities: [{ type: String }],
  agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true,
  collection: 'rentalproperties'
});

export default mongoose.model<IRentalProperty>('RentalProperty', rentalPropertySchema); 