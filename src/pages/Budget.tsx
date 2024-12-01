import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, DollarSign } from 'lucide-react';
import { storage } from '../utils/storage';
import { Budget as BudgetType, Expense } from '../types';
import { formatCurrency } from '../utils/calculations';

const Budget: React.FC = () => {
  const [budget, setBudget] = useState<BudgetType>({
    id: crypto.randomUUID(),
    income: 0,
    expenses: [],
    savings: 0,
    currency: 'USD'
  });
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: '',
    amount: 0,
    isRecurring: false
  });

  useEffect(() => {
    const savedBudget = storage.getBudget();
    if (savedBudget) {
      setBudget(savedBudget);
    }
  }, []);

  const handleSaveBudget = () => {
    storage.setBudget(budget);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Expense = {
      ...newExpense as Expense,
      id: crypto.randomUUID(),
    };
    const updatedBudget = {
      ...budget,
      expenses: [...budget.expenses, expense]
    };
    setBudget(updatedBudget);
    storage.setBudget(updatedBudget);
    setShowAddExpense(false);
    setNewExpense({
      category: '',
      amount: 0,
      isRecurring: false
    });
  };

  const handleDeleteExpense = (id: string) => {
    const updatedBudget = {
      ...budget,
      expenses: budget.expenses.filter(expense => expense.id !== id)
    };
    setBudget(updatedBudget);
    storage.setBudget(updatedBudget);
  };

  const totalExpenses = budget.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = budget.income - totalExpenses;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Budget Planning</h1>

      {/* Income Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Monthly Income</h2>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <select
              value={budget.currency}
              onChange={(e) => setBudget({ ...budget, currency: e.target.value })}
              className="input w-32 mr-4"
            >
              <option value="USD">USD</option>
              <option value="KES">KES</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={budget.income}
                onChange={(e) => setBudget({ ...budget, income: Number(e.target.value) })}
                className="input pl-10"
                placeholder="Enter your monthly income"
              />
            </div>
          </div>
          <button onClick={handleSaveBudget} className="btn btn-primary">
            Save
          </button>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(budget.income, budget.currency)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">
            {formatCurrency(totalExpenses, budget.currency)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Remaining</h3>
          <p className={`text-3xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(remainingBudget, budget.currency)}
          </p>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Expenses</h2>
          <button
            onClick={() => setShowAddExpense(true)}
            className="btn btn-primary flex items-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Expense
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Recurring</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {budget.expenses.map((expense) => (
                <tr key={expense.id} className="border-b dark:border-gray-700">
                  <td className="py-3 px-4">{expense.category}</td>
                  <td className="py-3 px-4">{formatCurrency(expense.amount, budget.currency)}</td>
                  <td className="py-3 px-4">
                    {expense.isRecurring ? 'Yes' : 'No'}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount ({budget.currency})</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                  className="input"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={newExpense.isRecurring}
                  onChange={(e) => setNewExpense({ ...newExpense, isRecurring: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isRecurring" className="text-sm font-medium">
                  Recurring Expense
                </label>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;