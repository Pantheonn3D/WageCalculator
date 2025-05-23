import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Target, DollarSign, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { useRegion } from '../../context/RegionContext'

const RetirementBreakdown = ({ results }) => {
  const { formatCurrency } = useRegion()

  if (!results) return null

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`p-6 rounded-xl text-white ${
          results.savings.onTrack 
            ? 'bg-gradient-to-r from-green-500 to-green-600' 
            : 'bg-gradient-to-r from-red-500 to-red-600'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Retirement Status</p>
            <p className="text-2xl font-bold">
              {results.savings.onTrack ? 'On Track' : 'Behind Goal'}
            </p>
            <p className="text-sm opacity-75 mt-1">
              {results.savings.onTrack 
                ? `Surplus: ${formatCurrency(results.savings.surplus)}`
                : `Shortfall: ${formatCurrency(results.savings.shortfall)}`
              }
            </p>
          </div>
          {results.savings.onTrack ? (
            <CheckCircle className="w-12 h-12 opacity-80" />
          ) : (
            <XCircle className="w-12 h-12 opacity-80" />
          )}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Projected Savings</p>
              <p className="text-2xl font-bold">{formatCurrency(results.savings.projected)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Required Savings</p>
              <p className="text-2xl font-bold">{formatCurrency(results.savings.required)}</p>
            </div>
            <Target className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Monthly Income</p>
              <p className="text-2xl font-bold">{formatCurrency(results.income.projectedIncome / 12)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Years to Retire</p>
              <p className="text-2xl font-bold">{results.timeline.yearsToRetirement}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Analysis</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Current Savings</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.savings.current)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Monthly Contribution</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.contributions.monthly)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Employer Match</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.contributions.employerMatch)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Total Monthly</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.contributions.total)}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-semibold text-blue-900">Projected at Retirement</span>
                <span className="font-bold text-blue-900">{formatCurrency(results.savings.projected)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Retirement Income */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Retirement Income</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Required Annual Income</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.income.requiredIncome)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Projected Income from Savings</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.income.projectedIncome)}</span>
            </div>
            {results.income.socialSecurity > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Social Security</span>
                <span className="font-semibold text-gray-900">{formatCurrency(results.income.socialSecurity)}</span>
              </div>
            )}
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-900">Total Retirement Income</span>
                <span className="font-bold text-green-900">
                  {formatCurrency(results.income.projectedIncome + results.income.socialSecurity)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Items */}
      {!results.savings.onTrack && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="calculator-card border-l-4 border-red-500"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Items to Get On Track</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-red-900">Increase Monthly Contribution To:</span>
              <span className="font-bold text-red-900">{formatCurrency(results.contributions.monthlyNeeded)}</span>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              <p>To reach your retirement goal, consider:</p>
              <ul className="mt-2 space-y-1 ml-4">
                <li>• Increasing your contribution by {formatCurrency(results.contributions.monthlyNeeded - results.contributions.total)} per month</li>
                <li>• Maximizing your employer match</li>
                <li>• Reducing expenses to free up more money for savings</li>
                <li>• Working a few extra years to allow more time for growth</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Assumptions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Assumptions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{results.assumptions.expectedReturn}%</div>
            <div className="text-sm text-gray-600">Expected Return</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{results.assumptions.inflationRate}%</div>
            <div className="text-sm text-gray-600">Inflation Rate</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{results.assumptions.withdrawalRate}%</div>
            <div className="text-sm text-gray-600">Withdrawal Rate</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{results.assumptions.expenseRatio}%</div>
            <div className="text-sm text-gray-600">Expense Ratio</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RetirementBreakdown