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
exports.checkThresholds = void 0;
const customerSchema_1 = __importDefault(require("../models/customerSchema"));
const email_1 = require("../utils/email");
const checkThresholds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.body.customerId || req.params.customerId;
        const finalPrice = req.body.finalPrice || 0;
        const customer = yield customerSchema_1.default.findById(customerId);
        if (customer && customer.thresholdLimit) {
            const currentYear = new Date().getFullYear();
            const yearlyExpenditure = customer.transactions.reduce((sum, transaction) => {
                if (transaction.createdAt && transaction.createdAt instanceof Date && transaction.createdAt.getFullYear() === currentYear) {
                    return sum + transaction.finalPrice;
                }
                return sum;
            }, 0);
            if (yearlyExpenditure + finalPrice >= customer.thresholdLimit) {
                const recipientEmail = 'lokeshjakka03@gmail.com';
                const subject = 'Notification: Approaching Yearly Spending Limit';
                const emailContent = `
          Dear ${customer.name},

          We hope this message finds you well. We are reaching out to inform you that your account is approaching its designated purchase limit. Due to recent transactions, we have observed that your purchases are nearing the established threshold. This limit is in place to maintain account security and to prevent unauthorized use. Please review your recent activity and consider adjusting your purchase plans accordingly.

          If you have any questions or concerns regarding your account status or would like to discuss this further, please do not hesitate to contact our customer support team.

          Thank you for your understanding and prompt attention to this matter.

          Best regards,
          Your Company Name
          HackOn
        `;
                const thresholdEmailOptions = {
                    email: recipientEmail,
                    subject: subject,
                    message: emailContent,
                };
                (0, email_1.sendEmail)(thresholdEmailOptions).then(() => {
                    console.log(`Email sent to ${customer.name} (${recipientEmail}) successfully.`);
                }).catch(error => {
                    console.error('Error sending threshold email:', error);
                });
            }
        }
        next();
    }
    catch (error) {
        console.error('Error in checkThresholds middleware:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.checkThresholds = checkThresholds;
