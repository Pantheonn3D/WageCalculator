import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingDown, Percent, Receipt } from 'lucide-react'; // TrendingDown might be better as DollarSign or Check for Net Income
import { useRegion } from '../../context/RegionContext';

const TaxBreakdown = ({ results }) => {
  const { formatCurrency } = useRegion();

  if (!results) return null;

  const taxItems = [
    { label: 'Federal Tax', amount: results.breakdown.federalTax },
    { label: 'State/Provincial Tax', amount: results.breakdown.stateTax },
    { label: 'Social Security', amount: results.breakdown.socialSecurity },
    { label: 'Medicare/Health', amount: results.breakdown.medicare },
    { label: 'Other Taxes', amount: results.breakdown.otherTaxes }
  ].filter(item => item.amount !== 0); // Filter out zero amounts for cleaner display

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
              <p className="text-green-100 text-sm font-medium">Gross Income</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.income.gross, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.income.gross, undefined, { notation: 'compact', maximumSignificantDigits: 4 })}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200 opacity-80" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Taxes</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.taxes.totalTax, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.taxes.totalTax, undefined, { notation: 'compact', maximumSignificantDigits: 4 })}
              </p>
            </div>
            <Receipt className="w-8 h-8 text-red-200 opacity-80" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Net Income</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.income.net, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.income.net, undefined, { notation: 'compact', maximumSignificantDigits: 4 })}
              </p>
            </div>
            {/* Using DollarSign or Check might be more positive for Net Income */}
            <DollarSign className="w-8 h-8 text-blue-200 opacity-80" /> 
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Effective Rate</p>
              <p className="text-2xl lg:text-3xl font-bold">
                {/* Format percentage with 1 decimal place */}
                {new Intl.NumberFormat(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(results.taxes.effectiveRate)}%
              </p>
            </div>
            <Percent className="w-8 h-8 text-purple-200 opacity-80" />
          </div>
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Breakdown List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Breakdown</h3>
          <div className="space-y-3">
            {taxItems.length > 0 ? taxItems.map((item) => (
              <div 
                key={item.label} 
                className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-900 text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(item.amount, undefined, { forceDecimals: 2 })}>
                  {formatCurrency(item.amount, undefined, { smartDecimals: true })}
                </span>
              </div>
            )) : (
              <p className="text-sm text-gray-500 p-3.5">No specific tax items to display.</p>
            )}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center justify-between p-3.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors">
                <span className="font-semibold">Total Taxes</span>
                <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(results.taxes.totalTax, undefined, { forceDecimals: 2 })}>
                  {formatCurrency(results.taxes.totalTax, undefined, { smartDecimals: true })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Income & Deductions List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income & Deductions</h3>
          <div className="space-y-3">
            {[
              { label: 'Gross Income', value: results.income.gross, sign: '' },
              { label: 'Pre-tax Deductions', value: results.deductions.preTax, sign: '-', condition: results.deductions.preTax > 0 },
              { label: 'Taxable Income', value: results.income.taxable, sign: '' },
              { label: 'Taxes', value: results.taxes.totalTax, sign: '-' },
              { label: 'Post-tax Deductions', value: results.deductions.postTax, sign: '-', condition: results.deductions.postTax > 0 },
            ].map((item) => (item.condition === undefined || item.condition) && (
              <div 
                key={item.label} 
                className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-900 text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(item.value, undefined, { forceDecimals: 2 })}>
                  {item.sign}{formatCurrency(item.value, undefined, { smartDecimals: true })}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center justify-between p-3.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors">
                <span className="font-semibold">Net Income</span>
                <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(results.income.net, undefined, { forceDecimals: 2 })}>
                  {formatCurrency(results.income.net, undefined, { smartDecimals: true })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tax Rates & Monthly Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Rates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Adjusted to 1 col on small screens */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Effective Rate</div>
              <div className="text-2xl font-bold text-primary-600">
                {new Intl.NumberFormat(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(results.taxes.effectiveRate)}%
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Marginal Rate</div>
              <div className="text-2xl font-bold text-primary-600">
                {new Intl.NumberFormat(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(results.taxes.marginalRate)}%
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Gross Monthly', value: results.monthly.grossIncome },
              { label: 'Monthly Taxes', value: results.monthly.taxes },
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
            <div className="flex items-center justify-between p-3.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors">
              <span className="font-semibold">Net Monthly</span>
              <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(results.monthly.netIncome, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.monthly.netIncome, undefined, { smartDecimals: true })}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TaxBreakdown;