import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { storage } from '../utils/storage';
import { Debt } from '../types';
import { formatCurrency } from '../utils/calculations';

const Progress: React.FC = () => {
  const [debts] = React.useState<Debt[]>(storage.getDebts());

  const generatePaymentData = () => {
    const monthlyData = [];
    let currentTotal = debts.reduce((sum, debt) => sum + debt.amount, 0);
    
    for (let i = 0; i < 12; i++) {
      const monthlyPayments = debts.reduce((sum, debt) => sum + (debt.minimumPayment || 0), 0);
      currentTotal = Math.max(0, currentTotal - monthlyPayments);
      
      monthlyData.push({
        month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' }),
        amount: currentTotal,
      });
    }
    
    return monthlyData;
  };

  const paymentData = generatePaymentData();
  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalPaid = debts.reduce((sum, debt) => 
    sum + debt.payments.reduce((pSum, payment) => pSum + payment.amount, 0), 0);
  const progressPercentage = totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Debt Progress</h1>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Debt</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(totalDebt)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Paid</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalPaid)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Progress</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {progressPercentage.toFixed(1)}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Debt Projection Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Debt Projection</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={paymentData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#4F46E5"
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Debt Progress */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Individual Debt Progress</h2>
        <div className="space-y-4">
          {debts.map((debt) => {
            const paid = debt.payments.reduce((sum, payment) => sum + payment.amount, 0);
            const progress = (paid / debt.amount) * 100;
            
            return (
              <div key={debt.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{debt.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(paid)} / {formatCurrency(debt.amount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Progress;