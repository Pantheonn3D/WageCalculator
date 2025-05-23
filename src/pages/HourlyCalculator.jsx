import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Download, Share2, Info } from 'lucide-react'
import SEOHead from '../components/seo/SEOHead'
import { useRegion } from '../context/RegionContext'
import { calculateTax } from '../utils/taxCalculations'
import HourlyBreakdown from '../components/calculators/HourlyBreakdown'
import HourlyChart from '../components/calculators/HourlyChart'

const HourlyCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion()
  const [formData, setFormData] = useState({
    hourlyRate: '',
    hoursPerWeek: countries[selectedCountry]?.workingHours?.standard || 40,
    weeksPerYear: 52,
    overtimeHours: '0',
    overtimeRate: countries[selectedCountry]?.workingHours?.overtime || 1.5,
    vacationWeeks: '2',
    bonus: '0',
    deductions: '0'
  })
  const [results, setResults] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    if (formData.hourlyRate && !isNaN(parseFloat(formData.hourlyRate))) {
      calculateHourly()
    }
  }, [formData, selectedCountry])

  const calculateHourly = async () => {
    setIsCalculating(true)
    
    try {
      const hourlyRate = parseFloat(formData.hourlyRate) || 0
      const hoursPerWeek = parseFloat(formData.hoursPerWeek) || 40
      const weeksPerYear = parseFloat(formData.weeksPerYear) || 52
      const overtimeHours = parseFloat(formData.overtimeHours) || 0
      const overtimeRate = parseFloat(formData.overtimeRate) || 1.5
      const vacationWeeks = parseFloat(formData.vacationWeeks) || 0
      const bonus = parseFloat(formData.bonus) || 0
      const deductions = parseFloat(formData.deductions) || 0

      const workingWeeks = weeksPerYear - vacationWeeks
      const regularHours = hoursPerWeek * workingWeeks
      const overtimeTotal = overtimeHours * workingWeeks
      const overtimePay = overtimeTotal * hourlyRate * (overtimeRate - 1)

      const regularPay = regularHours * hourlyRate
      const grossAnnual = regularPay + overtimePay + bonus
      
      const taxInfo = calculateTax(grossAnnual, selectedCountry)
      const netAnnual = grossAnnual - taxInfo.totalTax - deductions

      const calculations = {
        hourly: {
          regular: hourlyRate,
          overtime: hourlyRate * overtimeRate,
          effective: grossAnnual / (regularHours + overtimeTotal)
        },
        gross: {
          annual: grossAnnual,
          monthly: grossAnnual / 12,
          weekly: grossAnnual / weeksPerYear,
          regular: regularPay,
          overtime: overtimePay
        },
        net: {
          annual: netAnnual,
          monthly: netAnnual / 12,
          weekly: netAnnual / weeksPerYear,
          hourly: netAnnual / (regularHours + overtimeTotal)
        },
        hours: {
          regular: regularHours,
          overtime: overtimeTotal,
          total: regularHours + overtimeTotal,
          perWeek: hoursPerWeek + (overtimeHours || 0)
        },
        taxes: taxInfo,
        deductions: {
          voluntary: deductions,
          total: taxInfo.totalTax + deductions
        },
        schedule: {
          workingWeeks,
          vacationWeeks,
          hoursPerWeek
        }
      }

      setResults(calculations)
    } catch (error) {
      console.error('Calculation error:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const exportResults = () => {
    if (!results) return
    
    const data = {
      country: countries[selectedCountry].name,
      currency: countries[selectedCountry].currency,
      ...formData,
      ...results
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hourly-calculation.json'
    a.click()
  }

  const shareResults = async () => {
    if (!results || !navigator.share) return
    
    try {
      await navigator.share({
        title: 'Hourly Wage Calculation Results',
        text: `Hourly Rate: ${formatCurrency(results.hourly.regular)}\nAnnual Salary: ${formatCurrency(results.gross.annual)}`,
        url: window.location.href
      })
    } catch (error) {
      console.log('Share failed:', error)
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Hourly Wage Calculator",
    "description": "Calculate annual salary from hourly wage including overtime",
    "applicationCategory": "FinanceApplication",
    "featureList": ["Hourly to salary conversion", "Overtime calculation", "Tax calculation"]
  }

  return (
    <>
      <SEOHead 
        title={`Hourly Wage Calculator for ${countries[selectedCountry]?.name || 'Global'}`}
        description={`Calculate your annual salary from hourly wage in ${countries[selectedCountry]?.name || 'any country'}. Include overtime pay and tax calculations.`}
        keywords="hourly calculator, wage calculator, hourly to salary, overtime calculator"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Hourly Wage Calculator
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Calculate your annual salary from hourly wage for {countries[selectedCountry]?.name || 'your region'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="calculator-card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Hourly Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      placeholder="Enter hourly rate"
                      className="input-field"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hours per Week
                    </label>
                    <input
                      type="number"
                      name="hoursPerWeek"
                      value={formData.hoursPerWeek}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weeks per Year
                    </label>
                    <input
                      type="number"
                      name="weeksPerYear"
                      value={formData.weeksPerYear}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vacation Weeks
                    </label>
                    <input
                      type="number"
                      name="vacationWeeks"
                      value={formData.vacationWeeks}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overtime Hours per Week
                    </label>
                    <input
                      type="number"
                      name="overtimeHours"
                      value={formData.overtimeHours}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="input-field"
                      step="0.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overtime Multiplier
                    </label>
                    <input
                      type="number"
                      name="overtimeRate"
                      value={formData.overtimeRate}
                      onChange={handleInputChange}
                      className="input-field"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Bonus
                    </label>
                    <input
                      type="number"
                      name="bonus"
                      value={formData.bonus}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Deductions
                    </label>
                    <input
                      type="number"
                      name="deductions"
                      value={formData.deductions}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="input-field"
                    />
                  </div>
                </div>

                {results && (
                  <div className="mt-6 flex space-x-2">
                    <button
                      onClick={exportResults}
                      className="btn-secondary flex items-center space-x-2 flex-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                    {navigator.share && (
                      <button
                        onClick={shareResults}
                        className="btn-secondary flex items-center space-x-2 flex-1"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2"
            >
              {isCalculating ? (
                <div className="calculator-card flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : results ? (
                <div className="space-y-6">
                  <HourlyBreakdown results={results} />
                  <HourlyChart results={results} />
                </div>
              ) : (
                <div className="calculator-card flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Enter your hourly information to see results</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12"
          >
            <div className="calculator-card">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-primary-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Understanding Hourly Wage Calculations
                  </h3>
                  <div className="prose prose-sm text-gray-600">
                    <p>
                      This calculator converts your hourly wage to annual salary, considering overtime, 
                      vacation time, and applicable taxes for {countries[selectedCountry]?.name || 'your region'}.
                    </p>
                    <ul className="mt-3 space-y-1">
                      <li>• Regular hours are calculated at your base hourly rate</li>
                      <li>• Overtime hours are calculated at the specified multiplier (usually 1.5x)</li>
                      <li>• Vacation weeks are excluded from working time calculations</li>
                      <li>• Taxes are calculated based on total annual income</li>
                      <li>• Results include both gross and net annual salaries</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default HourlyCalculator