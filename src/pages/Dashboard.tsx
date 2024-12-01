import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, HelpCircle } from 'lucide-react';
import { storage } from '../utils/storage';
import { Debt } from '../types';
import { formatCurrency, calculateTotalDebt } from '../utils/calculations';
import AddDebtModal from '../components/AddDebtModal';
import DebtList from '../components/DebtList';

const Dashboard: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const savedDebts = storage.getDebts();
    setDebts(savedDebts);
  }, []);

  const handleAddDebt = (newDebt: Omit<Debt, 'id' | 'createdAt'>) => {
    const debt: Debt = {
      ...newDebt,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updatedDebts = [...debts, debt];
    setDebts(updatedDebts);
    storage.setDebts(updatedDebts);
  };

  const handleAddPayment = (debtId: string, amount: number) => {
    const updatedDebts = debts.map(debt => {
      if (debt.id === debtId) {
        return {
          ...debt,
          payments: [
            ...debt.payments,
            {
              id: crypto.randomUUID(),
              amount,
              date: new Date().toISOString(),
            }
          ]
        };
      }
      return debt;
    });
    setDebts(updatedDebts);
    storage.setDebts(updatedDebts);
  };

  const handleDeleteDebt = (id: string) => {
    const updatedDebts = debts.filter(debt => debt.id !== id);
    setDebts(updatedDebts);
    storage.setDebts(updatedDebts);
  };

  const debtTotals = calculateTotalDebt(debts);
  const totalPaidByCurrency = debts.reduce((acc: { [key: string]: number }, debt) => {
    if (!acc[debt.currency]) {
      acc[debt.currency] = 0;
    }
    acc[debt.currency] += debt.payments.reduce((sum, payment) => sum + payment.amount, 0);
    return acc;
  }, {});

  const averageInterest = debts.length
    ? debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Debt Overview</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary flex items-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Debt
          </button>
        </div>
      </div>

      {showHelp && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-blue-50 dark:bg-blue-900/20"
        >
          <h3 className="font-semibold mb-2">How to use the Dashboard</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Add your debts using the "Add Debt" button</li>
            <li>Track payments and progress for each debt</li>
            <li>View total debt and average interest rate</li>
            <li>Record payments made using the "Add Payment" button</li>
            <li>Delete debts that have been fully paid off</li>
          </ul>
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {debtTotals.map(({ currency, amount }) => (
          <motion.div
            key={currency}
            whileHover={{ scale: 1.02 }}
            className="card"
          >
            <h3 className="text-lg font-semibold mb-2">Total Debt ({currency})</h3>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(amount, currency)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Paid: {formatCurrency(totalPaidByCurrency[currency] || 0, currency)}
            </p>
          </motion.div>
        ))}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-2">Average Interest</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {averageInterest.toFixed(2)}%
          </p>
        </motion.div>
      </div>

      {/* Debt List */}
      <DebtList
        debts={debts}
        onDeleteDebt={handleDeleteDebt}
        onAddPayment={handleAddPayment}
      />

      {/* Add Debt Modal */}
      {showAddForm && (
        <AddDebtModal
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddDebt}
        />
      )}
    </div>
  );
};

export default Dashboard;