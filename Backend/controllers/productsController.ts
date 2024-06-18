import { Request, Response } from 'express';
import Product from '../models/productSchema';
import Customer, { ITransaction } from '../models/customerSchema'; 
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

// Buy a product (create a transaction for purchase)


interface ISavingDetail {
  source: string; // 'discount', 'creditCard', 'giftCard', etc.
  amount: number;
}

// Buy a product by ID
export const buyProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const customerId = req.params.customerId ;
    const {  discounts, creditSavings } = req.body; // Assuming discounts and creditSavings are sent in the request body

    // Find the product to be bought
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Find the customer who is buying the product
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    // Calculate final price after applying discounts and additional savings
    let finalPrice = product.price;
    const purchaseSavings: ISavingDetail[] = [];

    // Apply discounts if provided
    if (discounts && discounts.length > 0) {
      for (const discount of discounts) {
        purchaseSavings.push({
          source: 'discount', // Assuming discount source is provided in the request
          amount: discount.amount // Assuming amount of discount is provided in the request
        });
        finalPrice -= discount.amount; // Reduce final price by the discount amount
      }
    }

    // Apply credit savings if provided
    if (creditSavings && creditSavings.length > 0) {
      for (const saving of creditSavings) {
        purchaseSavings.push({
          source: saving.source, // Assuming source of credit saving is provided in the request
          amount: saving.amount // Assuming amount of credit saving is provided in the request
        });
        // Adjust final price according to the credit savings logic, if applicable
        // For example, if credit savings are additional discounts, subtract them from final price
        // finalPrice -= saving.amount;
      }
    }

    // Create a new transaction
    const transaction:ITransaction = {
      productId:new Types.ObjectId(productId),
      productName: product.name,
      type: 'purchase', // Assuming this is a purchase transaction
      originalPrice: product.price,
      finalPrice: finalPrice,
      purchaseSavings: purchaseSavings,
      creditSavings: creditSavings,
   
    };

    // Add transaction to customer's transactions array
    customer.transactions.push(transaction);

    // Save updated customer document with new transaction
    await customer.save();

    res.status(200).json({ message: 'Product purchased successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Error buying product', error: error });
  }
};
