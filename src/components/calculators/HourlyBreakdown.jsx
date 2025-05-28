import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, TrendingUp, Calendar, Percent } from 'lucide-react'; // Added Percent
import { useRegion } from '../../context/RegionContext';

// Helper component for Stat Cards in the Hourly Rate Info section
const RateStatCard = ({ title, value, unit, titleValue, className = "" }) => (
  <div className={`text-center p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg ${className}`}>
    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</div>
    <div 
      className="text-2xl font-bold text-primary-600 dark:text-primary-400" 
      title={titleValue || value} // Use titleValue for full precision tooltip if provided
    >
      {value}
      {unit && <span className="text-base font-normal ml-0.5">{unit}</span>}
    </div>
  </div>
);


const HourlyBreakdown = ({ results, countryCurrency }) => { // Added countryCurrency prop
  const { formatCurrency: contextFormatCurrency } = useRegion();

  // Use passed-in formatCurrency if available (from calculator), else from context
  const formatCurrency = contextFormatCurrency; 

  if (!results) return null;

  // Ensure results.hours exists and has properties, default to 0 if not
  const hoursTotalAnnual = results.hours?.totalAnnual || 0;
  const regularHoursAnnual = results.hours?.standardAnnual || 0;
  const overtimeHoursAnnual = results.hours?.overtimeAnnual || 0;
  const hoursPerWeekAvg = results.hours?.perWeekTotal || 0;
  const workingWeeks = results.schedule?.workingWeeksAnnual || 0;
  
  // Ensure results.hourly exists
  const regularHourlyRate = results.hourly?.regular || 0;
  const overtimeHourlyRate = results.hourly?.overtime || 0;
  const effectiveGrossHourlyRate = results.hourly?.effectiveGross || 0;

  // Ensure results.gross exists
  const grossRegularPay = results.gross?.standardPayAnnual || 0;
  const grossOvertimePay = results.gross?.overtimePayAnnual || 0;
  const grossMonthly = results.gross?.monthly || 0;
  const grossWeekly = results.gross?.weekly || 0;
  const grossAnnual = results.gross?.annual || 0;

  // Ensure results.net exists
  const netAnnual = results.net?.annual || 0;

  // Ensure results.taxes exists
  const effectiveTaxRateValue = results.taxes?.effectiveRate;


  const cardBaseClass = "bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6";

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 text-white p-5 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Hourly Rate</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(regularHourlyRate, countryCurrency, { forceDecimals: 2 })}>
                {formatCurrency(regularHourlyRate, countryCurrency, { forceDecimals: 2 })}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-200 opacity-70" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
          className="bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 text-white p-5 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Annual Gross</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(grossAnnual, countryCurrency, { forceDecimals: 2 })}>
                {formatCurrency(grossAnnual, countryCurrency, { notation: 'compact', maximumSignificantDigits: 4 })}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200 opacity-70" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 text-white p-5 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Annual Net</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(netAnnual, countryCurrency, { forceDecimals: 2 })}>
                {formatCurrency(netAnnual, countryCurrency, { notation: 'compact', maximumSignificantDigits: 4 })}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200 opacity-70" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-gradient-to-br from-orange-500 to-orange-700 dark:from-orange-600 dark:to-orange-800 text-white p-5 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Hours (Annual)</p>
              <p className="text-2xl lg:text-3xl font-bold">
                {new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(hoursTotalAnnual)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-orange-200 opacity-70" />
          </div>
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pay Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className={cardBaseClass}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-neutral-700 pb-2">Pay Breakdown</h3>
          <div className="space-y-2.5"> {/* Slightly reduced space */}
            {[
              { label: 'Standard Pay (Annual)', value: grossRegularPay, condition: true },
              { label: 'Overtime Pay (Annual)', value: grossOvertimePay, condition: grossOvertimePay > 0 },
              { label: 'Monthly Gross (Avg)', value: grossMonthly, condition: true },
              { label: 'Weekly Gross (Avg)', value: grossWeekly, condition: true },
            ].map((item) => item.condition && (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                <span className="font-semibold text-gray-900 dark:text-white text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(item.value, countryCurrency, { forceDecimals: 2 })}>
                  {formatCurrency(item.value, countryCurrency, { smartDecimals: true })}
                </span>
              </div>
            ))}
            <div className="border-t dark:border-neutral-700 pt-2.5 mt-2.5">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-700/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-600/40 rounded-lg transition-colors">
                <span className="font-semibold">Total Annual Gross</span>
                <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(grossAnnual, countryCurrency, { forceDecimals: 2 })}>
                  {formatCurrency(grossAnnual, countryCurrency, { smartDecimals: true })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hours Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
          className={cardBaseClass}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-neutral-700 pb-2">Hours Breakdown</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Standard Hours (Annual)', value: regularHoursAnnual, condition: true },
              { label: 'Overtime Hours (Annual)', value: overtimeHoursAnnual, condition: overtimeHoursAnnual > 0 },
              { label: 'Hours per Week (Avg Total)', value: hoursPerWeekAvg, condition: true },
              { label: 'Working Weeks (Annual)', value: workingWeeks, condition: true },
            ].map((item) => item.condition && (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                <span className="font-semibold text-gray-900 dark:text-white text-right flex-1 min-w-0 ml-2 truncate">
                  {new Intl.NumberFormat(undefined, {maximumFractionDigits: 1}).format(item.value)}
                </span>
              </div>
            ))}
            <div className="border-t dark:border-neutral-700 pt-2.5 mt-2.5">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-700/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-600/40 rounded-lg transition-colors">
                <span className="font-semibold">Total Annual Hours</span>
                <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate">
                  {new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(hoursTotalAnnual)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hourly Rates & Tax Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        className={cardBaseClass}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-neutral-700 pb-2">Rate & Tax Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <RateStatCard 
            title="Regular Hourly Rate" 
            value={formatCurrency(regularHourlyRate, countryCurrency, { forceDecimals: 2 })}
            titleValue={formatCurrency(regularHourlyRate, countryCurrency, { forceDecimals: 2, useGrouping: false })}
          />
          {(overtimeHourlyRate !== regularHourlyRate || overtimeHoursAnnual > 0) && (
            <RateStatCard 
              title="Overtime Hourly Rate" 
              value={formatCurrency(overtimeHourlyRate, countryCurrency, { forceDecimals: 2 })}
              titleValue={formatCurrency(overtimeHourlyRate, countryCurrency, { forceDecimals: 2, useGrouping: false })}
            />
          )}
          <RateStatCard 
            title="Effective Gross Hourly" 
            value={formatCurrency(effectiveGrossHourlyRate, countryCurrency, { forceDecimals: 2 })}
            titleValue={formatCurrency(effectiveGrossHourlyRate, countryCurrency, { forceDecimals: 2, useGrouping: false })}
          />
           {/* Effective Tax Rate - if it was defined */}
           {effectiveTaxRateValue !== undefined && (
             <RateStatCard
                title="Effective Tax Rate"
                value={`${(effectiveTaxRateValue * 100).toFixed(1)}`}
                unit="%"
              />
           )}
        </div>
      </motion.div>
    </div>
  );
};

export default HourlyBreakdown;