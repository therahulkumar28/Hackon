import { Request, Response } from 'express';
import Customer, { ICustomer } from '../models/customerSchema';
import {  ISavingDetail , ITransaction } from '../models/customerSchema';

// Create a new customer
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, address, phone, spendingLimit, spendingNotifications, thresholdLimit } = req.body;

    // Check if a customer already exists with the given email or phone number
    const existingCustomer = await Customer.findOne({
      $or: [{ email: email }, { phone: phone }]
    });

    if (existingCustomer) {
      // If customer already exists, return a 409 Conflict status
     res.status(409).json({ message: 'Customer already exists with the provided email or phone number.' });
     return ;
    }

    const newCustomer = new Customer({
      name,
      email,
      address,
      phone,
      transactions: [],
      spendingLimit,
      thresholdLimit,
      spendingNotifications,
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
    const { customerId, type, productId, productName, category , originalPrice, savingsDetails } = req.body;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    let transaction: ITransaction | undefined;

    if (type === 'purchase') {
     
    const discountSavings = savingsDetails.filter((saving: ISavingDetail) => saving.source === 'discount');
    const creditSavings = savingsDetails.filter((saving: ISavingDetail) => saving.source !== 'discount');
    const totalDiscountSavings = discountSavings.reduce((sum: number, saving: ISavingDetail) => sum + saving.amount, 0);
    const totalCreditSavings = creditSavings.reduce((sum: number, saving: ISavingDetail) => sum + saving.amount, 0);
    const totalSavings = totalDiscountSavings + totalCreditSavings;
      transaction = {
        productId,
        productName,
        category ,
        type,
        originalPrice,
        finalPrice: originalPrice - totalSavings ,
        purchaseSavings: discountSavings,
        creditSavings: creditSavings,
      
      };
    } else  {
      transaction = {
        productId,
        productName,
        category ,
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
      if (!customer.monthlySavings) {
        customer.monthlySavings = [];
      }
      
      if (!customer.yearlySavings) {
        customer.yearlySavings = [];
      }
      // Update monthly and yearly savings
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // Update monthly savings
        // Update monthly savings
        const existingMonthlySavings = customer.monthlySavings.find(s => s.year === year && s.month === month);
        const totalSavings = savingsDetails.reduce((sum: number, saving: ISavingDetail) => sum + saving.amount, 0);
        const totalExpenditure = transaction.type === 'purchase' ? transaction.finalPrice : 0;
        const totalDiscountSavings = savingsDetails.filter((saving: ISavingDetail) => saving.source === 'discount').reduce((sum: number, saving: ISavingDetail) => sum + saving.amount, 0);
        const totalCreditSavings = savingsDetails.filter((saving: ISavingDetail) => saving.source !== 'discount').reduce((sum: number, saving: ISavingDetail) => sum + saving.amount, 0);
     
        if (existingMonthlySavings) {
          existingMonthlySavings.totalSavings += totalSavings;
          existingMonthlySavings.discountSavings += totalDiscountSavings;
          existingMonthlySavings.creditSavings += totalCreditSavings;
          existingMonthlySavings.totalExpenditure += totalExpenditure;
        } else {
          customer.monthlySavings.push({
            year,
            month,
            totalSavings,
            discountSavings: totalDiscountSavings,
            creditSavings: totalCreditSavings,
            totalExpenditure,
          });
        }
  
        // Update yearly savings
        const existingYearlySavings = customer.yearlySavings.find(s => s.year === year);
        if (existingYearlySavings) {
          existingYearlySavings.totalSavings += totalSavings;
          existingYearlySavings.discountSavings += totalDiscountSavings;
          existingYearlySavings.creditSavings += totalCreditSavings;
          existingYearlySavings.totalExpenditure += totalExpenditure;
        } else {
          customer.yearlySavings.push({
            year,
            totalSavings,
            discountSavings: totalDiscountSavings,
            creditSavings: totalCreditSavings,
            totalExpenditure: totalExpenditure,
          });
        }
  
      
      await customer.save();
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error: error });
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
// get transactions for customers
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
      } else {
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
//setPurchaseLimit
export const setPurchaseLimit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const {spendingLimit , thresholdLimit , spendingNotifications} = req.body;
    const customer = await Customer.findById(customerId);
    
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    customer.spendingLimit = spendingLimit;
    customer.thresholdLimit = thresholdLimit ;
    customer.spendingNotifications = spendingNotifications;
    await customer.save();

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error setting purchase limit', error });
  }
};
// getPurchaseLimit
export const getPurchaseLimit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId, 'spendingLimit  thresholdLimit spendingNotifications');

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchase limit', error });
  }
};




export const getSpendingByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id).populate('transactions');

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    const spendingByCategory = customer.transactions.reduce((acc: { [key: string]: { totalExpenditure: number, discountSavings: number, creditSavings: number, totalSavings: number } }, transaction: ITransaction) => {
      const category = transaction.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { totalExpenditure: 0, discountSavings: 0, creditSavings: 0, totalSavings: 0 };
      }

      const discountSavings = transaction.purchaseSavings.reduce((sum, saving) => sum + saving.amount, 0);
      const creditSavings = transaction.creditSavings.reduce((sum, saving) => sum + saving.amount, 0);
      const totalSavings = discountSavings + creditSavings;

      acc[category].totalExpenditure += transaction.finalPrice;
      acc[category].discountSavings += discountSavings;
      acc[category].creditSavings += creditSavings;
      acc[category].totalSavings += totalSavings;

      return acc;
    }, {});

    res.status(200).json(spendingByCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching spending by category', error });
  }
};