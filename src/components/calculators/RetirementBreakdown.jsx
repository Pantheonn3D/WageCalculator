import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, DollarSign, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useRegion } from '../../context/RegionContext';

const RetirementBreakdown = ({ results }) => {
  const { formatCurrency } = useRegion();

  if (!results) return null;

  const formatNumber = (num, decimals = 1) => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    // Handle Infinity explicitly
    if (!isFinite(num)) return 'Very Large'; // Or 'N/A', or some indicator
    return new Intl.NumberFormat(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    }).format(num);
  };

  // Helper to format currency, handling potential Infinity
  const safeFormatCurrency = (amount, options) => {
    if (typeof amount !== 'number' || !isFinite(amount)) {
      return 'Very Large'; // Or a more specific error/placeholder
    }
    return formatCurrency(amount, undefined, options);
  };


  return (
    <div className="space-y-6">
      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`p-6 rounded-xl text-white shadow-lg ${
          results.savings.onTrack 
            ? 'bg-gradient-to-r from-green-500 to-green-600' 
            : 'bg-gradient-to-r from-red-500 to-red-600'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Retirement Status</p>
            <p className="text-2xl lg:text-3xl font-bold">
              {results.savings.onTrack ? 'On Track!' : 'Adjustment Needed'}
            </p>
            <p className="text-sm opacity-75 mt-1" title={results.savings.onTrack ? safeFormatCurrency(results.savings.surplus, {forceDecimals: 2}) : safeFormatCurrency(results.savings.shortfall, {forceDecimals: 2})}>
              {results.savings.onTrack 
                ? `Est. Surplus: ${safeFormatCurrency(results.savings.surplus, {notation: 'compact', maximumSignificantDigits: 3})}`
                : `Est. Shortfall: ${safeFormatCurrency(results.savings.shortfall, {notation: 'compact', maximumSignificantDigits: 3})}`
              }
            </p>
          </div>
          {results.savings.onTrack ? (
            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 opacity-80" />
          ) : (
            <XCircle className="w-10 h-10 md:w-12 md:h-12 opacity-80" />
          )}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Projected Savings', value: results.savings.projected, icon: TrendingUp, colorClasses: 'from-blue-500 to-blue-600 text-blue-100 text-blue-200' },
          { label: 'Required Savings', value: results.savings.required, icon: Target, colorClasses: 'from-purple-500 to-purple-600 text-purple-100 text-purple-200' },
          { label: 'Est. Monthly Income', value: results.income.projectedIncome / 12, icon: DollarSign, colorClasses: 'from-green-500 to-green-600 text-green-100 text-green-200' },
          { label: 'Years to Retirement', value: results.timeline.yearsToRetirement, icon: Calendar, isNumeric: true, colorClasses: 'from-orange-500 to-orange-600 text-orange-100 text-orange-200' }
        ].map((card, index) => {
          const Icon = card.icon;
          const [bgColorFrom, bgColorTo, labelColor, iconColor] = card.colorClasses.split(' ');
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className={`bg-gradient-to-r ${bgColorFrom} ${bgColorTo} text-white p-6 rounded-xl shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${labelColor} text-sm font-medium`}>{card.label}</p>
                  <p className="text-2xl lg:text-3xl font-bold" title={card.isNumeric ? formatNumber(card.value,0) : safeFormatCurrency(card.value, {forceDecimals: 2})}>
                    {card.isNumeric 
                      ? `${formatNumber(card.value, 0)}` 
                      : safeFormatCurrency(card.value, {notation: 'compact', maximumSignificantDigits: 4})}
                    {card.label === 'Years to Retirement' && card.value !== 1 ? ' Years' : card.label === 'Years to Retirement' ? ' Year' : ''}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${iconColor} opacity-80`} />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Analysis</h3>
          <div className="space-y-3">
            {[
              { label: 'Current Savings', value: results.savings.current },
              { label: 'Your Monthly Contribution', value: results.contributions.monthly },
              { label: 'Employer Match (Monthly)', value: results.contributions.employerMatch },
              { label: 'Total Monthly Savings', value: results.contributions.total },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-900 text-right flex-1 min-w-0 ml-2 truncate" title={safeFormatCurrency(item.value, { forceDecimals: 2 })}>
                  {safeFormatCurrency(item.value, { smartDecimals: true })}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center justify-between p-3.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors">
                <span className="font-semibold">Projected at Retirement</span>
                <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate" title={safeFormatCurrency(results.savings.projected, { forceDecimals: 2 })}>
                  {safeFormatCurrency(results.savings.projected, { smartDecimals: true })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Retirement Income */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated Retirement Income (Annual)</h3>
          <div className="space-y-3">
            {[
              { label: 'Required Income (Today\'s Dollars)', value: results.income.currentSalary * results.assumptions.expenseRatio / 100 },
              { label: 'Required Income (at Retirement)', value: results.income.requiredIncome },
              { label: 'Income from Savings (4% Rule)', value: results.income.projectedIncome },
              { label: 'Social Security (Annual)', value: results.income.socialSecurity, condition: results.income.socialSecurity > 0 },
            ].map(item => (item.condition === undefined || item.condition) && (
              <div key={item.label} className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-900 text-right flex-1 min-w-0 ml-2 truncate" title={safeFormatCurrency(item.value, { forceDecimals: 2 })}>
                  {safeFormatCurrency(item.value, { smartDecimals: true })}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center justify-between p-3.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors">
                <span className="font-semibold">Total Est. Retirement Income</span>
                <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate" title={safeFormatCurrency(results.income.projectedIncome + results.income.socialSecurity, { forceDecimals: 2 })}>
                  {safeFormatCurrency(results.income.projectedIncome + results.income.socialSecurity, { smartDecimals: true })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Items */}
      {!results.savings.onTrack && results.contributions.monthlyNeeded > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="calculator-card border-l-4 border-red-500 bg-red-50"
        >
          <h3 className="text-lg font-semibold text-red-700 mb-4">Action Items to Get On Track</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-red-100 rounded-lg">
              <span className="font-medium text-red-800">Increase Total Monthly Savings To:</span>
              <span className="font-bold text-red-800 text-right flex-1 min-w-0 ml-2 truncate" title={safeFormatCurrency(results.contributions.monthlyNeeded, {forceDecimals: 2})}>
                {safeFormatCurrency(results.contributions.monthlyNeeded, {smartDecimals: true})}
              </span>
            </div>
            <div className="text-sm text-gray-700 mt-2 px-1">
              <p>To reach your retirement goal, consider these options:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Increase your monthly contribution.</li>
                <li>Ensure you're maximizing any employer match available.</li>
                <li>Review and potentially reduce current expenses.</li>
                <li>Consider working a few additional years for more growth.</li>
                <li>Explore options to increase your investment returns (consult a financial advisor).</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Assumptions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Assumptions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Expected Return', value: `${formatNumber(results.assumptions.expectedReturn)}%`},
            { label: 'Inflation Rate', value: `${formatNumber(results.assumptions.inflationRate)}%`},
            { label: 'Withdrawal Rate', value: `${formatNumber(results.assumptions.withdrawalRate)}%`},
            { label: 'Expense Ratio', value: `${formatNumber(results.assumptions.expenseRatio)}%`},
          ].map(item => (
             <div key={item.label} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">{item.label}</div>
              <div className="text-2xl font-bold text-primary-600">{item.value}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RetirementBreakdown;