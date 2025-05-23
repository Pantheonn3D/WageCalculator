import React from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useRegion } from '../../context/RegionContext'

const HourlyChart = ({ results }) => {
  const { formatCurrency } = useRegion()

  if (!results) return null

  const payData = [
    { period: 'Hourly', gross: results.hourly.regular, net: results.net.hourly },
    { period: 'Weekly', gross: results.gross.weekly, net: results.net.weekly },
    { period: 'Monthly', gross: results.gross.monthly, net: results.net.monthly },
    { period: 'Annual', gross: results.gross.annual, net: results.net.annual }
  ]

  const hoursData = [
    { name: 'Regular Hours', value: results.hours.regular, color: '#22c55e' },
    { name: 'Overtime Hours', value: results.hours.overtime, color: '#f59e0b' }
  ].filter(item => item.value > 0)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
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
            {data.value.toLocaleString()} hours
          </p>
          <p className="text-xs text-gray-500">
            {((data.value / results.hours.total) * 100).toFixed(1)}% of total
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pay Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gross vs Net Pay</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={payData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={(value) => formatCurrency(value).replace(/\.\d+/, '')} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="gross" fill="#94a3b8" name="Gross" radius={[2, 2, 0, 0]} />
              <Bar dataKey="net" fill="#22c55e" name="Net" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-xs text-gray-600">Gross Pay</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-xs text-gray-600">Net Pay</span>
          </div>
        </div>
      </motion.div>

      {/* Hours Distribution */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hours Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={hoursData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {hoursData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 gap-2 mt-4">
          {hoursData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {item.value.toLocaleString()} hrs
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default HourlyChart