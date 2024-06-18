import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  discountThreshold?: number; // Optional: Threshold for automatic discount triggering
}

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  discountThreshold: { type: Number }, // Optional field for discount threshold
},{timestamps:true});

export default mongoose.model<IProduct>('Product', productSchema);
