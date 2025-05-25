import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { useRegion } from '../../context/RegionContext';

const SalaryBreakdown = ({ results }) => {
  const { formatCurrency } = useRegion();

  if (!results) return null;

  const periods = [
    { label: 'Annual', key: 'annual', icon: Calendar },
    { label: 'Monthly', key: 'monthly', icon: Calendar },
    { label: 'Weekly', key: 'weekly', icon: Calendar },
    { label: 'Daily', key: 'daily', icon: Calendar },
    { label: 'Hourly', key: 'hourly', icon: Calendar },
  ];

  const taxBreakdown = [
    { label: 'Federal Tax', amount: results.taxes.federalTax || 0 },
    { label: 'State/Provincial Tax', amount: results.taxes.stateTax || 0 },
    { label: 'Social Security', amount: results.taxes.socialSecurity || 0 },
    { label: 'Medicare/Health', amount: results.taxes.medicare || 0 },
    { label: 'Other Taxes', amount: results.taxes.other || 0 },
  ].filter((item) => item.amount !== 0); // Filter out zero amounts for cleaner display

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Gross Annual</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.gross.annual, undefined, { forceDecimals: 2 })}>
                {/* Use compact notation for summary, provide full value in title for hover */}
                {formatCurrency(results.gross.annual, undefined, { notation: 'compact', maximumSignificantDigits: 4 })}
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
              <p className="text-blue-100 text-sm font-medium">Net Annual</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.net.annual, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.net.annual, undefined, { notation: 'compact', maximumSignificantDigits: 4 })}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200 opacity-80" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">
                Total Deductions
              </p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.deductions.total, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.deductions.total, undefined, { notation: 'compact', maximumSignificantDigits: 4 })}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-200 opacity-80" />
          </div>
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pay Periods */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="calculator-card" // Assuming this class handles bg, shadow, padding etc.
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pay Period Breakdown
          </h3>
          <div className="space-y-3">
            {periods.map((period) => { // Removed index as key if period.key is unique
              const Icon = period.icon;
              const netValue = results.net[period.key];
              const grossValue = results.gross[period.key];
              return (
                <div
                  key={period.key}
                  className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-700">
                      {period.label}
                    </span>
                  </div>
                  <div className="text-right flex-1 min-w-0 ml-2"> {/* Added flex-1 min-w-0 for responsiveness */}
                    <div className="font-semibold text-gray-900 truncate" title={formatCurrency(netValue, undefined, { forceDecimals: 2 })}>
                      {/* Use smartDecimals for list items */}
                      {formatCurrency(netValue, undefined, { smartDecimals: true })}
                    </div>
                    <div className="text-xs text-gray-500 truncate" title={formatCurrency(grossValue, undefined, { forceDecimals: 2 })}>
                      {formatCurrency(grossValue, undefined, { smartDecimals: true })} gross
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Tax Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tax & Deduction Breakdown
          </h3>
          <div className="space-y-3">
            {taxBreakdown.length > 0 ? taxBreakdown.map((item) => ( // Removed index as key if item.label is unique
              <div
                key={item.label}
                className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-900 text-right min-w-0 ml-2 truncate" title={formatCurrency(item.amount, undefined, { forceDecimals: 2 })}>
                  {formatCurrency(item.amount, undefined, { smartDecimals: true })}
                </span>
              </div>
            )) : (
              <p className="text-sm text-gray-500 p-3.5">No specific tax items to display.</p>
            )}
            {results.deductions.voluntary > 0 && (
              <div className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-700">
                  Additional Deductions
                </span>
                <span className="font-semibold text-gray-900 text-right min-w-0 ml-2 truncate" title={formatCurrency(results.deductions.voluntary, undefined, { forceDecimals: 2 })}>
                  {formatCurrency(results.deductions.voluntary, undefined, { smartDecimals: true })}
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center justify-between p-3.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors">
                <span className="font-semibold">
                  Total Deductions
                </span>
                <span className="font-bold text-right min-w-0 ml-2 truncate" title={formatCurrency(results.deductions.total, undefined, { forceDecimals: 2 })}>
                  {formatCurrency(results.deductions.total, undefined, { smartDecimals: true })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Work Schedule Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Work Schedule Information
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Working Days/Year', value: results.workInfo.workingDays },
            { label: 'Working Hours/Year', value: Math.round(results.workInfo.workingHours) },
            { label: 'Vacation Days', value: results.workInfo.vacationDays },
            { label: 'Public Holidays', value: results.workInfo.publicHolidays },
          ].map(item => (
            <div key={item.label} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {/* Format with commas for readability if numbers are large, but usually these are not currency */}
                {new Intl.NumberFormat().format(item.value)}
              </div>
              <div className="text-sm text-gray-600 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SalaryBreakdown;