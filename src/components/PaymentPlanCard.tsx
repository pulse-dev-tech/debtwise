import React from 'react';
import { formatCurrency } from '../utils/calculations';
import { Debt } from '../types';

interface PaymentPlanCardProps {
  debt: Debt;
  index: number;
  monthlyPayment: number;
}

const PaymentPlanCard: React.FC<PaymentPlanCardProps> = ({ debt, index, monthlyPayment }) => {
  const monthsToPayoff = Math.ceil(debt.amount / monthlyPayment);
  const totalInterest = (debt.amount * (debt.interestRate / 100) * (monthsToPayoff / 12));

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">
          {index + 1}. {debt.name}
        </h4>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {debt.interestRate}% APR
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Amount:</span>
          <span className="ml-2 font-medium">
            {formatCurrency(debt.amount, debt.currency)}
          </span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Monthly:</span>
          <span className="ml-2 font-medium">
            {formatCurrency(monthlyPayment, debt.currency)}
          </span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Months to Pay:</span>
          <span className="ml-2 font-medium">{monthsToPayoff}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Total Interest:</span>
          <span className="ml-2 font-medium">
            {formatCurrency(totalInterest, debt.currency)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentPlanCard;