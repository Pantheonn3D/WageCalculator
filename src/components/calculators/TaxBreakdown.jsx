import React from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingDown, Percent, Receipt } from 'lucide-react'
import { useRegion } from '../../context/RegionContext'

const TaxBreakdown = ({ results }) => {
  const { formatCurrency } = useRegion()

  if (!results) return null

  const taxItems = [
    { label: 'Federal Tax', amount: results.breakdown.federalTax },
    { label: 'State/Provincial Tax', amount: results.breakdown.stateTax },
    { label: 'Social Security', amount: results.breakdown.socialSecurity },
    { label: 'Medicare/Health', amount: results.breakdown.medicare },
    { label: 'Other Taxes', amount: results.breakdown.otherTaxes }
  ].filter(item => item.amount > 0)

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
              <p className="text-green-100 text-sm font-medium">Gross Income</p>
              <p className="text-2xl font-bold">{formatCurrency(results.income.gross)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
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
              <p className="text-red-100 text-sm font-medium">Total Taxes</p>
              <p className="text-2xl font-bold">{formatCurrency(results.taxes.totalTax)}</p>
            </div>
            <Receipt className="w-8 h-8 text-red-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Net Income</p>
              <p className="text-2xl font-bold">{formatCurrency(results.income.net)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-blue-200" />
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
              <p className="text-purple-100 text-sm font-medium">Effective Rate</p>
              <p className="text-2xl font-bold">{results.taxes.effectiveRate.toFixed(1)}%</p>
            </div>
            <Percent className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Breakdown</h3>
          <div className="space-y-3">
            {taxItems.map((item, index) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
              </div>
            ))}
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-semibold text-red-900">Total Taxes</span>
                <span className="font-bold text-red-900">{formatCurrency(results.taxes.totalTax)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Income & Deductions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income & Deductions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Gross Income</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.income.gross)}</span>
            </div>
            {results.deductions.preTax > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Pre-tax Deductions</span>
                <span className="font-semibold text-gray-900">-{formatCurrency(results.deductions.preTax)}</span>
              </div>
            )}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Taxable Income</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.income.taxable)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Taxes</span>
              <span className="font-semibold text-gray-900">-{formatCurrency(results.taxes.totalTax)}</span>
            </div>
            {results.deductions.postTax > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Post-tax Deductions</span>
                <span className="font-semibold text-gray-900">-{formatCurrency(results.deductions.postTax)}</span>
              </div>
            )}
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-900">Net Income</span>
                <span className="font-bold text-green-900">{formatCurrency(results.income.net)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tax Rates & Monthly Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Rates</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{results.taxes.effectiveRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Effective Rate</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{results.taxes.marginalRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Marginal Rate</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="calculator-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Gross Monthly</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.monthly.grossIncome)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Monthly Taxes</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.monthly.taxes)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-semibold text-green-900">Net Monthly</span>
              <span className="font-bold text-green-900">{formatCurrency(results.monthly.netIncome)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TaxBreakdown