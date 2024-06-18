import { Request, Response } from 'express';
import Customer from '../models/customerSchema';
import Product from '../models/productSchema';
// Create a new customer
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, address, phone, spendingLimit } = req.body;

    const newCustomer = new Customer({
      name,
      email,
      address,
      phone,
      transactions: [],
      savingsGoals: [],
      spendingLimit
    });

    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error: error });
  }
};

// Add a transaction
export const addTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, productId } = req.body;
    const customer = await Customer.findById(customerId);
    const product = await Product.findById(productId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const discountAmount = product.price * (product.discount / 100);
    const spendingAmount = product.price - discountAmount;

    customer.transactions.push({ type: 'saving', amount: discountAmount, date: new Date() } as any);
    customer.transactions.push({ type: 'expense', amount: spendingAmount, date: new Date() } as any);
    await customer.save();

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error: error });
  }
};

// Add a savings goal
export const addSavingsGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, goalAmount} = req.body;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    customer.savingsGoals.push({ goalAmount, currentAmount: 0} as any);
    await customer.save();

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error adding savings goal', error: error });
  }
};

// Get monthly savings
export const getMonthlySavings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    const monthlySavings = await Customer.aggregate([
      { $match: { _id: customer._id } },
      { $unwind: '$transactions' },
      { $match: { 'transactions.type': 'saving' } },
      {
        $group: {
          _id: { year: { $year: '$transactions.createdAt' }, month: { $month: '$transactions.createdAt' } },
          totalSavings: { $sum: '$transactions.amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json(monthlySavings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching monthly savings', error: error });
  }
};

// Get yearly savings
export const getYearlySavings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    const yearlySavings = await Customer.aggregate([
      { $match: { _id: customer._id } },
      { $unwind: '$transactions' },
      { $match: { 'transactions.type': 'saving' } },
      {
        $group: {
          _id: { year: { $year: '$transactions.createdAt' } },
          totalSavings: { $sum: '$transactions.amount' }
        }
      },
      { $sort: { '_id.year': 1 } }
    ]);

    res.status(200).json(yearlySavings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching yearly savings', error: error });
  }
};

// Fetch all customers
export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error });
  }
};

// Fetch all transactions for a customer
export const getAllTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.status(200).json(customer.transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error });
  }
};

// Fetch all savings for a customer
export const getAllSavings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    const savings = customer.transactions.filter(transaction => transaction.type === 'saving');
    res.status(200).json(savings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching savings', error: error });
  }
};

// Fetch all expenditures for a customer
export const getAllExpenditures = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    const expenditures = customer.transactions.filter(transaction => transaction.type === 'spending');
    res.status(200).json(expenditures);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenditures', error: error });
  }
};
