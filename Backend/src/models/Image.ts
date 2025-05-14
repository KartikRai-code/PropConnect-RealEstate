import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  data: Buffer;
  contentType: string;
  filename: string;
}

const imageSchema = new Schema<IImage>({
  data: Buffer,
  contentType: String,
  filename: String,
});

export default mongoose.model<IImage>('Image', imageSchema); 