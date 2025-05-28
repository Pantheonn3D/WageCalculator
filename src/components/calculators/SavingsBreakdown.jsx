import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Target, Calendar, Percent, BarChartBig } from 'lucide-react'; // Added Percent, BarChartBig
import { useRegion } from '../../context/RegionContext'; // Assuming this path is correct

const SavingsBreakdown = ({ results, countryCurrency }) => {
  const { formatCurrency: contextFormatCurrency } = useRegion();
  const formatCurrency = contextFormatCurrency;

  if (!results) return null;

  // Defensive access to results properties
  const totalFutureValue = results.summary?.totalFutureValue || 0;
  const totalInterestEarned = results.summary?.totalInterestEarned || 0;
  const inflationAdjustedFutureValue = results.summary?.inflationAdjustedFutureValue || 0;
  const years = results.inputs?.years || 0;
  const initialAmount = results.inputs?.initialAmount || 0;
  const monthlyContribution = results.inputs?.monthlyContribution || 0;
  const totalPrincipalContributions = results.summary?.totalPrincipalContributions || 0;
  const overallGainPercentage = results.summary?.overallGainPercentage;

  const targetAmount = results.goalAnalysis?.targetAmount || 0;
  const isGoalAchieved = results.goalAnalysis?.isGoalAchieved;
  const timeToGoalYears = results.goalAnalysis?.timeToGoalYears;
  const monthlyContributionNeeded = results.goalAnalysis?.monthlyContributionNeeded;

  const annualReturnRate = results.inputs?.annualReturnRate;
  const inflationRate = results.inputs?.inflationRate;
  const compoundingFrequency = results.inputs?.compoundingFrequency;
  
  let compoundingFrequencyLabel = 'Monthly';
  if (compoundingFrequency === 1) compoundingFrequencyLabel = 'Annually';
  else if (compoundingFrequency === 2) compoundingFrequencyLabel = 'Semi-Annually';
  else if (compoundingFrequency === 4) compoundingFrequencyLabel = 'Quarterly';
  else if (compoundingFrequency === 52) compoundingFrequencyLabel = 'Weekly';
  else if (compoundingFrequency === 365) compoundingFrequencyLabel = 'Daily';


  const cardBaseClass = "bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6";
  const summaryCardTextClass = "text-2xl lg:text-3xl font-bold";

  const formatNumber = (num, decimals = 1, suffix = '') => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    return new Intl.NumberFormat(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    }).format(num) + suffix;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0 }}
          className="bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 text-white p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div><p className="text-green-100 text-sm font-medium">Future Value</p>
              <p className={summaryCardTextClass} title={formatCurrency(totalFutureValue, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(totalFutureValue, countryCurrency, { notation: 'compact', maximumSignificantDigits: 4 })}</p>
            </div><TrendingUp className="w-8 h-8 text-green-200 opacity-70" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
          className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 text-white p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div><p className="text-blue-100 text-sm font-medium">Total Interest</p>
              <p className={summaryCardTextClass} title={formatCurrency(totalInterestEarned, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(totalInterestEarned, countryCurrency, { notation: 'compact', maximumSignificantDigits: 4 })}</p>
            </div><DollarSign className="w-8 h-8 text-blue-200 opacity-70" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 text-white p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div><p className="text-purple-100 text-sm font-medium">Real Value (Today's)</p>
              <p className={summaryCardTextClass} title={formatCurrency(inflationAdjustedFutureValue, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(inflationAdjustedFutureValue, countryCurrency, { notation: 'compact', maximumSignificantDigits: 4 })}</p>
            </div><BarChartBig className="w-8 h-8 text-purple-200 opacity-70" /> {/* Changed icon */}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-gradient-to-br from-orange-500 to-orange-700 dark:from-orange-600 dark:to-orange-800 text-white p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div><p className="text-orange-100 text-sm font-medium">Time Period</p>
              <p className={summaryCardTextClass}>{formatNumber(years, years >= 10 ? 0 : 1, ' Years')}</p>
            </div><Calendar className="w-8 h-8 text-orange-200 opacity-70" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className={cardBaseClass}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-neutral-700 pb-2">Savings Journey</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Initial Deposit', value: initialAmount },
              { label: 'Monthly Contribution', value: monthlyContribution },
              { label: 'Total Principal Invested', value: totalPrincipalContributions },
              { label: 'Total Interest Earned', value: totalInterestEarned },
            ].map((item) => (<div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg transition-colors">
              <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              <span className="font-semibold text-gray-900 dark:text-white text-right" title={formatCurrency(item.value, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(item.value, countryCurrency, { smartDecimals: true })}</span>
            </div>))}
            <div className="border-t dark:border-neutral-700 pt-2.5 mt-2.5">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-700/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-600/40 rounded-lg transition-colors">
                <span className="font-semibold">Projected Future Value</span>
                <span className="font-bold text-right" title={formatCurrency(totalFutureValue, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(totalFutureValue, countryCurrency, { smartDecimals: true })}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className={cardBaseClass}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-neutral-700 pb-2">Goal Analysis</h3>
          {targetAmount > 0 ? (<div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Your Savings Goal</span>
              <span className="font-semibold text-gray-900 dark:text-white text-right" title={formatCurrency(targetAmount, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(targetAmount, countryCurrency, { smartDecimals: true })}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                <span className="font-medium text-gray-700 dark:text-gray-300">On Track to Reach Goal?</span>
                <span className={`font-semibold ${isGoalAchieved === null ? 'text-gray-500 dark:text-gray-400' : isGoalAchieved ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {isGoalAchieved === null ? 'Enter goal' : isGoalAchieved ? 'Yes' : 'Adjustment needed'}
                </span>
            </div>
            {timeToGoalYears !== null && timeToGoalYears !== Infinity && timeToGoalYears >=0 && (<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Est. Time to Goal</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatNumber(timeToGoalYears, 1, ' years')}</span>
            </div>)}
            {timeToGoalYears === Infinity && (<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Est. Time to Goal</span>
              <span className="font-semibold text-red-500 dark:text-red-400">Goal not reachable with current plan within reasonable timeframe.</span>
            </div>)}
            {monthlyContributionNeeded !== null && monthlyContributionNeeded > 0 && !isGoalAchieved && (<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Monthly Contribution Needed (for {results.inputs.years} yrs)</span>
              <span className="font-semibold text-gray-900 dark:text-white text-right" title={formatCurrency(monthlyContributionNeeded, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(monthlyContributionNeeded, countryCurrency, { smartDecimals: true })}</span>
            </div>)}
            {monthlyContributionNeeded === 0 && isGoalAchieved && (<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Monthly Contribution Needed</span>
              <span className="font-semibold text-green-500 dark:text-green-400">Goal met by initial amount.</span>
            </div>)}
          </div>) : (<div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-neutral-600" />
            <p className="text-sm">Set a savings goal to see detailed analysis here.</p>
          </div>)}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className={cardBaseClass}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-neutral-700 pb-2">Calculation Assumptions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Annual Return', value: `${formatNumber(annualReturnRate !== undefined ? annualReturnRate * 100 : 0)}%` },
            { label: 'Inflation Rate', value: `${formatNumber(inflationRate !== undefined ? inflationRate * 100 : 0)}%` },
            { label: 'Compounding', value: compoundingFrequencyLabel },
            { label: 'Overall Gain', value: `${formatNumber(overallGainPercentage)}%` },
          ].map(item => (<div key={item.label} className="text-center p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">{item.label}</div>
            <div className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">{item.value}</div>
          </div>))}
        </div>
      </motion.div>
    </div>
  );
};

export default SavingsBreakdown;