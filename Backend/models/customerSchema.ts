import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
  type: 'spending' | 'saving';
  amount: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ISavingsGoal extends Document {
  goalAmount: number;
  currentAmount: number;
  targetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ICustomer extends Document {
  name: string;
  email: string;
  address: string;
  phone: string;
  transactions: ITransaction[];
  savingsGoals: ISavingsGoal[];
  spendingLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  type: { type: String, enum: ['spending', 'saving'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const SavingsGoalSchema: Schema = new Schema({
  goalAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  targetDate: { type: Date, required: true }
}, { timestamps: true });

const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  transactions: [TransactionSchema],
  savingsGoals: [SavingsGoalSchema],
  spendingLimit: { type: Number, required: true }
}, { timestamps: true });

const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
