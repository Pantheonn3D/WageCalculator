import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, TrendingDown, CreditCard } from 'lucide-react';
import { useRegion } from '../../context/RegionContext';

const LoanBreakdown = ({ results }) => {
  const { formatCurrency } = useRegion();

  if (!results) return null;

  const formatNumber = (num, decimals = 1) => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    return new Intl.NumberFormat(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    }).format(num);
  };

  // Format payoff time into "Xy Ym"
  const formatPayoffTime = (totalMonths) => {
    if (typeof totalMonths !== 'number' || isNaN(totalMonths) || totalMonths < 0) return 'N/A';
    const years = Math.floor(totalMonths / 12);
    const months = Math.round(totalMonths % 12); // Round months
    let timeString = '';
    if (years > 0) {
      timeString += `${years}y `;
    }
    if (months > 0 || years === 0) { // Show months if there are any, or if years is 0
      timeString += `${months}m`;
    }
    return timeString.trim() || '0m'; // Handle case where totalMonths is 0
  };


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
              <p className="text-blue-100 text-sm font-medium">Monthly Payment</p>
              {/* Monthly payment usually needs full precision */}
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.loan.monthlyPayment, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.loan.monthlyPayment, undefined, { forceDecimals: 2 })}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200 opacity-80" />
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
              <p className="text-red-100 text-sm font-medium">Total Interest</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.loan.totalInterest, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.loan.totalInterest, undefined, { notation: 'compact', maximumSignificantDigits: 4 })}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-200 opacity-80" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Amount Paid</p>
              <p className="text-2xl lg:text-3xl font-bold" title={formatCurrency(results.loan.totalAmount, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.loan.totalAmount, undefined, { notation: 'compact', maximumSignificantDigits: 4 })}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-green-200 opacity-80" />
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
              <p className="text-purple-100 text-sm font-medium">Payoff Time</p>
              <p className="text-2xl lg:text-3xl font-bold">
                {formatPayoffTime(results.loan.payoffTime)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200 opacity-80" />
          </div>
        </motion.div>
      </div>

      {/* Monthly Payment & Loan Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Payment Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Principal & Interest', value: results.breakdown.principalAndInterest, condition: true },
              { label: 'Property Tax (Monthly)', value: results.breakdown.propertyTax, condition: results.breakdown.propertyTax > 0 },
              { label: 'Insurance (Monthly)', value: results.breakdown.insurance, condition: results.breakdown.insurance > 0 },
              { label: 'PMI (Monthly)', value: results.breakdown.pmi, condition: results.breakdown.pmi > 0 },
              { label: 'Extra Payment', value: results.breakdown.extraPayment, condition: results.breakdown.extraPayment > 0 },
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
              <div className="flex items-center justify-between p-3.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors">
                <span className="font-semibold">Total Monthly Payment</span>
                <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(results.breakdown.total, undefined, { forceDecimals: 2 })}>
                  {formatCurrency(results.breakdown.total, undefined, { smartDecimals: true })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Original Loan Amount', value: results.loan.amount },
              { label: 'Down Payment', value: results.loan.downPayment },
              { label: 'Actual Principal Borrowed', value: results.loan.principal },
              { label: 'Total Interest Paid', value: results.loan.totalInterest },
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
                <span className="font-semibold">Total Cost of Loan</span>
                <span className="font-bold text-right flex-1 min-w-0 ml-2 truncate" title={formatCurrency(results.loan.totalAmount, undefined, { forceDecimals: 2 })}>
                  {formatCurrency(results.loan.totalAmount, undefined, { smartDecimals: true })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Extra Payment Savings */}
      {results.breakdown.extraPayment > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Extra Payment Benefits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> {/* Adjusted to sm:grid-cols-3 */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Interest Saved</div>
              <div className="text-2xl font-bold text-green-600" title={formatCurrency(results.savings.interestSaved, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.savings.interestSaved, undefined, { smartDecimals: true })}
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Time Saved</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatPayoffTime(results.savings.timeSaved * 12)} {/* Convert years to months for formatter */}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total Extra Paid</div>
              <div className="text-2xl font-bold text-purple-600" title={formatCurrency(results.savings.extraPaymentTotal, undefined, { forceDecimals: 2 })}>
                {formatCurrency(results.savings.extraPaymentTotal, undefined, { smartDecimals: true })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* First Year Payment Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">First Year Amortization Schedule</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-2.5 px-3 font-semibold text-gray-600">#</th>
                <th className="text-left py-2.5 px-3 font-semibold text-gray-600">Principal</th>
                <th className="text-left py-2.5 px-3 font-semibold text-gray-600">Interest</th>
                <th className="text-left py-2.5 px-3 font-semibold text-gray-600">Balance</th>
              </tr>
            </thead>
            <tbody>
              {results.schedule.map((payment) => ( // Only shows first 12 if schedule is long
                <tr key={payment.payment} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-2 px-3 text-gray-700">{payment.payment}</td>
                  <td className="py-2 px-3 text-gray-700" title={formatCurrency(payment.principalPayment, undefined, { forceDecimals: 2 })}>{formatCurrency(payment.principalPayment, undefined, { smartDecimals: true })}</td>
                  <td className="py-2 px-3 text-gray-700" title={formatCurrency(payment.interestPayment, undefined, { forceDecimals: 2 })}>{formatCurrency(payment.interestPayment, undefined, { smartDecimals: true })}</td>
                  <td className="py-2 px-3 text-gray-700" title={formatCurrency(payment.remainingBalance, undefined, { forceDecimals: 2 })}>{formatCurrency(payment.remainingBalance, undefined, { smartDecimals: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default LoanBreakdown;