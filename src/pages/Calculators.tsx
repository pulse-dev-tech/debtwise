import React, { useState } from 'react';
import { Calculator as CalculatorIcon, DollarSign, Clock, TrendingUp, HelpCircle } from 'lucide-react';
import { calculateMonthlyPayment, calculateAmortizationSchedule, calculatePayoffTimeline, formatCurrency } from '../utils/calculations';

const Calculators: React.FC = () => {
  const [calculatorType, setCalculatorType] = useState<'loan' | 'payoff' | 'comparison'>('loan');
  const [showHelp, setShowHelp] = useState(false);
  const [loanDetails, setLoanDetails] = useState({
    amount: 10000,
    interestRate: 5,
    loanTerm: 5,
    currency: 'USD',
    monthlyPayment: 0
  });
  const [schedule, setSchedule] = useState<any[]>([]);

  const handleCalculate = () => {
    const monthlyPayment = calculateMonthlyPayment(
      loanDetails.amount,
      loanDetails.interestRate,
      loanDetails.loanTerm
    );
    setLoanDetails(prev => ({ ...prev, monthlyPayment }));

    const amortization = calculateAmortizationSchedule(
      loanDetails.amount,
      loanDetails.interestRate,
      loanDetails.loanTerm
    );
    setSchedule(amortization);
  };

  const getRecommendations = () => {
    const recommendations = [];
    const { amount, interestRate, monthlyPayment } = loanDetails;
    
    if (interestRate > 10) {
      recommendations.push({
        title: "High Interest Rate Alert",
        description: "Consider refinancing or debt consolidation to get a lower interest rate."
      });
    }

    const payoffTime = calculatePayoffTimeline(amount, interestRate, monthlyPayment);
    if (payoffTime.months > 60) {
      recommendations.push({
        title: "Long Payoff Period",
        description: "Increasing your monthly payment by even a small amount could significantly reduce your payoff time."
      });
    }

    if (monthlyPayment > amount * 0.1) {
      recommendations.push({
        title: "High Monthly Payment",
        description: "Your monthly payment is relatively high. Consider extending the loan term or refinancing for lower payments."
      });
    }

    return recommendations;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Debt Calculators</h1>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {showHelp && (
        <div className="card bg-blue-50 dark:bg-blue-900/20">
          <h3 className="font-semibold mb-2">How to Use the Calculators</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Loan Calculator</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Calculate monthly payments and see a complete amortization schedule. Enter the loan amount, interest rate, and term to see how much you'll pay over time.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Payoff Timeline</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                See how different payment amounts affect your debt payoff timeline. Adjust your monthly payment to find the best strategy for becoming debt-free.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Strategy Comparison</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Compare different debt payoff strategies like avalanche (highest interest first) or snowball (smallest balance first) to find what works best for you.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Calculator Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setCalculatorType('loan')}
          className={`card flex items-center p-4 ${
            calculatorType === 'loan' ? 'ring-2 ring-indigo-500' : ''
          }`}
        >
          <CalculatorIcon className="w-6 h-6 mr-3" />
          <span>Loan Calculator</span>
        </button>
        <button
          onClick={() => setCalculatorType('payoff')}
          className={`card flex items-center p-4 ${
            calculatorType === 'payoff' ? 'ring-2 ring-indigo-500' : ''
          }`}
        >
          <Clock className="w-6 h-6 mr-3" />
          <span>Payoff Timeline</span>
        </button>
        <button
          onClick={() => setCalculatorType('comparison')}
          className={`card flex items-center p-4 ${
            calculatorType === 'comparison' ? 'ring-2 ring-indigo-500' : ''
          }`}
        >
          <TrendingUp className="w-6 h-6 mr-3" />
          <span>Strategy Comparison</span>
        </button>
      </div>

      {/* Calculator Form */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={loanDetails.amount}
                onChange={(e) => setLoanDetails({ ...loanDetails, amount: Number(e.target.value) })}
                className="input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
            <input
              type="number"
              value={loanDetails.interestRate}
              onChange={(e) => setLoanDetails({ ...loanDetails, interestRate: Number(e.target.value) })}
              className="input"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Loan Term (Years)</label>
            <input
              type="number"
              value={loanDetails.loanTerm}
              onChange={(e) => setLoanDetails({ ...loanDetails, loanTerm: Number(e.target.value) })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              value={loanDetails.currency}
              onChange={(e) => setLoanDetails({ ...loanDetails, currency: e.target.value })}
              className="input"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleCalculate}
          className="mt-6 btn btn-primary"
        >
          Calculate
        </button>
      </div>

      {/* Results and Recommendations */}
      {schedule.length > 0 && (
        <>
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Monthly Payment</h2>
            <p className="text-3xl font-bold text-indigo-600">
              {formatCurrency(loanDetails.monthlyPayment, loanDetails.currency)}
            </p>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <div className="space-y-4">
              {getRecommendations().map((rec, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">{rec.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Amortization Schedule</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4">Payment #</th>
                    <th className="text-left py-3 px-4">Payment</th>
                    <th className="text-left py-3 px-4">Principal</th>
                    <th className="text-left py-3 px-4">Interest</th>
                    <th className="text-left py-3 px-4">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((payment, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{formatCurrency(payment.payment, loanDetails.currency)}</td>
                      <td className="py-3 px-4">{formatCurrency(payment.principal, loanDetails.currency)}</td>
                      <td className="py-3 px-4">{formatCurrency(payment.interest, loanDetails.currency)}</td>
                      <td className="py-3 px-4">{formatCurrency(payment.balance, loanDetails.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Calculators;