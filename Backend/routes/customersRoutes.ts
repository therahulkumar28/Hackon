import { Router } from 'express';
import {
  createCustomer,
  addTransaction,
  addSavingsGoal,
  getMonthlySavings,
  getYearlySavings,
  getAllCustomers,
  getAllTransactions,
  getAllSavings,
  getAllExpenditures
} from '../controllers/CustomersController';

const router = Router();

// Create a new customer
router.post('/customers', createCustomer);

// Add a transaction
router.post('/customers/transaction', addTransaction);

// Add a savings goal
router.post('/customers/savingsGoal', addSavingsGoal);

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
router.get('/customers/:customerId/expenditures', getAllExpenditures);

export default router;
