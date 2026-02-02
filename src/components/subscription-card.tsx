import React from 'react';
import { Check } from 'lucide-react';

interface SubscriptionCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isActive: boolean;
  onSelect: () => void;
  isMostPopular?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  name,
  price,
  period,
  description,
  features,
  isActive,
  onSelect,
  isMostPopular,
}) => {
  return (
    <div
      className={`relative rounded-lg border transition-all ${
        isMostPopular
          ? 'border-blue-500 shadow-lg shadow-blue-500/20'
          : 'border-slate-700'
      } ${
        isActive
          ? 'bg-slate-700 shadow-lg'
          : 'bg-slate-800 hover:border-slate-600'
      }`}
    >
      {isMostPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>

        <div className="mb-6">
          <span className="text-4xl font-bold text-white">${price}</span>
          <span className="text-gray-400 ml-2">{period}</span>
        </div>

        <button
          onClick={onSelect}
          className={`w-full py-2 rounded-lg font-medium transition-colors mb-6 ${
            isActive
              ? 'bg-blue-600 text-white cursor-default'
              : 'bg-slate-700 text-white hover:bg-slate-600'
          }`}
          disabled={isActive}
        >
          {isActive ? 'Current Plan' : 'Choose Plan'}
        </button>

        <div className="space-y-3">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
              <span className="text-gray-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
