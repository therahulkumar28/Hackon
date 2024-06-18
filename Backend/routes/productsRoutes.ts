import { Router } from 'express';
import { createProduct } from '../controllers/productsController';

const router = Router();

router.post('/products', createProduct);

export default router;
