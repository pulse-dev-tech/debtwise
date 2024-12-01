import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2 } from 'lucide-react';
import { storage } from '../utils/storage';
import { Goal } from '../types';
import { formatCurrency } from '../utils/calculations';

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: '',
    currency: 'USD'
  });

  useEffect(() => {
    const savedGoals = storage.getGoals();
    setGoals(savedGoals);
  }, []);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const goal: Goal = {
      ...newGoal as Goal,
      id: crypto.randomUUID(),
    };
    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    storage.setGoals(updatedGoals);
    setShowAddForm(false);
    setNewGoal({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      targetDate: '',
      currency: 'USD'
    });
  };

  const handleDeleteGoal = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    storage.setGoals(updatedGoals);
  };

  const handleUpdateProgress = (id: string, amount: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        return { ...goal, currentAmount: amount };
      }
      return goal;
    });
    setGoals(updatedGoals);
    storage.setGoals(updatedGoals);
  };

  // Group goals by currency for summary
  const goalsByCurrency = goals.reduce((acc: { [key: string]: { target: number; current: number } }, goal) => {
    if (!acc[goal.currency]) {
      acc[goal.currency] = { target: 0, current: 0 };
    }
    acc[goal.currency].target += goal.targetAmount;
    acc[goal.currency].current += goal.currentAmount;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Goals</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Goal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(goalsByCurrency).map(([currency, totals]) => (
          <div key={currency} className="card">
            <h3 className="text-lg font-semibold mb-2">{currency} Goals</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Target: {formatCurrency(totals.target, currency)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current: {formatCurrency(totals.current, currency)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${(totals.current / totals.target) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysLeft = Math.ceil(
            (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div key={goal.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{goal.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Past due'}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
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
                <div className="flex justify-between text-sm">
                  <span>{formatCurrency(goal.currentAmount, goal.currency)}</span>
                  <span>{formatCurrency(goal.targetAmount, goal.currency)}</span>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  Update Progress
                </label>
                <input
                  type="number"
                  value={goal.currentAmount}
                  onChange={(e) => handleUpdateProgress(goal.id, Number(e.target.value))}
                  className="input"
                  min="0"
                  max={goal.targetAmount}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Goal</h2>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Amount</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <select
                  value={newGoal.currency}
                  onChange={(e) => setNewGoal({ ...newGoal, currency: e.target.value })}
                  className="input"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;