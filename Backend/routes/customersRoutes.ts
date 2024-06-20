import { Router } from 'express';
import {
  createCustomer,
  addTransaction,
  getMonthlySavings,
  getYearlySavings,
  getAllCustomers,
  getAllTransactions,
  getAllSavings,
  getAllExpenditure,
  setPurchaseLimit ,
  getPurchaseLimit ,
} from '../controllers/CustomersController';
import { checkThresholds } from '../middlewares/notificationMiddleware';

const router = Router();

// Create a new customer
router.post('/customers', createCustomer);

// Add a transaction
router.post('/customers/transaction',  checkThresholds ,addTransaction);



// Get monthly savings
router.get('/customers/:customerId/monthlySavings', getMonthlySavings);

// Get yearly savings
router.get('/customers/:customerId/yearlySavings', getYearlySavings);

// Fetch all customers
router.get('/customers', getAllCustomers);

// Fetch all transactions for a customer
router.get('/customers/:customerId/transactions', getAllTransactions);

// Fetch all savings for a customer
router.get('/customers/:customerId/savings', getAllSavings);

// Fetch all expenditures for a customer
router.get('/customers/:customerId/expenditures', getAllExpenditure);


// setPurchaseLimit
router.put('/customers/:id/purchase-limit', setPurchaseLimit);

//getPurchaseLimit 
router.get('/customers/:id/purchase-limit', getPurchaseLimit);

export default router;
