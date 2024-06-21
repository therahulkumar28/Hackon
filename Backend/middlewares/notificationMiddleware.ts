import { Request, Response, NextFunction } from 'express';
import Customer from '../models/customerSchema';
import { sendEmail } from '../utils/email';

export const checkThresholds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerId = req.body.customerId || req.params.customerId;
    console.log(customerId)
    const finalPrice = req.body.finalPrice || 0;
    const customer = await Customer.findById(customerId);

    if (customer && customer.thresholdLimit) {
      const currentYear = new Date().getFullYear();
      const yearlyExpenditure = customer.transactions.reduce((sum, transaction) => {
        if (transaction.createdAt && transaction.createdAt instanceof Date && transaction.createdAt.getFullYear() === currentYear) {
          return sum + transaction.finalPrice;
        }
        return sum;
      }, 0);

      console.log(`Yearly Expenditure: ${yearlyExpenditure}`);
      
      if (yearlyExpenditure + finalPrice >= customer.spendingLimit) {
        const recipientEmail = customer.email; // Use customer's email
        const subject = 'Notification: Approaching Purchase Limit';
        const emailContent = `
          Dear ${customer.name},

          We hope this message finds you well. We are reaching out to inform you that your account is approaching its designated purchase limit. Due to recent transactions, we have observed that your purchases are nearing the established threshold. This limit is in place to maintain account security and to prevent unauthorized use. Please review your recent activity and consider adjusting your purchase plans accordingly.

          If you have any questions or concerns regarding your account status or would like to discuss this further, please do not hesitate to contact our customer support team.

          Thank you for your understanding and prompt attention to this matter.

          Best regards,
          Your Company Name
        `;

        await sendEmail(recipientEmail, subject, emailContent);
        console.log(`Email sent to ${customer.name} (${recipientEmail}) successfully.`);
      }
    }
    next();
  } catch (error) {
    console.error('Error in checkThresholds middleware:', error);
    res.status(500).send('Internal Server Error');
  }
};
