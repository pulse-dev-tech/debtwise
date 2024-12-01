import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Debt } from '../types';
import { formatCurrency } from '../utils/calculations';

interface DebtListProps {
  debts: Debt[];
  onDeleteDebt: (id: string) => void;
  onAddPayment: (debtId: string, amount: number) => void;
}

const DebtList: React.FC<DebtListProps> = ({ debts, onDeleteDebt, onAddPayment }) => {
  const [paymentAmounts, setPaymentAmounts] = useState<{ [key: string]: number }>({});

  const handlePaymentSubmit = (debtId: string) => {
    const amount = paymentAmounts[debtId];
    if (amount > 0) {
      onAddPayment(debtId, amount);
      setPaymentAmounts(prev => ({ ...prev, [debtId]: 0 }));
    }
  };

  return (
    <div className="space-y-4">
      {debts.map((debt) => {
        const totalPaid = debt.payments.reduce((sum, payment) => sum + payment.amount, 0);
        const remainingDebt = debt.amount - totalPaid;
        const progress = (totalPaid / debt.amount) * 100;

        return (
          <div key={debt.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{debt.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {debt.category} - Due: {new Date(debt.dueDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => onDeleteDebt(debt.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Original Amount:</span>
                  <span className="ml-2 font-medium">
                    {formatCurrency(debt.amount, debt.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                  <span className="ml-2 font-medium">
                    {formatCurrency(remainingDebt, debt.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Interest Rate:</span>
                  <span className="ml-2 font-medium">{debt.interestRate}%</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Min. Payment:</span>
                  <span className="ml-2 font-medium">
                    {formatCurrency(debt.minimumPayment, debt.currency)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-4">
              <input
                type="number"
                value={paymentAmounts[debt.id] || ''}
                onChange={(e) => setPaymentAmounts(prev => ({
                  ...prev,
                  [debt.id]: Number(e.target.value)
                }))}
                placeholder="Payment amount"
                className="input flex-1"
                min="0"
                step="0.01"
              />
              <button
                onClick={() => handlePaymentSubmit(debt.id)}
                className="btn btn-primary flex items-center"
                disabled={!paymentAmounts[debt.id] || paymentAmounts[debt.id] <= 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Payment
              </button>
            </div>

            {debt.payments.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Payment History</h4>
                <div className="space-y-2">
                  {debt.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="text-sm flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded"
                    >
                      <span>{new Date(payment.date).toLocaleDateString()}</span>
                      <span className="font-medium">
                        {formatCurrency(payment.amount, debt.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DebtList;