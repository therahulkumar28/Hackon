import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
 
} from '../controllers/productsController';

const router = express.Router();

// Route to create a new product
router.post('/products', createProduct);

// Route to get all products
router.get('/products', getAllProducts);

// Route to get a single product by ID
router.get('/products/:id', getProductById);

// Route to update a product by ID
router.put('/products/:id', updateProduct);

// Route to delete a product by ID
router.delete('/products/:id', deleteProduct);

// Route to buy a product by ID
//router.post('/products/:productId/buy/:customerId', buyProduct);
export default router;
