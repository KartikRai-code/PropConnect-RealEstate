import mongoose, { Document, Schema } from 'mongoose';

export interface IBecomeAgent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: number;
  licenseNumber: string;
  about?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  updatedAt?: Date;
}

const becomeAgentSchema = new Schema<IBecomeAgent>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  experience: { type: Number, required: true },
  licenseNumber: { type: String, required: true },
  about: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const BecomeAgent = mongoose.model<IBecomeAgent>('BecomeAgent', becomeAgentSchema);

export default BecomeAgent;