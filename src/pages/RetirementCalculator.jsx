import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Download, Share2, Info } from 'lucide-react'
import SEOHead from '../components/seo/SEOHead'
import { useRegion } from '../context/RegionContext'
import RetirementBreakdown from '../components/calculators/RetirementBreakdown'
import RetirementChart from '../components/calculators/RetirementChart'

const RetirementCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion()
  const [formData, setFormData] = useState({
    currentAge: '30',
    retirementAge: '65',
    currentSavings: '10000',
    monthlyContribution: '500',
    employerMatch: '3',
    salary: '60000',
    expectedReturn: '7',
    inflationRate: '3',
    retirementExpenses: '80',
    socialSecurity: '0',
    retirementGoal: ''
  })
  const [results, setResults] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    if (formData.currentAge && formData.retirementAge && formData.currentSavings) {
      calculateRetirement()
    }
  }, [formData])

  const calculateRetirement = async () => {
    setIsCalculating(true)
    
    try {
      const currentAge = parseInt(formData.currentAge) || 30
      const retirementAge = parseInt(formData.retirementAge) || 65
      const currentSavings = parseFloat(formData.currentSavings) || 0
      const monthlyContribution = parseFloat(formData.monthlyContribution) || 0
      const employerMatch = parseFloat(formData.employerMatch) / 100 || 0
      const salary = parseFloat(formData.salary) || 0
      const expectedReturn = parseFloat(formData.expectedReturn) / 100 || 0.07
      const inflationRate = parseFloat(formData.inflationRate) / 100 || 0.03
      const retirementExpenses = parseFloat(formData.retirementExpenses) / 100 || 0.8
      const socialSecurity = parseFloat(formData.socialSecurity) || 0
      const retirementGoal = parseFloat(formData.retirementGoal) || 0

      const yearsToRetirement = retirementAge - currentAge
      const monthsToRetirement = yearsToRetirement * 12
      const monthlyReturn = expectedReturn / 12
      const monthlyEmployerMatch = (salary * employerMatch) / 12

      // Future value of current savings
      const futureValueCurrentSavings = currentSavings * Math.pow(1 + expectedReturn, yearsToRetirement)

      // Future value of monthly contributions (yours + employer match)
      const totalMonthlyContribution = monthlyContribution + monthlyEmployerMatch
      const futureValueContributions = totalMonthlyContribution * 
        ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn)

      const totalRetirementSavings = futureValueCurrentSavings + futureValueContributions

      // Calculate required income in retirement
      const currentExpenses = salary * retirementExpenses
      const retirementExpensesInflated = currentExpenses * Math.pow(1 + inflationRate, yearsToRetirement)
      const annualRetirementIncome = retirementExpensesInflated - socialSecurity

      // 4% withdrawal rule
      const safeWithdrawalRate = 0.04
      const requiredSavings = annualRetirementIncome / safeWithdrawalRate

      // Year-by-year projection
      const yearlyProjection = []
      let balance = currentSavings
      let totalContributions = currentSavings
      let age = currentAge

      for (let year = 0; year <= yearsToRetirement; year++) {
        if (year > 0) {
          balance = balance * (1 + expectedReturn) + (totalMonthlyContribution * 12)
          totalContributions += totalMonthlyContribution * 12
          age++
        }

        yearlyProjection.push({
          year,
          age,
          balance,
          contributions: totalContributions,
          growth: balance - totalContributions,
          realValue: balance / Math.pow(1 + inflationRate, year)
        })
      }

      // Determine if on track
      const onTrack = totalRetirementSavings >= requiredSavings
      const shortfall = Math.max(0, requiredSavings - totalRetirementSavings)
      const surplus = Math.max(0, totalRetirementSavings - requiredSavings)

      // Calculate monthly savings needed to reach goal
      let monthlyNeeded = 0
      if (shortfall > 0) {
        const neededFromContributions = shortfall - futureValueCurrentSavings
        if (neededFromContributions > 0) {
          monthlyNeeded = (neededFromContributions * monthlyReturn) / 
            (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1)
        }
      }

      const calculations = {
        timeline: {
          currentAge,
          retirementAge,
          yearsToRetirement,
          yearsInRetirement: 85 - retirementAge // Assume life expectancy of 85
        },
        savings: {
          current: currentSavings,
          projected: totalRetirementSavings,
          required: requiredSavings,
          shortfall,
          surplus,
          onTrack
        },
        contributions: {
          monthly: monthlyContribution,
          employerMatch: monthlyEmployerMatch,
          total: totalMonthlyContribution,
          monthlyNeeded
        },
        income: {
          currentSalary: salary,
          retirementExpenses: retirementExpensesInflated,
          socialSecurity,
          requiredIncome: annualRetirementIncome,
          projectedIncome: totalRetirementSavings * safeWithdrawalRate
        },
        assumptions: {
          expectedReturn: expectedReturn * 100,
          inflationRate: inflationRate * 100,
          withdrawalRate: safeWithdrawalRate * 100,
          expenseRatio: retirementExpenses * 100
        },
        yearlyProjection,
        milestones: {
          halfwayPoint: {
            age: currentAge + Math.floor(yearsToRetirement / 2),
            targetSavings: requiredSavings * 0.3 // Rule of thumb: 3x salary at halfway point
          },
          tenYearsOut: {
            age: retirementAge - 10,
            targetSavings: requiredSavings * 0.7 // 70% of goal 10 years before retirement
          }
        }
      }

      setResults(calculations)
    } catch (error) {
      console.error('Retirement calculation error:', error)
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
    a.download = 'retirement-calculation.json'
    a.click()
  }

  const shareResults = async () => {
    if (!results || !navigator.share) return
    
    try {
      await navigator.share({
        title: 'Retirement Planning Results',
        text: `Projected Savings: ${formatCurrency(results.savings.projected)}\nRequired Savings: ${formatCurrency(results.savings.required)}`,
        url: window.location.href
      })
    } catch (error) {
      console.log('Share failed:', error)
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Retirement Calculator",
    "description": "Plan your retirement savings and calculate future nest egg",
    "applicationCategory": "FinanceApplication",
    "featureList": ["Retirement planning", "401k calculation", "Investment growth projection"]
  }

  return (
    <>
      <SEOHead 
        title={`Retirement Calculator - Plan Your Financial Future`}
        description={`Calculate your retirement savings needs and see if you're on track. Plan for 401k, IRA, and other retirement investments.`}
        keywords="retirement calculator, 401k calculator, retirement planning, pension calculator, retirement savings"
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
              <TrendingUp className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Retirement Calculator
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Plan your retirement savings and see if you're on track for your goals
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
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Retirement Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Age
                    </label>
                    <input
                      type="number"
                      name="currentAge"
                      value={formData.currentAge}
                      onChange={handleInputChange}
                      placeholder="30"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Planned Retirement Age
                    </label>
                    <input
                      type="number"
                      name="retirementAge"
                      value={formData.retirementAge}
                      onChange={handleInputChange}
                      placeholder="65"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Retirement Savings
                    </label>
                    <input
                      type="number"
                      name="currentSavings"
                      value={formData.currentSavings}
                      onChange={handleInputChange}
                      placeholder="10000"
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
                      Current Annual Salary
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="60000"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employer Match (%)
                    </label>
                    <input
                      type="number"
                      name="employerMatch"
                      value={formData.employerMatch}
                      onChange={handleInputChange}
                      placeholder="3"
                      className="input-field"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Annual Return (%)
                    </label>
                    <input
                      type="number"
                      name="expectedReturn"
                      value={formData.expectedReturn}
                      onChange={handleInputChange}
                      placeholder="7"
                      className="input-field"
                      step="0.1"
                    />
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
                      Retirement Expenses (% of current)
                    </label>
                    <input
                      type="number"
                      name="retirementExpenses"
                      value={formData.retirementExpenses}
                      onChange={handleInputChange}
                      placeholder="80"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Social Security
                    </label>
                    <input
                      type="number"
                      name="socialSecurity"
                      value={formData.socialSecurity}
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
                  <RetirementBreakdown results={results} />
                  <RetirementChart results={results} />
                </div>
              ) : (
                <div className="calculator-card flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Enter your retirement information to see projections</p>
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
                    Retirement Planning Guidelines
                  </h3>
                  <div className="prose prose-sm text-gray-600">
                    <p>
                      This calculator uses the 4% withdrawal rule and standard retirement planning assumptions 
                      to project your retirement readiness.
                    </p>
                    <ul className="mt-3 space-y-1">
                      <li>• <strong>4% Rule:</strong> Withdraw 4% of your savings annually in retirement</li>
                      <li>• <strong>Employer Match:</strong> Always contribute enough to get the full company match</li>
                      <li>• <strong>Age Milestones:</strong> Aim for 1x salary saved by 30, 3x by 40, 10x by 67</li>
                      <li>• <strong>Inflation Impact:</strong> Your money's purchasing power decreases over time</li>
                      <li>• <strong>Diversification:</strong> Spread investments across different asset classes</li>
                    </ul>
                    <p className="mt-3">
                      Start early, contribute consistently, and increase contributions with salary raises for best results.
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

export default RetirementCalculator