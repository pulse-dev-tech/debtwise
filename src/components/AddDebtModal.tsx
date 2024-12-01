import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Debt } from '../types';

interface AddDebtModalProps {
  onClose: () => void;
  onAdd: (debt: Omit<Debt, 'id' | 'createdAt'>) => void;
}

const AddDebtModal: React.FC<AddDebtModalProps> = ({ onClose, onAdd }) => {
  const [newDebt, setNewDebt] = useState<Omit<Debt, 'id' | 'createdAt'>>({
    name: '',
    amount: 0,
    interestRate: 0,
    minimumPayment: 0,
    dueDate: '',
    currency: 'USD',
    category: 'credit-card',
    payments: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newDebt);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative mt-16 mb-16">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-semibold mb-6">Add New Debt</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Debt Name</label>
            <input
              type="text"
              required
              value={newDebt.name}
              onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
              className="input"
              placeholder="e.g., Credit Card, Student Loan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={newDebt.amount}
              onChange={(e) => setNewDebt({ ...newDebt, amount: Number(e.target.value) })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
            <input
              type="number"
              required
              min="0"
              step="0.1"
              value={newDebt.interestRate}
              onChange={(e) => setNewDebt({ ...newDebt, interestRate: Number(e.target.value) })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Minimum Monthly Payment</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={newDebt.minimumPayment}
              onChange={(e) => setNewDebt({ ...newDebt, minimumPayment: Number(e.target.value) })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              required
              value={newDebt.dueDate}
              onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              value={newDebt.currency}
              onChange={(e) => setNewDebt({ ...newDebt, currency: e.target.value })}
              className="input"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={newDebt.category}
              onChange={(e) => setNewDebt({ ...newDebt, category: e.target.value })}
              className="input"
            >
              <option value="credit-card">Credit Card</option>
              <option value="student-loan">Student Loan</option>
              <option value="personal-loan">Personal Loan</option>
              <option value="mortgage">Mortgage</option>
              <option value="car-loan">Car Loan</option>
              <option value="medical">Medical Debt</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary px-6"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary px-6"
            >
              Add Debt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDebtModal;