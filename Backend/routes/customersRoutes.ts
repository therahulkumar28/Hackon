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
  getPurchaseLimit, 
  getSpendingByCategory,
  getCustomerById,
} from '../controllers/CustomersController';
import { checkThresholds } from '../middlewares/notificationMiddleware';

const router = Router();

// Create a new customer
router.post('/customers', createCustomer);

// Add a transaction
router.post('/customers/transaction',  checkThresholds ,addTransaction);

// Get CustomerbyId 
router.get('/customers/:customerId',getCustomerById)

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
router.put('/customers/:customerId/purchase-limit', setPurchaseLimit);

//getPurchaseLimit 
router.get('/customers/:customerId/purchase-limit', checkThresholds ,getPurchaseLimit);

//getSpendingbyCategory by id 
router.get('/customers/:id/spending-by-category', getSpendingByCategory);

export default router;
