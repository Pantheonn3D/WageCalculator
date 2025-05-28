import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingDown, Percent, Receipt } from 'lucide-react';
import { useRegion } from '../../context/RegionContext'; // Assuming this path is correct

const TaxBreakdown = ({ results, countryCurrency }) => { // Added countryCurrency prop
  const { formatCurrency: contextFormatCurrency } = useRegion();

  // Use passed-in formatCurrency if available (from calculator), else from context
  const formatCurrency = contextFormatCurrency;

  if (!results) return null;

  // Defensive access to results properties
  const grossIncome = results.income?.gross || 0;
  const totalTaxVal = results.taxes?.totalTax || 0;
  const netIncomeVal = results.income?.net || 0;
  const effectiveRateVal = results.taxes?.effectiveRate; // Already a decimal from taxCalculations.js
  const marginalRateVal = results.taxes?.marginalRate; // Already a decimal

  const preTaxDeductionsRetirement = results.deductions?.preTaxRetirement || 0;
  const preTaxDeductionsHealth = results.deductions?.preTaxHealth || 0;
  const itemizedOrPostTaxDeductions = results.deductions?.itemizedOrPostTax || 0;
  const taxableIncomeVal = results.income?.taxable || 0;
  
  const totalPreTaxDeductions = preTaxDeductionsRetirement + preTaxDeductionsHealth;

  const taxItems = [
    { label: 'Federal Tax', amount: results.taxes?.federalTax || 0 },
    { label: 'State/Provincial Tax', amount: results.taxes?.stateTax || 0 },
    { label: 'Social Security', amount: results.taxes?.socialSecurity || 0 },
    { label: 'Medicare/Health', amount: results.taxes?.medicare || 0 },
    { label: 'Other Taxes', amount: results.taxes?.other || 0 }
  ].filter(item => typeof item.amount === 'number' && item.amount !== 0); // Ensure amount is number and non-zero

  const cardBaseClass = "bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6";
  const summaryCardTextClass = "text-2xl lg:text-3xl font-bold";

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0 }}
          className="bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 text-white p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div><p className="text-green-100 text-sm font-medium">Gross Income</p>
              <p className={summaryCardTextClass} title={formatCurrency(grossIncome, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(grossIncome, countryCurrency, { notation: 'compact', maximumSignificantDigits: 4 })}</p>
            </div><DollarSign className="w-8 h-8 text-green-200 opacity-70" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
          className="bg-gradient-to-br from-red-500 to-red-700 dark:from-red-600 dark:to-red-800 text-white p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div><p className="text-red-100 text-sm font-medium">Total Taxes</p>
              <p className={summaryCardTextClass} title={formatCurrency(totalTaxVal, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(totalTaxVal, countryCurrency, { notation: 'compact', maximumSignificantDigits: 4 })}</p>
            </div><Receipt className="w-8 h-8 text-red-200 opacity-70" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 text-white p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div><p className="text-blue-100 text-sm font-medium">Net Income</p>
              <p className={summaryCardTextClass} title={formatCurrency(netIncomeVal, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(netIncomeVal, countryCurrency, { notation: 'compact', maximumSignificantDigits: 4 })}</p>
            </div><DollarSign className="w-8 h-8 text-blue-200 opacity-70" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 text-white p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div><p className="text-purple-100 text-sm font-medium">Effective Rate</p>
              <p className={summaryCardTextClass}>
                {effectiveRateVal !== undefined ? `${(effectiveRateVal * 100).toFixed(1)}%` : 'N/A'}
              </p>
            </div><Percent className="w-8 h-8 text-purple-200 opacity-70" />
          </div>
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className={cardBaseClass}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-neutral-700 pb-2">Tax Breakdown</h3>
          <div className="space-y-2.5">
            {taxItems.length > 0 ? taxItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg transition-colors">
                <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                <span className="font-semibold text-gray-900 dark:text-white text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(item.amount, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(item.amount, countryCurrency, { smartDecimals: true })}</span>
              </div>)) : (<p className="text-sm text-gray-500 dark:text-gray-400 p-3">No specific tax items to display based on input.</p>)
            }
            <div className="border-t dark:border-neutral-700 pt-2.5 mt-2.5">
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-700/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-600/40 rounded-lg transition-colors">
                <span className="font-semibold">Total Taxes</span>
                <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(totalTaxVal, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(totalTaxVal, countryCurrency, { smartDecimals: true })}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className={cardBaseClass}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-neutral-700 pb-2">Income & Deductions Summary</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Gross Income', value: grossIncome, sign: '' },
              { label: 'Pre-Tax: Retirement', value: preTaxDeductionsRetirement, sign: '-', condition: preTaxDeductionsRetirement > 0 },
              { label: 'Pre-Tax: Health', value: preTaxDeductionsHealth, sign: '-', condition: preTaxDeductionsHealth > 0 },
              { label: 'Taxable Income', value: taxableIncomeVal, sign: '' },
              { label: 'Total Taxes', value: totalTaxVal, sign: '-' },
              { label: 'Other Deductions (Itemized/Post-Tax)', value: itemizedOrPostTaxDeductions, sign: '-', condition: itemizedOrPostTaxDeductions > 0 },
            ].map((item) => (item.condition === undefined || item.condition) && (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg transition-colors">
                <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                <span className="font-semibold text-gray-900 dark:text-white text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(item.value, countryCurrency, { forceDecimals: 2 })}>{item.sign}{formatCurrency(item.value, countryCurrency, { smartDecimals: true })}</span>
              </div>))}
            <div className="border-t dark:border-neutral-700 pt-2.5 mt-2.5">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-700/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-600/40 rounded-lg transition-colors">
                <span className="font-semibold">Net Income</span>
                <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(netIncomeVal, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(netIncomeVal, countryCurrency, { smartDecimals: true })}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className={cardBaseClass}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-neutral-700 pb-2">Tax Rates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="text-center p-4 bg-gray-100 dark:bg-neutral-700 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Effective Tax Rate</div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {effectiveRateVal !== undefined ? `${(effectiveRateVal * 100).toFixed(1)}%` : 'N/A'}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-100 dark:bg-neutral-700 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Marginal Tax Rate</div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {marginalRateVal !== undefined ? `${(marginalRateVal * 100).toFixed(1)}%` : 'N/A'}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className={cardBaseClass}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-neutral-700 pb-2">Monthly Estimates</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Gross Monthly Income', value: results.monthly?.grossIncome || 0 },
              { label: 'Monthly Taxes (Avg)', value: results.monthly?.taxes || 0 },
            ].map((item) => (<div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg transition-colors">
              <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              <span className="font-semibold text-gray-900 dark:text-white text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(item.value, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(item.value, countryCurrency, { smartDecimals: true })}</span>
            </div>))}
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-700/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-600/40 rounded-lg transition-colors">
              <span className="font-semibold">Net Monthly Income (Avg)</span>
              <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(results.monthly?.netIncome || 0, countryCurrency, { forceDecimals: 2 })}>{formatCurrency(results.monthly?.netIncome || 0, countryCurrency, { smartDecimals: true })}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TaxBreakdown;