import React from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface StrategySelectorProps {
  selectedStrategy: 'snowball' | 'avalanche';
  onStrategyChange: (strategy: 'snowball' | 'avalanche') => void;
}

const StrategySelector: React.FC<StrategySelectorProps> = ({
  selectedStrategy,
  onStrategyChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button
        onClick={() => onStrategyChange('snowball')}
        className={`card flex items-center p-6 transition-all ${
          selectedStrategy === 'snowball' ? 'ring-2 ring-indigo-500' : ''
        }`}
      >
        <ArrowDownCircle className="w-8 h-8 mr-4 text-indigo-600" />
        <div>
          <h3 className="text-lg font-semibold">Debt Snowball</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pay off smallest debts first for quick wins and psychological momentum
          </p>
        </div>
      </button>
      <button
        onClick={() => onStrategyChange('avalanche')}
        className={`card flex items-center p-6 transition-all ${
          selectedStrategy === 'avalanche' ? 'ring-2 ring-indigo-500' : ''
        }`}
      >
        <ArrowUpCircle className="w-8 h-8 mr-4 text-indigo-600" />
        <div>
          <h3 className="text-lg font-semibold">Debt Avalanche</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pay off highest interest debts first to minimize total interest paid
          </p>
        </div>
      </button>
    </div>
  );
};

export default StrategySelector;