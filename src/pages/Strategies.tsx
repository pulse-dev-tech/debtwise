import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { storage } from '../utils/storage';
import { Debt } from '../types';
import { formatCurrency } from '../utils/calculations';
import StrategySelector from '../components/StrategySelector';
import StrategyResults from '../components/StrategyResults';

const Strategies: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(500);
  const [selectedStrategy, setSelectedStrategy] = useState<'snowball' | 'avalanche'>('snowball');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const savedDebts = storage.getDebts();
    setDebts(savedDebts);
  }, []);

  const sortedDebts = [...debts].sort((a, b) => {
    if (selectedStrategy === 'snowball') {
      return a.amount - b.amount;
    }
    return b.interestRate - a.interestRate;
  });

  const calculatePayoffTime = (debts: Debt[], monthlyPayment: number): number => {
    let remainingDebts = debts.map(debt => ({ ...debt }));
    let months = 0;
    
    while (remainingDebts.some(debt => debt.amount > 0) && months < 360) {
      let availablePayment = monthlyPayment;
      
      // Pay minimum payments first
      remainingDebts.forEach(debt => {
        const minPayment = Math.min(debt.minimumPayment, debt.amount);
        debt.amount -= minPayment;
        availablePayment -= minPayment;
      });
      
      // Apply remaining payment to target debt
      if (availablePayment > 0) {
        const targetDebt = remainingDebts.find(debt => debt.amount > 0);
        if (targetDebt) {
          targetDebt.amount = Math.max(0, targetDebt.amount - availablePayment);
        }
      }
      
      months++;
    }
    
    return months;
  };

  const calculateTotalInterest = (debts: Debt[], monthlyPayment: number): number => {
    return debts.reduce((sum, debt) => {
      const monthsToPayoff = Math.ceil(debt.amount / monthlyPayment);
      const monthlyInterest = (debt.interestRate / 100) / 12;
      return sum + (debt.amount * monthlyInterest * monthsToPayoff);
    }, 0);
  };

  const totalMonths = calculatePayoffTime(sortedDebts, monthlyPayment);
  const totalInterest = calculateTotalInterest(sortedDebts, monthlyPayment);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Debt Payoff Strategies</h1>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {showHelp && (
        <div className="card bg-blue-50 dark:bg-blue-900/20">
          <h3 className="font-semibold mb-2">Understanding Debt Payoff Strategies</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Debt Snowball Method</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The snowball method focuses on paying off your smallest debts first, regardless of interest rates. 
                This creates psychological wins and motivation as you see debts being fully paid off quickly.
                Best for: Those who are motivated by seeing quick progress.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Debt Avalanche Method</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The avalanche method prioritizes paying off debts with the highest interest rates first. 
                This approach saves you the most money in interest payments over time.
                Best for: Those who want to minimize the total amount paid in interest.
              </p>
            </div>
            <div>
              <h4 className="font-medium">How to Use This Calculator</h4>
              <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Choose your preferred strategy (Snowball or Avalanche)</li>
                <li>Enter your total monthly payment amount</li>
                <li>Review the payment plan and timeline</li>
                <li>Compare strategies to find what works best for you</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      <StrategySelector
        selectedStrategy={selectedStrategy}
        onStrategyChange={setSelectedStrategy}
      />

      {/* Monthly Payment Input */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Monthly Payment</h2>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={monthlyPayment}
            onChange={(e) => setMonthlyPayment(Number(e.target.value))}
            className="input"
            min="0"
            step="100"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            per month
          </span>
        </div>
        {monthlyPayment < debts.reduce((sum, debt) => sum + debt.minimumPayment, 0) && (
          <p className="text-red-600 text-sm mt-2">
            Warning: Monthly payment is less than the sum of minimum payments required
            ({formatCurrency(debts.reduce((sum, debt) => sum + debt.minimumPayment, 0))})
          </p>
        )}
      </div>

      {/* Strategy Results */}
      {debts.length > 0 ? (
        <StrategyResults
          sortedDebts={sortedDebts}
          monthlyPayment={monthlyPayment}
          totalMonths={totalMonths}
          totalInterest={totalInterest}
        />
      ) : (
        <div className="card text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No Debts Added</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Add your debts in the Dashboard to see strategy comparisons
          </p>
        </div>
      )}
    </div>
  );
};

export default Strategies;