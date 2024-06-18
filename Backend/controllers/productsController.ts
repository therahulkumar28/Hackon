import { Request, Response } from 'express';
import Product from '../models/productSchema';
import Customer, { ICustomer, ISavingDetail, ITransaction } from '../models/customerSchema'; 
import { Types } from 'mongoose';
// Create a new product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, discountThreshold } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      discountThreshold, 
    });

  
    if (discountThreshold && price >= discountThreshold) {
     
      newProduct.price = price - (price * 0.1); 
    }

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error });
  }
};


// Get all products
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error });
  }
};

// Get a product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error });
  }
};

// Update a product by ID
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const { name, description, price, category, discountThreshold } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, price, category, discountThreshold },
      { new: true }
    );

    if (!updatedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error });
  }
};

// Delete a product by ID
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error });
  }
};


// Buy a product by ID


export const buyProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, customerId } = req.params;
    const { discounts, creditSavings } = req.body;

    const product = await Product.findById(productId);
    const customer= await Customer.findById(customerId);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    const productDiscount = discounts.find((discount: ISavingDetail) => discount.source === 'product_discount') || { amount: 0 };
    const finalPrice = product.price - productDiscount.amount;
    
    const purchaseSavings = discounts.filter((discount: ISavingDetail) => discount.source !== 'discount');
    
    const transaction: ITransaction = {
      productId: new Types.ObjectId(productId),
      productName: product.name,
      type: 'purchase',
      originalPrice: product.price,
      finalPrice: finalPrice,
      purchaseSavings: [productDiscount, ...purchaseSavings],
      creditSavings: creditSavings,
   
    };

    customer.transactions.push(transaction);

    // Update monthly and yearly savings
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const totalSavings = [...purchaseSavings, ...creditSavings].reduce((sum: number, saving: ISavingDetail) => sum + saving.amount, 0);

    // Update monthly savings
    const existingMonthlySavings = customer.monthlySavings.find(s => s.year === year && s.month === month);

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

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error processing purchase', error: error });
  }
};

