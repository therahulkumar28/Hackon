"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const SavingDetailSchema = new mongoose_1.Schema({
    source: { type: String, required: true },
    amount: { type: Number, required: true }
});
const TransactionSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.default.Types.ObjectId, required: true },
    productName: { type: String, required: true },
    type: { type: String, enum: ['purchase', 'credit'], required: true },
    originalPrice: { type: Number, required: true },
    category: { type: String },
    finalPrice: { type: Number, required: true },
    purchaseSavings: [SavingDetailSchema], // Savings due to discounts on products
    creditSavings: [SavingDetailSchema], // Savings due to credits like credit cards, gift cards, etc.
}, { timestamps: true });
const CustomerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    transactions: [TransactionSchema],
    spendingLimit: { type: Number, required: true },
    thresholdLimit: { type: Number, required: true },
    spendingNotifications: { type: Boolean, default: false },
    monthlySavings: [{
            year: { type: Number, required: true },
            month: { type: Number, required: true },
            discountSavings: { type: Number },
            creditSavings: { type: Number },
            totalSavings: { type: Number, required: true },
            totalExpenditure: { type: Number }
        }],
    yearlySavings: [{
            year: { type: Number, required: true },
            discountSavings: { type: Number },
            creditSavings: { type: Number },
            totalSavings: { type: Number, required: true },
            totalExpenditure: { type: Number }
        }]
}, { timestamps: true });
const Customer = mongoose_1.default.model('Customer', CustomerSchema);
exports.default = Customer;
