import React from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { useRegion } from '../../context/RegionContext'

const LoanChart = ({ results }) => {
  const { formatCurrency } = useRegion()

  if (!results) return null

  const pieData = [
    { name: 'Principal', value: results.loan.principal, color: '#22c55e' },
    { name: 'Interest', value: results.loan.totalInterest, color: '#ef4444' }
  ]

  const monthlyBreakdownData = [
    { name: 'Principal & Interest', value: results.breakdown.principalAndInterest },
    { name: 'Property Tax', value: results.breakdown.propertyTax || 0 },
    { name: 'Insurance', value: results.breakdown.insurance || 0 },
    { name: 'PMI', value: results.breakdown.pmi || 0 },
    { name: 'Extra Payment', value: results.breakdown.extraPayment || 0 }
  ].filter(item => item.value > 0)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">Year {label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
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
            {((data.value / results.loan.totalAmount) * 100).toFixed(1)}% of total
          </p>
        </div>
      )
    }
    return null
  }

  const BarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Loan Balance Over Time */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Balance Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={results.yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => formatCurrency(value).replace(/\.\d+/, '')} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                name="Remaining Balance"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Principal vs Interest */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Principal vs Interest</h3>
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
        <div className="grid grid-cols-2 gap-4 mt-4">
          {pieData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Monthly Payment Breakdown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="calculator-card lg:col-span-2"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Payment Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis tickFormatter={(value) => formatCurrency(value).replace(/\.\d+/, '')} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}

export default LoanChart