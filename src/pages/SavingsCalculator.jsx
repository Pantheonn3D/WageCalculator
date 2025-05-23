import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PiggyBank, Download, Share2, Info } from 'lucide-react'
import SEOHead from '../components/seo/SEOHead'
import { useRegion } from '../context/RegionContext'
import SavingsBreakdown from '../components/calculators/SavingsBreakdown'
import SavingsChart from '../components/calculators/SavingsChart'

const SavingsCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion()
  const [formData, setFormData] = useState({
    initialAmount: '1000',
    monthlyContribution: '500',
    annualReturn: '7',
    years: '10',
    compoundingFrequency: '12',
    inflationRate: '3',
    goalAmount: ''
  })
  const [results, setResults] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    if (formData.initialAmount || formData.monthlyContribution) {
      calculateSavings()
    }
  }, [formData])

  const calculateSavings = async () => {
    setIsCalculating(true)
    
    try {
      const initialAmount = parseFloat(formData.initialAmount) || 0
      const monthlyContribution = parseFloat(formData.monthlyContribution) || 0
      const annualReturn = parseFloat(formData.annualReturn) / 100 || 0.07
      const years = parseFloat(formData.years) || 10
      const compoundingFrequency = parseInt(formData.compoundingFrequency) || 12
      const inflationRate = parseFloat(formData.inflationRate) / 100 || 0.03
      const goalAmount = parseFloat(formData.goalAmount) || 0

      const months = years * 12
      const periodicRate = annualReturn / compoundingFrequency
      const periodsPerYear = compoundingFrequency
      const totalPeriods = years * periodsPerYear
      
      // Future value of initial amount
      const futureValueInitial = initialAmount * Math.pow(1 + periodicRate, totalPeriods)
      
      // Future value of monthly contributions (annuity)
      const monthlyRate = annualReturn / 12
      const futureValueContributions = monthlyContribution * 
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
      
      const totalFutureValue = futureValueInitial + futureValueContributions
      const totalContributions = initialAmount + (monthlyContribution * months)
      const totalInterest = totalFutureValue - totalContributions
      
      // Inflation-adjusted value
      const realValue = totalFutureValue / Math.pow(1 + inflationRate, years)
      
      // Monthly breakdown for chart
      const monthlyData = []
      let balance = initialAmount
      let contributionsToDate = initialAmount
      
      for (let month = 0; month <= months; month++) {
        if (month > 0) {
          balance = balance * (1 + monthlyRate) + monthlyContribution
          contributionsToDate += monthlyContribution
        }
        
        monthlyData.push({
          month,
          year: Math.floor(month / 12),
          balance,
          contributions: contributionsToDate,
          interest: balance - contributionsToDate
        })
      }

      // Goal analysis
      let timeToGoal = null
      let monthlyNeededForGoal = null
      
      if (goalAmount > 0) {
        // Calculate time to reach goal
        if (monthlyContribution > 0) {
          // Using formula for future value of annuity
          const A = goalAmount - futureValueInitial
          if (A > 0) {
            const timeMonths = Math.log(1 + (A * monthlyRate) / monthlyContribution) / Math.log(1 + monthlyRate)
            timeToGoal = timeMonths / 12
          }
        }
        
        // Calculate monthly payment needed to reach goal
        const A = goalAmount - futureValueInitial
        if (A > 0) {
          monthlyNeededForGoal = (A * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)
        }
      }

      const calculations = {
        summary: {
          totalFutureValue,
          totalContributions,
          totalInterest,
          realValue,
          interestRate: (totalInterest / totalContributions) * 100
        },
        breakdown: {
          initialAmount,
          monthlyContribution,
          totalMonthlyContributions: monthlyContribution * months,
          interestEarned: totalInterest,
          years,
          months
        },
        goal: {
          targetAmount: goalAmount,
          timeToGoal,
          monthlyNeededForGoal,
          willReachGoal: goalAmount > 0 ? totalFutureValue >= goalAmount : null
        },
        monthlyData,
        assumptions: {
          annualReturn: annualReturn * 100,
          inflationRate: inflationRate * 100,
          compoundingFrequency
        }
      }

      setResults(calculations)
    } catch (error) {
      console.error('Savings calculation error:', error)
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
    a.download = 'savings-calculation.json'
    a.click()
  }

  const shareResults = async () => {
    if (!results || !navigator.share) return
    
    try {
      await navigator.share({
        title: 'Savings Calculation Results',
        text: `Future Value: ${formatCurrency(results.summary.totalFutureValue)}\nTotal Interest: ${formatCurrency(results.summary.totalInterest)}`,
        url: window.location.href
      })
    } catch (error) {
      console.log('Share failed:', error)
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Savings Calculator",
    "description": "Calculate compound interest and savings growth",
    "applicationCategory": "FinanceApplication",
    "featureList": ["Compound interest calculation", "Savings goal planning", "Investment growth projection"]
  }

  return (
    <>
      <SEOHead 
        title={`Savings Calculator with Compound Interest`}
        description={`Calculate your savings growth with compound interest. Plan your financial goals and see how your money can grow over time.`}
        keywords="savings calculator, compound interest, investment calculator, savings goal, financial planning"
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
              <PiggyBank className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Savings Calculator
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Calculate compound interest and plan your savings goals
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
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Savings Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Amount
                    </label>
                    <input
                      type="number"
                      name="initialAmount"
                      value={formData.initialAmount}
                      onChange={handleInputChange}
                      placeholder="1000"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Contribution
                    </label>
                    <input
                      type="number"
                      name="monthlyContribution"
                      value={formData.monthlyContribution}
                      onChange={handleInputChange}
                      placeholder="500"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Return Rate (%)
                    </label>
                    <input
                      type="number"
                      name="annualReturn"
                      value={formData.annualReturn}
                      onChange={handleInputChange}
                      placeholder="7"
                      className="input-field"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Period (Years)
                    </label>
                    <input
                      type="number"
                      name="years"
                      value={formData.years}
                      onChange={handleInputChange}
                      placeholder="10"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compounding Frequency
                    </label>
                    <select
                      name="compoundingFrequency"
                      value={formData.compoundingFrequency}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="1">Annually</option>
                      <option value="4">Quarterly</option>
                      <option value="12">Monthly</option>
                      <option value="365">Daily</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inflation Rate (%)
                    </label>
                    <input
                      type="number"
                      name="inflationRate"
                      value={formData.inflationRate}
                      onChange={handleInputChange}
                      placeholder="3"
                      className="input-field"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Savings Goal (Optional)
                    </label>
                    <input
                      type="number"
                      name="goalAmount"
                      value={formData.goalAmount}
                      onChange={handleInputChange}
                      placeholder="100000"
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
                  <SavingsBreakdown results={results} />
                  <SavingsChart results={results} />
                </div>
              ) : (
                <div className="calculator-card flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <PiggyBank className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Enter your savings information to see projections</p>
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
                    Understanding Compound Interest
                  </h3>
                  <div className="prose prose-sm text-gray-600">
                    <p>
                      Compound interest is the addition of interest to the principal sum of a loan or deposit. 
                      It's calculated on the initial principal and accumulated interest from previous periods.
                    </p>
                    <ul className="mt-3 space-y-1">
                      <li>• <strong>Principal:</strong> Your initial investment amount</li>
                      <li>• <strong>Interest Rate:</strong> Annual percentage return on your investment</li>
                      <li>• <strong>Compounding:</strong> How often interest is added to your balance</li>
                      <li>• <strong>Time:</strong> The longer you invest, the more compound interest works</li>
                      <li>• <strong>Regular Contributions:</strong> Adding money regularly amplifies growth</li>
                    </ul>
                    <p className="mt-3">
                      The power of compound interest lies in earning returns on your returns, creating exponential growth over time.
                    </p>
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

export default SavingsCalculator