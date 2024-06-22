"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CustomersController_1 = require("../controllers/CustomersController");
const notificationMiddleware_1 = require("../middlewares/notificationMiddleware");
const router = (0, express_1.Router)();
// Create a new customer
router.post('/customers', CustomersController_1.createCustomer);
// Add a transaction
router.post('/customers/transaction', notificationMiddleware_1.checkThresholds, CustomersController_1.addTransaction);
// Get CustomerbyId 
router.get('/customers/:customerId', CustomersController_1.getCustomerById);
// Get monthly savings
router.get('/customers/:customerId/monthlySavings', CustomersController_1.getMonthlySavings);
// Get yearly savings
router.get('/customers/:customerId/yearlySavings', CustomersController_1.getYearlySavings);
// Fetch all customers
router.get('/customers', CustomersController_1.getAllCustomers);
// Fetch all transactions for a customer
router.get('/customers/:customerId/transactions', CustomersController_1.getAllTransactions);
// Fetch all savings for a customer
router.get('/customers/:customerId/savings', CustomersController_1.getAllSavings);
// Fetch all expenditures for a customer
router.get('/customers/:customerId/expenditures', CustomersController_1.getAllExpenditure);
// setPurchaseLimit
router.put('/customers/:customerId/purchase-limit', notificationMiddleware_1.checkThresholds, CustomersController_1.setPurchaseLimit);
//getPurchaseLimit 
router.get('/customers/:customerId/purchase-limit', CustomersController_1.getPurchaseLimit);
//getSpendingbyCategory by id 
router.get('/customers/:id/spending-by-category', CustomersController_1.getSpendingByCategory);
exports.default = router;
