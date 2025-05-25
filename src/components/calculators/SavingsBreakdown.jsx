import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Target, Calendar } from 'lucide-react';
import { useRegion } from '../../context/RegionContext';

const SavingsBreakdown = ({ results }) => {
  const { formatCurrency } = useRegion();

  if (!results) return null;

  const formatNumber = (num, decimals = 1) => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    return new Intl.NumberFormat(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Adjusted for 4 cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Future Value</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.summary.totalFutureValue, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.summary.totalFutureValue, undefined, { notation: 'compact', maximumSignificantDigits: 4 })}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200 opacity-80" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Interest</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.summary.totalInterest, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.summary.totalInterest, undefined, { notation: 'compact', maximumSignificantDigits: 4 })}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200 opacity-80" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Real Value (Today's Dollars)</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.summary.realValue, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.summary.realValue, undefined, { notation: 'compact', maximumSignificantDigits: 4 })}
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-200 opacity-80" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Time Period</p>
              <p className="text-2xl lg:text-3xl font-bold">
                {formatNumber(results.breakdown.years, 0)} Years {/* Use 0 decimals for years */}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-orange-200 opacity-80" />
          </div>
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Breakdown List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Journey</h3>
          <div className="space-y-3">
            {[
              { label: 'Initial Amount', value: results.breakdown.initialAmount },
              { label: 'Monthly Contributions', value: results.breakdown.monthlyContribution },
              { label: 'Total Contributions', value: results.summary.totalContributions },
              { label: 'Total Interest Earned', value: results.breakdown.interestEarned },
            ].map((item) => (
              <div 
                key={item.label} 
                className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-900 text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(item.value, undefined, { forceDecimals: 2 })}>
                  {formatCurrency(item.value, undefined, { smartDecimals: true })}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center justify-between p-3.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors">
                <span className="font-semibold">Projected Future Value</span>
                <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(results.summary.totalFutureValue, undefined, { forceDecimals: 2 })}>
                  {formatCurrency(results.summary.totalFutureValue, undefined, { smartDecimals: true })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Goal Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Analysis</h3>
          {results.goal.targetAmount > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-700">Your Savings Goal</span>
                <span className="font-semibold text-gray-900 text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(results.goal.targetAmount, undefined, { forceDecimals: 2 })}>
                  {formatCurrency(results.goal.targetAmount, undefined, { smartDecimals: true })}
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-700">On Track to Reach Goal?</span>
                <span className={`font-semibold ${results.goal.willReachGoal ? 'text-green-600' : 'text-red-600'}`}>
                  {results.goal.willReachGoal ? 'Yes' : 'No, adjustment needed'}
                </span>
              </div>
              {results.goal.timeToGoal !== null && results.goal.timeToGoal > 0 && (
                <div className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="font-medium text-gray-700">Est. Time to Goal</span>
                  <span className="font-semibold text-gray-900">{formatNumber(results.goal.timeToGoal)} years</span>
                </div>
              )}
              {results.goal.monthlyNeededForGoal !== null && results.goal.monthlyNeededForGoal > 0 && (
                <div className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="font-medium text-gray-700">Monthly Contrib. Needed</span>
                  <span className="font-semibold text-gray-900 text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(results.goal.monthlyNeededForGoal, undefined, { forceDecimals: 2 })}>
                    {formatCurrency(results.goal.monthlyNeededForGoal, undefined, { smartDecimals: true })}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">Set a savings goal in the form to see detailed goal analysis here.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Assumptions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Assumptions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4"> {/* Adjusted for responsiveness */}
          {[
            { label: 'Annual Return', value: `${formatNumber(results.assumptions.annualReturn)}%` },
            { label: 'Inflation Rate', value: `${formatNumber(results.assumptions.inflationRate)}%` },
            { 
              label: 'Compounding', 
              value: results.assumptions.compoundingFrequency === 365 ? 'Daily' :
                     results.assumptions.compoundingFrequency === 12 ? 'Monthly' :
                     results.assumptions.compoundingFrequency === 4 ? 'Quarterly' : 'Annually'
            },
            { label: 'Overall Gain %', value: `${formatNumber(results.summary.interestRate)}%` },
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

export default SavingsBreakdown;