import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { useRegion } from '../../context/RegionContext';

const HourlyBreakdown = ({ results }) => {
  const { formatCurrency } = useRegion();

  if (!results) return null;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Adjusted for 4 cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Hourly Rate</p>
              {/* Hourly rate usually needs full precision */}
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.hourly.regular, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.hourly.regular, undefined, { forceDecimals: 2 })}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-200 opacity-80" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Annual Gross</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.gross.annual, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.gross.annual, undefined, { notation: 'compact', maximumSignificantDigits: 4 })}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200 opacity-80" />
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
              <p className="text-purple-100 text-sm font-medium">Annual Net</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.net.annual, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.net.annual, undefined, { notation: 'compact', maximumSignificantDigits: 4 })}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200 opacity-80" />
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
              <p className="text-orange-100 text-sm font-medium">Total Hours</p>
              <p className="text-2xl lg:text-3xl font-bold">
                {/* Standard number formatting for hours */}
                {new Intl.NumberFormat().format(results.hours.total)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-orange-200 opacity-80" />
          </div>
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pay Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="calculator-card" // Assuming this handles bg, shadow, padding etc.
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pay Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Regular Pay', value: results.gross.regular, condition: true },
              { label: 'Overtime Pay', value: results.gross.overtime, condition: results.gross.overtime > 0 },
              { label: 'Monthly Gross', value: results.gross.monthly, condition: true },
              { label: 'Weekly Gross', value: results.gross.weekly, condition: true },
            ].map((item) => item.condition && (
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
                <span className="font-semibold">Total Annual Gross</span>
                <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(results.gross.annual, undefined, { forceDecimals: 2 })}>
                  {formatCurrency(results.gross.annual, undefined, { smartDecimals: true })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hours Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hours Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Regular Hours (Annual)', value: results.hours.regular, condition: true },
              { label: 'Overtime Hours (Annual)', value: results.hours.overtime, condition: results.hours.overtime > 0 },
              { label: 'Hours per Week (Avg)', value: results.hours.perWeek, condition: true },
              { label: 'Working Weeks', value: results.schedule.workingWeeks, condition: true },
            ].map((item) => item.condition && (
              <div
                key={item.label}
                className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-900 text-right flex-1 min-w-0 ml-2 truncate">
                  {/* Use standard number formatting for hours */}
                  {new Intl.NumberFormat().format(item.value)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center justify-between p-3.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors">
                <span className="font-semibold">Total Annual Hours</span>
                <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate">
                  {new Intl.NumberFormat().format(results.hours.total)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hourly Rates Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Rate Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Regular Rate</div>
            <div className="text-2xl font-bold text-primary-600" title={formatCurrency(results.hourly.regular, undefined, { forceDecimals: 2 })}>
              {formatCurrency(results.hourly.regular, undefined, { forceDecimals: 2 })} {/* Always show 2 decimals for rates */}
            </div>
          </div>
          {/* Conditionally render Overtime Rate if it's different or overtime is worked */}
          {(results.hourly.overtime !== results.hourly.regular || results.hours.overtime > 0) && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Overtime Rate</div>
              <div className="text-2xl font-bold text-primary-600" title={formatCurrency(results.hourly.overtime, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.hourly.overtime, undefined, { forceDecimals: 2 })}
              </div>
            </div>
          )}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Effective Rate</div>
            <div className="text-2xl font-bold text-primary-600" title={formatCurrency(results.hourly.effective, undefined, { forceDecimals: 2 })}>
              {formatCurrency(results.hourly.effective, undefined, { forceDecimals: 2 })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HourlyBreakdown;