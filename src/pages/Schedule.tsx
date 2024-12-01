import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Bell, Check } from 'lucide-react';
import { storage } from '../utils/storage';
import { Debt } from '../types';
import { formatCurrency } from '../utils/calculations';

const Schedule: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    const savedDebts = storage.getDebts();
    setDebts(savedDebts);
  }, []);

  const getMonthlyPayments = () => {
    return debts
      .filter(debt => {
        const dueDate = new Date(debt.dueDate);
        return (
          dueDate.getFullYear() === new Date(selectedMonth).getFullYear() &&
          dueDate.getMonth() === new Date(selectedMonth).getMonth()
        );
      })
      .sort((a, b) => new Date(a.dueDate).getDate() - new Date(b.dueDate).getDate());
  };

  const monthlyPayments = getMonthlyPayments();
  const totalDue = monthlyPayments.reduce((sum, debt) => sum + debt.minimumPayment, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payment Schedule</h1>

      {/* Month Selection */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="w-6 h-6 text-indigo-600" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Due This Month</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {formatCurrency(totalDue)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Number of Payments</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {monthlyPayments.length}
          </p>
        </div>
      </div>

      {/* Payment Schedule */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Payment Schedule</h2>
        {monthlyPayments.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-8">
            No payments scheduled for this month
          </p>
        ) : (
          <div className="space-y-4">
            {monthlyPayments.map((debt) => {
              const dueDate = new Date(debt.dueDate);
              const isPaid = debt.payments.some(
                payment => new Date(payment.date).getMonth() === dueDate.getMonth()
              );

              return (
                <div
                  key={debt.id}
                  className={`p-4 rounded-lg border ${
                    isPaid
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{debt.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Due: {dueDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(debt.minimumPayment)}
                      </p>
                      {isPaid && (
                        <span className="inline-flex items-center text-sm text-green-600 dark:text-green-400">
                          <Check className="w-4 h-4 mr-1" />
                          Paid
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Reminders */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Payment Reminders</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Get notified before your payments are due
        </p>
        <div className="space-y-4">
          {monthlyPayments.map((debt) => (
            <div key={debt.id} className="flex items-center justify-between">
              <span>{debt.name}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;