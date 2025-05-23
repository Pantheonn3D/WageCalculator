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
  ].filter((item) => item.amount > 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Gross Annual</p>
              <p className="text-2xl font-bold">
                {formatCurrency(results.gross.annual)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Net Annual</p>
              <p className="text-2xl font-bold">
                {formatCurrency(results.net.annual)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">
                Total Deductions
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(results.deductions.total)}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-200" />
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
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pay Period Breakdown
          </h3>
          <div className="space-y-3">
            {periods.map((period, index) => {
              const Icon = period.icon;
              return (
                <div
                  key={period.key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">
                      {period.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(results.net[period.key])}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(results.gross[period.key])} gross
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
            {taxBreakdown.map((item, index) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
            {results.deductions.voluntary > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">
                  Additional Deductions
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(results.deductions.voluntary)}
                </span>
              </div>
            )}
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-semibold text-red-900">
                  Total Deductions
                </span>
                <span className="font-bold text-red-900">
                  {formatCurrency(results.deductions.total)}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {results.workInfo.workingDays}
            </div>
            <div className="text-sm text-gray-600">Working Days/Year</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {Math.round(results.workInfo.workingHours)}
            </div>
            <div className="text-sm text-gray-600">Working Hours/Year</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {results.workInfo.vacationDays}
            </div>
            <div className="text-sm text-gray-600">Vacation Days</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {results.workInfo.publicHolidays}
            </div>
            <div className="text-sm text-gray-600">Public Holidays</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SalaryBreakdown;
