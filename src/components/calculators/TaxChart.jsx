import React from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useRegion } from '../../context/RegionContext'

const TaxChart = ({ results }) => {
  const { formatCurrency } = useRegion()

  if (!results) return null

  const pieData = [
    { name: 'Net Income', value: results.income.net, color: '#22c55e' },
    { name: 'Federal Tax', value: results.breakdown.federalTax, color: '#ef4444' },
    { name: 'State/Provincial Tax', value: results.breakdown.stateTax, color: '#f97316' },
    { name: 'Social Security', value: results.breakdown.socialSecurity, color: '#8b5cf6' },
    { name: 'Medicare/Health', value: results.breakdown.medicare, color: '#06b6d4' },
    { name: 'Other Taxes', value: results.breakdown.otherTaxes, color: '#6b7280' }
  ].filter(item => item.value > 0)

  const comparisonData = [
    { category: 'Gross Income', amount: results.income.gross },
    { category: 'Taxable Income', amount: results.income.taxable },
    { category: 'Total Taxes', amount: results.taxes.totalTax },
    { category: 'Net Income', amount: results.income.net }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.payload.color }} className="text-sm">
            {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-gray-500">
            {((data.value / results.income.gross) * 100).toFixed(1)}% of gross
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Income Distribution Pie Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {pieData.map((item, index) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600 truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Income Comparison Bar Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => formatCurrency(value).replace(/\.\d+/, '')} />
              <YAxis type="category" dataKey="category" width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="#0ea5e9" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}

export default TaxChart