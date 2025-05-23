import React from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { useRegion } from '../../context/RegionContext'

const RetirementChart = ({ results }) => {
  const { formatCurrency } = useRegion()

  if (!results) return null

  // Format data for the charts
  const growthData = results.yearlyProjection.filter((_, index) => index % Math.max(1, Math.floor(results.timeline.yearsToRetirement / 10)) === 0)

  const incomeData = [
    { name: 'Required', value: results.income.requiredIncome },
    { name: 'Projected', value: results.income.projectedIncome }
  ]

  const pieData = [
    { name: 'Contributions', value: results.yearlyProjection[results.yearlyProjection.length - 1].contributions, color: '#22c55e' },
    { name: 'Investment Growth', value: results.yearlyProjection[results.yearlyProjection.length - 1].growth, color: '#3b82f6' }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">Age {label}</p>
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

  const BarTooltip = ({ active, payload, label }) => {
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
            {((data.value / results.savings.projected) * 100).toFixed(1)}% of total
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Savings Growth Over Time */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Growth Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis tickFormatter={(value) => formatCurrency(value).replace(/\.\d+/, '')} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="contributions" 
                stackId="1"
                stroke="#22c55e" 
                fill="#22c55e" 
                fillOpacity={0.6}
                name="Contributions"
              />
              <Area 
                type="monotone" 
                dataKey="growth" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                name="Growth"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Contributions vs Growth */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contributions vs Growth</h3>
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

      {/* Income Comparison */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="calculator-card lg:col-span-2"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Retirement Income Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value).replace(/\.\d+/, '')} />
              <Tooltip content={<BarTooltip />} />
              <Bar 
                dataKey="value" 
                name="Amount"
                radius={[4, 4, 0, 0]}
                fill={(data) => data.name === 'Required' ? '#ef4444' : '#22c55e'}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-8 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-sm text-gray-600">Required Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">Projected Income</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RetirementChart