import React from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Calendar, TrendingDown, CreditCard } from 'lucide-react'
import { useRegion } from '../../context/RegionContext'

const LoanBreakdown = ({ results }) => {
  const { formatCurrency } = useRegion()

  if (!results) return null

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Monthly Payment</p>
              <p className="text-2xl font-bold">{formatCurrency(results.loan.monthlyPayment)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Interest</p>
              <p className="text-2xl font-bold">{formatCurrency(results.loan.totalInterest)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(results.loan.totalAmount)}</p>
            </div>
            <CreditCard className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Payoff Time</p>
              <p className="text-2xl font-bold">{Math.round(results.loan.payoffTime / 12)}y {results.loan.payoffTime % 12}m</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>
      </div>

      {/* Monthly Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Payment Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Principal & Interest</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.breakdown.principalAndInterest)}</span>
            </div>
            {results.breakdown.propertyTax > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Property Tax</span>
                <span className="font-semibold text-gray-900">{formatCurrency(results.breakdown.propertyTax)}</span>
              </div>
            )}
            {results.breakdown.insurance > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Insurance</span>
                <span className="font-semibold text-gray-900">{formatCurrency(results.breakdown.insurance)}</span>
              </div>
            )}
            {results.breakdown.pmi > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">PMI</span>
                <span className="font-semibold text-gray-900">{formatCurrency(results.breakdown.pmi)}</span>
              </div>
            )}
            {results.breakdown.extraPayment > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Extra Payment</span>
                <span className="font-semibold text-gray-900">{formatCurrency(results.breakdown.extraPayment)}</span>
              </div>
            )}
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-semibold text-blue-900">Total Monthly Payment</span>
                <span className="font-bold text-blue-900">{formatCurrency(results.breakdown.total)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loan Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Loan Amount</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.loan.amount)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Down Payment</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.loan.downPayment)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Principal</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.loan.principal)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Total Interest</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.loan.totalInterest)}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-900">Total Cost</span>
                <span className="font-bold text-green-900">{formatCurrency(results.loan.totalAmount)}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(results.savings.interestSaved)}</div>
              <div className="text-sm text-gray-600">Interest Saved</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{results.savings.timeSaved.toFixed(1)} years</div>
              <div className="text-sm text-gray-600">Time Saved</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(results.savings.extraPaymentTotal)}</div>
              <div className="text-sm text-gray-600">Total Extra Payments</div>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">First Year Payment Schedule</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Payment</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Principal</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Interest</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Balance</th>
              </tr>
            </thead>
            <tbody>
              {results.schedule.map((payment, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 px-3 text-sm text-gray-900">{payment.payment}</td>
                  <td className="py-2 px-3 text-sm text-gray-900">{formatCurrency(payment.principalPayment)}</td>
                  <td className="py-2 px-3 text-sm text-gray-900">{formatCurrency(payment.interestPayment)}</td>
                  <td className="py-2 px-3 text-sm text-gray-900">{formatCurrency(payment.remainingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default LoanBreakdown