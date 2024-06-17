import mongoose, { Schema, Document } from 'mongoose';

interface ICustomer extends Document {
  name: string;
  email: string;
  address: string;
  phone: string;
  purchases: mongoose.Types.ObjectId[];
}

const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
