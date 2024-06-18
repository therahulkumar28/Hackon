import mongoose, { Schema, Document } from 'mongoose';

export interface ISavingDetail {
  source: string;
  amount: number;
}

export interface ITransaction {
  _id?:mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  productName: string;
  type: 'purchase' | 'credit'; // 'purchase' or 'credit'
  originalPrice: number;
  finalPrice: number;
  purchaseSavings: ISavingDetail[]; // Savings due to discounts on products
  creditSavings: ISavingDetail[]; // Savings due to credits like credit cards, gift cards, etc.
 
}

export interface ICustomer extends Document {
  name: string;
  email: string;
  address: string;
  phone: string;
  transactions: ITransaction[];
  spendingLimit: number;
  thresholdLimit: number;
  monthlySavings: {
    year: number;
    month: number;
    totalSavings: number;
  }[];
  yearlySavings: {
    year: number;
    totalSavings: number;
  }[];
}

const SavingDetailSchema: Schema = new Schema({
  source: { type: String, required: true },
  amount: { type: Number, required: true }
});

const TransactionSchema: Schema = new Schema({
  productId: { type: mongoose.Types.ObjectId, required: true },
  productName: { type: String, required: true },
  type: { type: String, enum: ['purchase', 'credit'], required: true },
  originalPrice: { type: Number, required: true },
  finalPrice: { type: Number, required: true },
  purchaseSavings: [SavingDetailSchema], // Savings due to discounts on products
  creditSavings: [SavingDetailSchema], // Savings due to credits like credit cards, gift cards, etc.
}, { timestamps: true });

const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  transactions: [TransactionSchema],
  spendingLimit: { type: Number, required: true },
  thresholdLimit: { type: Number, required: true },
  monthlySavings: [{
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    totalSavings: { type: Number, required: true }
  }],
  yearlySavings: [{
    year: { type: Number, required: true },
    totalSavings: { type: Number, required: true }
  }]
}, { timestamps: true });

const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
