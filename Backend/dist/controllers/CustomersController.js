"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpendingByCategory = exports.getPurchaseLimit = exports.setPurchaseLimit = exports.deleteCustomer = exports.updateCustomer = exports.getCustomerById = exports.getAllSavings = exports.getAllTransactions = exports.getAllCustomers = exports.getYearlySavings = exports.getMonthlySavings = exports.getAllExpenditure = exports.addTransaction = exports.createCustomer = void 0;
const customerSchema_1 = __importDefault(require("../models/customerSchema"));
// Create a new customer
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, address, phone, spendingLimit, spendingNotifications, thresholdLimit } = req.body;
        // Check if a customer already exists with the given email or phone number
        const existingCustomer = yield customerSchema_1.default.findOne({
            $or: [{ email: email }, { phone: phone }]
        });
        if (existingCustomer) {
            // If customer already exists, return a 409 Conflict status
            res.status(409).json({ message: 'Customer already exists with the provided email or phone number.' });
            return;
        }
        const newCustomer = new customerSchema_1.default({
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
        yield newCustomer.save();
        res.status(201).json(newCustomer);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating customer', error: error });
    }
});
exports.createCustomer = createCustomer;
// Add a transaction (purchase a product or credit)
const addTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId, type, productId, productName, category, originalPrice, savingsDetails } = req.body;
        const customer = yield customerSchema_1.default.findById(customerId);
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        let transaction;
        if (type === 'purchase') {
            const discountSavings = savingsDetails.filter((saving) => saving.source === 'discount');
            const creditSavings = savingsDetails.filter((saving) => saving.source !== 'discount');
            const totalDiscountSavings = discountSavings.reduce((sum, saving) => sum + saving.amount, 0);
            const totalCreditSavings = creditSavings.reduce((sum, saving) => sum + saving.amount, 0);
            const totalSavings = totalDiscountSavings + totalCreditSavings;
            transaction = {
                productId,
                productName,
                category,
                type,
                originalPrice,
                finalPrice: originalPrice - totalSavings,
                purchaseSavings: discountSavings,
                creditSavings: creditSavings,
            };
        }
        else {
            transaction = {
                productId,
                productName,
                category,
                type,
                originalPrice,
                finalPrice: 0, // Assuming credits don't affect final price
                purchaseSavings: [],
                creditSavings: savingsDetails
            };
        }
        if (transaction) {
            customer.transactions.push(transaction);
            yield customer.save();
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
            const totalSavings = savingsDetails.reduce((sum, saving) => sum + saving.amount, 0);
            const totalExpenditure = transaction.type === 'purchase' ? transaction.finalPrice : 0;
            const totalDiscountSavings = savingsDetails.filter((saving) => saving.source === 'discount').reduce((sum, saving) => sum + saving.amount, 0);
            const totalCreditSavings = savingsDetails.filter((saving) => saving.source !== 'discount').reduce((sum, saving) => sum + saving.amount, 0);
            if (existingMonthlySavings) {
                existingMonthlySavings.totalSavings += totalSavings;
                existingMonthlySavings.discountSavings += totalDiscountSavings;
                existingMonthlySavings.creditSavings += totalCreditSavings;
                existingMonthlySavings.totalExpenditure += totalExpenditure;
            }
            else {
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
            }
            else {
                customer.yearlySavings.push({
                    year,
                    totalSavings,
                    discountSavings: totalDiscountSavings,
                    creditSavings: totalCreditSavings,
                    totalExpenditure: totalExpenditure,
                });
            }
            yield customer.save();
        }
        res.status(200).json(customer);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding transaction', error: error });
    }
});
exports.addTransaction = addTransaction;
const getAllExpenditure = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        const customer = yield customerSchema_1.default.findById(customerId);
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        // Filter transactions to include only 'purchase' type
        const expenditureTransactions = customer.transactions.filter((transaction) => transaction.type === 'purchase');
        // Calculate total expenditure
        const totalExpenditure = expenditureTransactions.reduce((total, transaction) => total + transaction.finalPrice, 0);
        res.status(200).json({ totalExpenditure });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching expenditure', error: error });
    }
});
exports.getAllExpenditure = getAllExpenditure;
// Fetch monthly savings for a customer
const getMonthlySavings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        const customer = yield customerSchema_1.default.findById(customerId);
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        res.status(200).json(customer.monthlySavings);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching monthly savings', error: error });
    }
});
exports.getMonthlySavings = getMonthlySavings;
// Fetch yearly savings for a customer
const getYearlySavings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        const customer = yield customerSchema_1.default.findById(customerId);
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        res.status(200).json(customer.yearlySavings);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching yearly savings', error: error });
    }
});
exports.getYearlySavings = getYearlySavings;
// Fetch all customers
const getAllCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield customerSchema_1.default.find();
        res.status(200).json(customers);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error });
    }
});
exports.getAllCustomers = getAllCustomers;
// get transactions for customers
const getAllTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        const customer = yield customerSchema_1.default.findById(customerId);
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        res.status(200).json(customer.transactions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error: error });
    }
});
exports.getAllTransactions = getAllTransactions;
// Fetch all savings for a customer
const getAllSavings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        const customer = yield customerSchema_1.default.findById(customerId);
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        const savings = {
            purchaseSavings: [], // Initialize as empty array
            creditSavings: [] // Initialize as empty array
        };
        customer.transactions.forEach((transaction) => {
            if (transaction.type === 'purchase') {
                savings.purchaseSavings.push({
                    productName: transaction.productName,
                    savings: transaction.purchaseSavings
                });
            }
            else {
                savings.creditSavings.push({
                    productName: transaction.productName,
                    savings: transaction.creditSavings
                });
            }
        });
        res.status(200).json(savings);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching savings', error: error });
    }
});
exports.getAllSavings = getAllSavings;
// Fetch customer by ID
const getCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        const customer = yield customerSchema_1.default.findById(customerId);
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        res.status(200).json(customer);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching customer', error: error });
    }
});
exports.getCustomerById = getCustomerById;
// Update customer details
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        const { name, email, address, phone, spendingLimit, thresholdLimit } = req.body;
        const customer = yield customerSchema_1.default.findByIdAndUpdate(customerId, { name, email, address, phone, spendingLimit, thresholdLimit }, { new: true });
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        res.status(200).json(customer);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating customer', error: error });
    }
});
exports.updateCustomer = updateCustomer;
// Delete customer
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        const customer = yield customerSchema_1.default.findByIdAndDelete(customerId);
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting customer', error: error });
    }
});
exports.deleteCustomer = deleteCustomer;
//setPurchaseLimit
const setPurchaseLimit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        const { spendingLimit, thresholdLimit, spendingNotifications } = req.body;
        const customer = yield customerSchema_1.default.findById(customerId);
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        customer.spendingLimit = spendingLimit;
        customer.thresholdLimit = thresholdLimit;
        customer.spendingNotifications = spendingNotifications;
        yield customer.save();
        res.status(200).json(customer);
    }
    catch (error) {
        res.status(500).json({ message: 'Error setting purchase limit', error });
    }
});
exports.setPurchaseLimit = setPurchaseLimit;
// getPurchaseLimit
const getPurchaseLimit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        const customer = yield customerSchema_1.default.findById(customerId, 'spendingLimit  thresholdLimit spendingNotifications');
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        res.status(200).json(customer);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching purchase limit', error });
    }
});
exports.getPurchaseLimit = getPurchaseLimit;
const getSpendingByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const customer = yield customerSchema_1.default.findById(id).populate('transactions');
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        const spendingByCategory = customer.transactions.reduce((acc, transaction) => {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching spending by category', error });
    }
});
exports.getSpendingByCategory = getSpendingByCategory;
