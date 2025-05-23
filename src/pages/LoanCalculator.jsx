import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Download, Share2, Info } from 'lucide-react'
import SEOHead from '../components/seo/SEOHead'
import { useRegion } from '../context/RegionContext'
import LoanBreakdown from '../components/calculators/LoanBreakdown'
import LoanChart from '../components/calculators/LoanChart'

const LoanCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion()
  const [formData, setFormData] = useState({
    loanAmount: '250000',
    interestRate: '4.5',
    loanTerm: '30',
    downPayment: '50000',
    extraPayment: '0',
    propertyTax: '3000',
    insurance: '1200',
    pmi: '0',
    loanType: 'mortgage'
  })
  const [results, setResults] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    if (formData.loanAmount && formData.interestRate && formData.loanTerm) {
      calculateLoan()
    }
  }, [formData])

  const calculateLoan = async () => {
    setIsCalculating(true)
    
    try {
      const loanAmount = parseFloat(formData.loanAmount) || 0
      const downPayment = parseFloat(formData.downPayment) || 0
      const principal = loanAmount - downPayment
      const annualRate = parseFloat(formData.interestRate) / 100 || 0
      const monthlyRate = annualRate / 12
      const loanTermYears = parseFloat(formData.loanTerm) || 30
      const totalPayments = loanTermYears * 12
      const extraPayment = parseFloat(formData.extraPayment) || 0
      const propertyTax = parseFloat(formData.propertyTax) || 0
      const insurance = parseFloat(formData.insurance) || 0
      const pmi = parseFloat(formData.pmi) || 0

      // Calculate monthly payment using formula: M = P[r(1+r)^n]/[(1+r)^n-1]
      let monthlyPayment = 0
      if (monthlyRate > 0) {
        monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                        (Math.pow(1 + monthlyRate, totalPayments) - 1)
      } else {
        monthlyPayment = principal / totalPayments
      }

      const monthlyTaxInsurance = (propertyTax + insurance) / 12
      const totalMonthlyPayment = monthlyPayment + monthlyTaxInsurance + pmi + extraPayment

      // Calculate amortization schedule
      const schedule = []
      let remainingBalance = principal
      let totalInterestPaid = 0
      let totalPrincipalPaid = 0
      let paymentNumber = 0

      while (remainingBalance > 0.01 && paymentNumber < totalPayments) {
        paymentNumber++
        const interestPayment = remainingBalance * monthlyRate
        let principalPayment = monthlyPayment - interestPayment + extraPayment
        
        if (principalPayment > remainingBalance) {
          principalPayment = remainingBalance
        }

        remainingBalance -= principalPayment
        totalInterestPaid += interestPayment
        totalPrincipalPaid += principalPayment

        schedule.push({
          payment: paymentNumber,
          principalPayment,
          interestPayment,
          totalPayment: principalPayment + interestPayment,
          remainingBalance,
          cumulativeInterest: totalInterestPaid,
          cumulativePrincipal: totalPrincipalPaid
        })
      }

      const totalAmount = totalPrincipalPaid + totalInterestPaid
      const interestSaved = extraPayment > 0 ? 
        (principal * Math.pow(1 + monthlyRate, totalPayments) - principal) - totalInterestPaid : 0
      const timeSaved = totalPayments - paymentNumber

      // Yearly summary for charts
      const yearlyData = []
      for (let year = 1; year <= Math.ceil(paymentNumber / 12); year++) {
        const yearStart = (year - 1) * 12
        const yearEnd = Math.min(year * 12, paymentNumber)
        const yearPayments = schedule.slice(yearStart, yearEnd)
        
        if (yearPayments.length > 0) {
          const yearInterest = yearPayments.reduce((sum, p) => sum + p.interestPayment, 0)
          const yearPrincipal = yearPayments.reduce((sum, p) => sum + p.principalPayment, 0)
          const endBalance = yearPayments[yearPayments.length - 1].remainingBalance
          
          yearlyData.push({
            year,
            interest: yearInterest,
            principal: yearPrincipal,
            balance: endBalance,
            cumulativeInterest: yearPayments[yearPayments.length - 1].cumulativeInterest
          })
        }
      }

      const calculations = {
        loan: {
          amount: loanAmount,
          principal,
          downPayment,
          monthlyPayment,
          totalMonthlyPayment,
          totalAmount,
          totalInterest: totalInterestPaid,
          payoffTime: paymentNumber,
          originalTerm: totalPayments
        },
        breakdown: {
          principalAndInterest: monthlyPayment,
          propertyTax: monthlyTaxInsurance,
          insurance: insurance / 12,
          pmi,
          extraPayment,
          total: totalMonthlyPayment
        },
        savings: {
          interestSaved,
          timeSaved: timeSaved / 12,
          extraPaymentTotal: extraPayment * paymentNumber
        },
        schedule: schedule.slice(0, 12), // First year for display
        yearlyData,
        fullSchedule: schedule,
        ratios: {
          loanToValue: ((principal / loanAmount) * 100),
          debtToIncome: null, // Would need income input
          monthlyPaymentRatio: (monthlyPayment / (loanAmount / 360)) * 100
        }
      }

      setResults(calculations)
    } catch (error) {
      console.error('Loan calculation error:', error)
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
    a.download = 'loan-calculation.json'
    a.click()
  }

  const shareResults = async () => {
    if (!results || !navigator.share) return
    
    try {
      await navigator.share({
        title: 'Loan Calculation Results',
        text: `Monthly Payment: ${formatCurrency(results.loan.monthlyPayment)}\nTotal Interest: ${formatCurrency(results.loan.totalInterest)}`,
        url: window.location.href
      })
    } catch (error) {
      console.log('Share failed:', error)
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Loan Calculator",
    "description": "Calculate loan payments and amortization schedules",
    "applicationCategory": "FinanceApplication",
    "featureList": ["Loan payment calculation", "Amortization schedule", "Interest calculation"]
  }

  return (
    <>
      <SEOHead 
        title={`Loan Calculator - Mortgage & Personal Loans`}
        description={`Calculate loan payments, interest, and amortization schedules. Compare mortgage rates and plan your loan payments effectively.`}
        keywords="loan calculator, mortgage calculator, loan payment, amortization, interest calculator"
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
              <CreditCard className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Loan Calculator
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Calculate loan payments, interest, and amortization schedules
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
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Loan Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Type
                    </label>
                    <select
                      name="loanType"
                      value={formData.loanType}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="mortgage">Mortgage</option>
                      <option value="auto">Auto Loan</option>
                      <option value="personal">Personal Loan</option>
                      <option value="student">Student Loan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount
                    </label>
                    <input
                      type="number"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleInputChange}
                      placeholder="250000"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Down Payment
                    </label>
                    <input
                      type="number"
                      name="downPayment"
                      value={formData.downPayment}
                      onChange={handleInputChange}
                      placeholder="50000"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      name="interestRate"
                      value={formData.interestRate}
                      onChange={handleInputChange}
                      placeholder="4.5"
                      className="input-field"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Term (Years)
                    </label>
                    <input
                      type="number"
                      name="loanTerm"
                      value={formData.loanTerm}
                      onChange={handleInputChange}
                      placeholder="30"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extra Monthly Payment
                    </label>
                    <input
                      type="number"
                      name="extraPayment"
                      value={formData.extraPayment}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="input-field"
                    />
                  </div>

                  {formData.loanType === 'mortgage' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Annual Property Tax
                        </label>
                        <input
                          type="number"
                          name="propertyTax"
                          value={formData.propertyTax}
                          onChange={handleInputChange}
                          placeholder="3000"
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Annual Insurance
                        </label>
                        <input
                          type="number"
                          name="insurance"
                          value={formData.insurance}
                          onChange={handleInputChange}
                          placeholder="1200"
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly PMI
                        </label>
                        <input
                          type="number"
                          name="pmi"
                          value={formData.pmi}
                          onChange={handleInputChange}
                          placeholder="0"
                          className="input-field"
                        />
                      </div>
                    </>
                  )}
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
                  <LoanBreakdown results={results} />
                  <LoanChart results={results} />
                </div>
              ) : (
                <div className="calculator-card flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Enter your loan information to calculate payments</p>
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
                    Understanding Loan Calculations
                  </h3>
                  <div className="prose prose-sm text-gray-600">
                    <p>
                      This loan calculator uses standard amortization formulas to calculate your monthly payments and 
                      show how much of each payment goes toward principal and interest.
                    </p>
                    <ul className="mt-3 space-y-1">
                      <li>• <strong>Principal:</strong> The amount you borrow</li>
                      <li>• <strong>Interest Rate:</strong> Annual percentage rate (APR)</li>
                      <li>• <strong>Term:</strong> Length of the loan in years</li>
                      <li>• <strong>Amortization:</strong> How the loan balance decreases over time</li>
                      <li>• <strong>Extra Payments:</strong> Additional payments toward principal</li>
                    </ul>
                    <p className="mt-3">
                      Making extra payments can significantly reduce the total interest paid and shorten the loan term.
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

export default LoanCalculator