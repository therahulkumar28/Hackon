// notificationMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import Customer from '../models/customerSchema';

export const checkThresholds = async (req: Request, res: Response, next: NextFunction) => {
  const { customerId, finalPrice } = req.body;
  const customer = await Customer.findById(customerId);

  if (customer && customer.thresholdLimit) {
    const currentYear = new Date().getFullYear();

    const yearlyExpenditure = customer.transactions.reduce((sum, transaction) => {
        if (transaction.createdAt && transaction.createdAt instanceof Date && transaction.createdAt.getFullYear() === currentYear) {
          return sum + transaction.finalPrice;
        }
        return sum;
      }, 0);

    if (yearlyExpenditure + finalPrice >= customer.spendingLimit) {
      // Send notification (e.g., email, SMS, etc.)
      console.log(`Customer ${customer.name} has reached the yearly purchase limit.`);
    }
  }

  next();
};
