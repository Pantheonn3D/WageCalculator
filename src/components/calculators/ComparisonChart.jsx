import React from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts'
import { useRegion } from '../../context/RegionContext'

const ComparisonChart = ({ results }) => {
  const { formatCurrency } = useRegion()

  if (!results) return null

  // Format data for the charts
  const compensationData = results.offers.map(offer => ({
    name: offer.name,
    salary: offer.salary,
    bonus: offer.bonus,
    retirement: offer.retirementBenefit,
    id: offer.id,
    isBest: offer.id === results.bestOfferId
  }))

  const radarData = results.offers.map(offer => ({
    name: offer.name,
    compensation: Math.min(100, (offer.totalCompensation / 150000) * 100), // Scale to 0-100
    workLife: offer.workLifeScore,
    benefits: offer.benefitsScore,
    hourlyValue: Math.min(100, (offer.hourlyRate / 100) * 100), // Scale to 0-100
    overall: offer.overallScore,
    id: offer.id,
    isBest: offer.id === results.bestOfferId
  }))

  const scoreData = results.offers.map(offer => ({
    name: offer.name,
    score: offer.overallScore,
    id: offer.id,
    isBest: offer.id === results.bestOfferId
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0)
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
          <div className="border-t border-gray-200 mt-2 pt-2">
            <p className="font-medium">Total: {formatCurrency(total)}</p>
          </div>
        </div>
      )
    }
    return null
  }

  const RadarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toFixed(1)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const ScoreTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm" style={{ color: payload[0].fill }}>
            Score: {payload[0].value.toFixed(1)}
          </p>
          {payload[0].payload.isBest && (
            <p className="text-sm text-green-600 font-medium mt-1">
              Best Option
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Compensation Breakdown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Compensation Breakdown</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compensationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => formatCurrency(value).replace(/\.\d+/, '')} />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="salary" stackId="a" name="Salary" fill="#4f46e5" />
              <Bar dataKey="bonus" stackId="a" name="Bonus" fill="#3b82f6" />
              <Bar dataKey="retirement" stackId="a" name="Retirement" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Radar Comparison */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Factor Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Tooltip content={<RadarTooltip />} />
              <Legend />
              {radarData.map((entry, index) => (
                <Radar
                  key={entry.id}
                  name={entry.name}
                  dataKey={entry.isBest ? "overall" : "overall"}
                  stroke={entry.isBest ? "#16a34a" : `hsl(${210 + (index * 40)}, 80%, 50%)`}
                  fill={entry.isBest ? "#16a34a" : `hsl(${210 + (index * 40)}, 80%, 50%)`}
                  fillOpacity={0.5}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Score Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<ScoreTooltip />} />
              <Bar 
                dataKey="score" 
                name="Overall Score"
                fill={(data) => data.isBest ? "#16a34a" : "#6366f1"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}

export default ComparisonChart