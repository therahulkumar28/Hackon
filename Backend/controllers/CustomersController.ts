import { Request, Response } from 'express';
import Customer, { ICustomer } from '../models/customerSchema';
import {  ISavingDetail , ITransaction } from '../models/customerSchema';

// Create a new customer
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, address, phone, spendingLimit, thresholdLimit } = req.body;

    const newCustomer = new Customer({
      name,
      email,
      address,
      phone,
      transactions: [],
      spendingLimit,
      thresholdLimit,
      monthlySavings: [],
      yearlySavings: []
    });

    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error: error });
  }
};

// Add a transaction (purchase a product or credit)
export const addTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, type, productId, productName, originalPrice, savingsDetails } = req.body;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    let transaction: ITransaction | undefined;

    if (type === 'purchase') {
      const discountSavings = savingsDetails.filter((saving: ISavingDetail) => saving.source === 'discount');
      const creditSavings = savingsDetails.filter((saving: ISavingDetail) => saving.source !== 'discount');

      transaction = {
        productId,
        productName,
        type,
        originalPrice,
        finalPrice: originalPrice - discountSavings.reduce((sum: number, saving: ISavingDetail) => sum + saving.amount, 0),
        purchaseSavings: discountSavings,
        creditSavings: creditSavings
      };
    } else if (type === 'credit') {
      transaction = {
        productId,
        productName,
        type,
        originalPrice,
        finalPrice: 0, // Assuming credits don't affect final price
        purchaseSavings: [],
        creditSavings: savingsDetails
      };
    }

    if (transaction) {
      customer.transactions.push(transaction);
      await customer.save();

      // Update monthly and yearly savings
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // Update monthly savings
      const existingMonthlySavings = customer.monthlySavings.find(s => s.year === year && s.month === month);
      const totalSavings = savingsDetails.reduce((sum: number, saving: ISavingDetail) => sum + saving.amount, 0);

      if (existingMonthlySavings) {
        existingMonthlySavings.totalSavings += totalSavings;
      } else {
        customer.monthlySavings.push({ year, month, totalSavings });
      }

      // Update yearly savings
      const existingYearlySavings = customer.yearlySavings.find(s => s.year === year);
      if (existingYearlySavings) {
        existingYearlySavings.totalSavings += totalSavings;
      } else {
        customer.yearlySavings.push({ year, totalSavings });
      }

      await customer.save();
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error: error });
  }
};

// Update savings for a transaction
export const updateSavings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, transactionId, type, savingsDetails } = req.body;
    const customer: ICustomer | null = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    // Find the transaction by ID within customer's transactions array
    const transaction = customer.transactions.find(t => t._id?.equals(transactionId));

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    // Update savings details based on transaction type
    if (type === 'purchase') {
      transaction.purchaseSavings = savingsDetails;
      transaction.finalPrice = transaction.originalPrice - savingsDetails.reduce((sum: number, saving: { amount: number }) => sum + saving.amount, 0);
    } else if (type === 'credit') {
      transaction.creditSavings = savingsDetails;
    }

    // Save the updated customer document
    await customer.save();

    // Respond with the updated customer object (you may choose to respond with the updated transaction instead)
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating savings', error: error });
  }
};

export const getAllExpenditure = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    // Filter transactions to include only 'purchase' type
    const expenditureTransactions = customer.transactions.filter((transaction: ITransaction) => transaction.type === 'purchase');

    // Calculate total expenditure
    const totalExpenditure = expenditureTransactions.reduce((total: number, transaction: ITransaction) => total + transaction.finalPrice, 0);

    res.status(200).json({ totalExpenditure });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenditure', error: error });
  }
};

// Fetch monthly savings for a customer
export const getMonthlySavings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.status(200).json(customer.monthlySavings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching monthly savings', error: error });
  }
};

// Fetch yearly savings for a customer
export const getYearlySavings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.status(200).json(customer.yearlySavings);
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

    const savings = {
      purchaseSavings: [] as { productName: string; savings: ISavingDetail[] }[], // Initialize as empty array
      creditSavings: [] as { productName: string; savings: ISavingDetail[] }[] // Initialize as empty array
    };

    customer.transactions.forEach((transaction: ITransaction) => {
      if (transaction.type === 'purchase') {
        savings.purchaseSavings.push({
          productName: transaction.productName,
          savings: transaction.purchaseSavings
        });
      } else if (transaction.type === 'credit') {
        savings.creditSavings.push({
          productName: transaction.productName,
          savings: transaction.creditSavings
        });
      }
    });

    res.status(200).json(savings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching savings', error: error });
  }
};

// Fetch customer by ID
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error: error });
  }
};

// Update customer details
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const { name, email, address, phone, spendingLimit, thresholdLimit } = req.body;
    const customer = await Customer.findByIdAndUpdate(customerId, { name, email, address, phone, spendingLimit, thresholdLimit }, { new: true });

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error: error });
  }
};

// Delete customer
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findByIdAndDelete(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error: error });
  }
};