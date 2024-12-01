import React from 'react';
import { formatCurrency } from '../utils/calculations';
import { Debt } from '../types';
import PaymentPlanCard from './PaymentPlanCard';

interface StrategyResultsProps {
  sortedDebts: Debt[];
  monthlyPayment: number;
  totalMonths: number;
  totalInterest: number;
}

const StrategyResults: React.FC<StrategyResultsProps> = ({
  sortedDebts,
  monthlyPayment,
  totalMonths,
  totalInterest,
}) => {
  const primaryCurrency = sortedDebts[0]?.currency || 'USD';

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Payoff Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Time to Debt Free</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {totalMonths} months
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              ({Math.floor(totalMonths / 12)} years, {totalMonths % 12} months)
            </span>
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Total Interest Paid</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {formatCurrency(totalInterest, primaryCurrency)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedDebts.map((debt, index) => (
          <PaymentPlanCard
            key={debt.id}
            debt={debt}
            index={index}
            monthlyPayment={monthlyPayment}
          />
        ))}
      </div>
    </div>
  );
};

export default StrategyResults;