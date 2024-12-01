import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { storage } from '../utils/storage';
import { Debt } from '../types';
import { formatCurrency } from '../utils/calculations';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Insights: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>([]);

  useEffect(() => {
    const savedDebts = storage.getDebts();
    setDebts(savedDebts);
  }, []);

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalPaid = debts.reduce(
    (sum, debt) => sum + debt.payments.reduce((pSum, payment) => pSum + payment.amount, 0),
    0
  );

  const debtDistribution = debts.map(debt => ({
    name: debt.name,
    value: debt.amount,
    percentage: ((debt.amount / totalDebt) * 100).toFixed(1)
  }));

  const paymentHistory = debts.reduce((history: any[], debt) => {
    debt.payments.forEach(payment => {
      const month = new Date(payment.date).toLocaleString('default', { month: 'short' });
      const existingMonth = history.find(h => h.month === month);
      if (existingMonth) {
        existingMonth.amount += payment.amount;
      } else {
        history.push({ month, amount: payment.amount });
      }
    });
    return history.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Financial Insights</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Debt</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {formatCurrency(totalDebt)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Paid</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(totalPaid)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Progress</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {((totalPaid / (totalDebt + totalPaid)) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Debt Distribution */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Debt Distribution</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={debtDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {debtDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment History */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={paymentHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4F46E5"
                strokeWidth={2}
                name="Payment Amount"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
        <div className="space-y-4">
          {debts.map(debt => {
            const monthlyPayment = debt.minimumPayment;
            const monthsToPayoff = Math.ceil(debt.amount / monthlyPayment);
            const suggestion = monthsToPayoff > 24
              ? 'Consider increasing monthly payments to reduce payoff time'
              : 'Current payment plan is on track';

            return (
              <div key={debt.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">{debt.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Estimated payoff time: {monthsToPayoff} months
                </p>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">
                  {suggestion}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Insights;