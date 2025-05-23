import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Target, Calendar } from 'lucide-react'
import { useRegion } from '../../context/RegionContext'

const SavingsBreakdown = ({ results }) => {
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
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Future Value</p>
              <p className="text-2xl font-bold">{formatCurrency(results.summary.totalFutureValue)}</p>
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
              <p className="text-blue-100 text-sm font-medium">Total Interest</p>
              <p className="text-2xl font-bold">{formatCurrency(results.summary.totalInterest)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
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
              <p className="text-purple-100 text-sm font-medium">Real Value</p>
              <p className="text-2xl font-bold">{formatCurrency(results.summary.realValue)}</p>
            </div>
            <Target className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Time Period</p>
              <p className="text-2xl font-bold">{results.breakdown.years} Years</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Initial Amount</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.breakdown.initialAmount)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Monthly Contributions</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.breakdown.monthlyContribution)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Total Contributions</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.summary.totalContributions)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Interest Earned</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.breakdown.interestEarned)}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-900">Future Value</span>
                <span className="font-bold text-green-900">{formatCurrency(results.summary.totalFutureValue)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Goal Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Analysis</h3>
          {results.goal.targetAmount > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Target Amount</span>
                <span className="font-semibold text-gray-900">{formatCurrency(results.goal.targetAmount)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Will Reach Goal?</span>
                <span className={`font-semibold ${results.goal.willReachGoal ? 'text-green-600' : 'text-red-600'}`}>
                  {results.goal.willReachGoal ? 'Yes' : 'No'}
                </span>
              </div>
              {results.goal.timeToGoal && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Time to Goal</span>
                  <span className="font-semibold text-gray-900">{results.goal.timeToGoal.toFixed(1)} years</span>
                </div>
              )}
              {results.goal.monthlyNeededForGoal && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Monthly Needed</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(results.goal.monthlyNeededForGoal)}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Set a savings goal to see goal analysis</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Assumptions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Assumptions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{results.assumptions.annualReturn}%</div>
            <div className="text-sm text-gray-600">Annual Return</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{results.assumptions.inflationRate}%</div>
            <div className="text-sm text-gray-600">Inflation Rate</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {results.assumptions.compoundingFrequency === 365 ? 'Daily' :
               results.assumptions.compoundingFrequency === 12 ? 'Monthly' :
               results.assumptions.compoundingFrequency === 4 ? 'Quarterly' : 'Annually'}
            </div>
            <div className="text-sm text-gray-600">Compounding</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{results.summary.interestRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Total Return</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SavingsBreakdown