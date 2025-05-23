import React from 'react'
import { motion } from 'framer-motion'
import { Clock, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { useRegion } from '../../context/RegionContext'

const HourlyBreakdown = ({ results }) => {
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
              <p className="text-blue-100 text-sm font-medium">Hourly Rate</p>
              <p className="text-2xl font-bold">{formatCurrency(results.hourly.regular)}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Annual Gross</p>
              <p className="text-2xl font-bold">{formatCurrency(results.gross.annual)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
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
              <p className="text-purple-100 text-sm font-medium">Annual Net</p>
              <p className="text-2xl font-bold">{formatCurrency(results.net.annual)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
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
              <p className="text-orange-100 text-sm font-medium">Total Hours</p>
              <p className="text-2xl font-bold">{results.hours.total.toLocaleString()}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-200" />
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
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pay Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Regular Pay</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.gross.regular)}</span>
            </div>
            {results.gross.overtime > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Overtime Pay</span>
                <span className="font-semibold text-gray-900">{formatCurrency(results.gross.overtime)}</span>
              </div>
            )}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Monthly Gross</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.gross.monthly)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Weekly Gross</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.gross.weekly)}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-900">Total Annual Gross</span>
                <span className="font-bold text-green-900">{formatCurrency(results.gross.annual)}</span>
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
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Regular Hours</span>
              <span className="font-semibold text-gray-900">{results.hours.regular.toLocaleString()}</span>
            </div>
            {results.hours.overtime > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Overtime Hours</span>
                <span className="font-semibold text-gray-900">{results.hours.overtime.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Hours per Week</span>
              <span className="font-semibold text-gray-900">{results.hours.perWeek}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Working Weeks</span>
              <span className="font-semibold text-gray-900">{results.schedule.workingWeeks}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-semibold text-blue-900">Total Annual Hours</span>
                <span className="font-bold text-blue-900">{results.hours.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hourly Rates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Rate Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{formatCurrency(results.hourly.regular)}</div>
            <div className="text-sm text-gray-600">Regular Rate</div>
          </div>
          {results.hourly.overtime !== results.hourly.regular && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{formatCurrency(results.hourly.overtime)}</div>
              <div className="text-sm text-gray-600">Overtime Rate</div>
            </div>
          )}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{formatCurrency(results.hourly.effective)}</div>
            <div className="text-sm text-gray-600">Effective Rate</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default HourlyBreakdown