import mongoose, { Document, Schema } from 'mongoose';

export interface IListingProperty extends Document {
  listFor: 'Sale' | 'Rent';
  propertyType: string;
  askingPrice: number;
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
  };
  propertyDetails: {
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
  description: string;
  images: string[];
  postedBy: mongoose.Types.ObjectId;
  postedAt: Date;
}

const listingPropertySchema = new Schema<IListingProperty>({
  listFor: { type: String, enum: ['Sale', 'Rent'], required: true },
  propertyType: { type: String, required: true },
  askingPrice: { type: Number, required: true },
  address: {
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  propertyDetails: {
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: Number, required: true },
  },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IListingProperty>('ListingProperty', listingPropertySchema); 