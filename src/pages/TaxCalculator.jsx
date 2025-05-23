import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Receipt, Download, Share2, Info } from 'lucide-react'
import SEOHead from '../components/seo/SEOHead'
import { useRegion } from '../context/RegionContext'
import { calculateTax, getEffectiveTaxRate, getMarginalTaxRate } from '../utils/taxCalculations'
import TaxBreakdown from '../components/calculators/TaxBreakdown'
import TaxChart from '../components/calculators/TaxChart'

const TaxCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion()
  const [formData, setFormData] = useState({
    income: '',
    filingStatus: 'single',
    deductions: '',
    dependents: '0',
    additionalIncome: '0',
    retirement401k: '0',
    healthInsurance: '0'
  })
  const [results, setResults] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    if (formData.income && !isNaN(parseFloat(formData.income))) {
      calculateTaxes()
    }
  }, [formData, selectedCountry])

  const calculateTaxes = async () => {
    setIsCalculating(true)
    
    try {
      const income = parseFloat(formData.income) || 0
      const additionalIncome = parseFloat(formData.additionalIncome) || 0
      const deductions = parseFloat(formData.deductions) || 0
      const retirement401k = parseFloat(formData.retirement401k) || 0
      const healthInsurance = parseFloat(formData.healthInsurance) || 0
      const dependents = parseInt(formData.dependents) || 0

      const totalIncome = income + additionalIncome
      const preeTaxDeductions = retirement401k + healthInsurance
      const taxableIncome = Math.max(0, totalIncome - preeTaxDeductions)
      
      const taxInfo = calculateTax(taxableIncome, selectedCountry)
      const effectiveRate = getEffectiveTaxRate(taxableIncome, selectedCountry)
      const marginalRate = getMarginalTaxRate(taxableIncome, selectedCountry)
      
      const netIncome = totalIncome - taxInfo.totalTax - deductions - preeTaxDeductions

      const calculations = {
        income: {
          gross: totalIncome,
          taxable: taxableIncome,
          net: netIncome
        },
        taxes: {
          ...taxInfo,
          effectiveRate,
          marginalRate
        },
        deductions: {
          preTax: preeTaxDeductions,
          postTax: deductions,
          total: preeTaxDeductions + deductions
        },
        monthly: {
          grossIncome: totalIncome / 12,
          netIncome: netIncome / 12,
          taxes: taxInfo.totalTax / 12
        },
        breakdown: {
          federalTax: taxInfo.federalTax || 0,
          stateTax: taxInfo.stateTax || 0,
          socialSecurity: taxInfo.socialSecurity || 0,
          medicare: taxInfo.medicare || 0,
          otherTaxes: taxInfo.other || 0
        }
      }

      setResults(calculations)
    } catch (error) {
      console.error('Tax calculation error:', error)
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
    a.download = 'tax-calculation.json'
    a.click()
  }

  const shareResults = async () => {
    if (!results || !navigator.share) return
    
    try {
      await navigator.share({
        title: 'Tax Calculation Results',
        text: `Gross Income: ${formatCurrency(results.income.gross)}\nNet Income: ${formatCurrency(results.income.net)}\nTotal Taxes: ${formatCurrency(results.taxes.totalTax)}`,
        url: window.location.href
      })
    } catch (error) {
      console.log('Share failed:', error)
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Tax Calculator",
    "description": "Calculate income taxes and deductions",
    "applicationCategory": "FinanceApplication",
    "featureList": ["Income tax calculation", "Deduction calculation", "Tax planning"]
  }

  return (
    <>
      <SEOHead 
        title={`Tax Calculator for ${countries[selectedCountry]?.name || 'Global'}`}
        description={`Calculate your income taxes and deductions in ${countries[selectedCountry]?.name || 'any country'}. Estimate federal, state, and local taxes.`}
        keywords="tax calculator, income tax, tax deductions, tax planning, tax estimation"
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
              <Receipt className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Tax Calculator
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Calculate your income taxes and deductions for {countries[selectedCountry]?.name || 'your region'}
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
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Tax Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Income
                    </label>
                    <input
                      type="number"
                      name="income"
                      value={formData.income}
                      onChange={handleInputChange}
                      placeholder="Enter annual income"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filing Status
                    </label>
                    <select
                      name="filingStatus"
                      value={formData.filingStatus}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="single">Single</option>
                      <option value="married">Married Filing Jointly</option>
                      <option value="marriedSeparate">Married Filing Separately</option>
                      <option value="headOfHousehold">Head of Household</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Dependents
                    </label>
                    <input
                      type="number"
                      name="dependents"
                      value={formData.dependents}
                      onChange={handleInputChange}
                      className="input-field"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Income
                    </label>
                    <input
                      type="number"
                      name="additionalIncome"
                      value={formData.additionalIncome}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      401(k) Contribution
                    </label>
                    <input
                      type="number"
                      name="retirement401k"
                      value={formData.retirement401k}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Health Insurance Premiums
                    </label>
                    <input
                      type="number"
                      name="healthInsurance"
                      value={formData.healthInsurance}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Other Deductions
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
                  <TaxBreakdown results={results} />
                  <TaxChart results={results} />
                </div>
              ) : (
                <div className="calculator-card flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Enter your income information to calculate taxes</p>
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
                    Understanding Tax Calculations
                  </h3>
                  <div className="prose prose-sm text-gray-600">
                    <p>
                      This tax calculator provides estimates based on current tax laws for {countries[selectedCountry]?.name || 'your region'}. 
                      The calculations include federal, state/provincial, and payroll taxes.
                    </p>
                    <ul className="mt-3 space-y-1">
                      <li>• <strong>Effective Tax Rate:</strong> Total taxes divided by total income</li>
                      <li>• <strong>Marginal Tax Rate:</strong> Tax rate on your last dollar of income</li>
                      <li>• <strong>Pre-tax Deductions:</strong> Reduce your taxable income (401k, health insurance)</li>
                      <li>• <strong>Post-tax Deductions:</strong> Taken from net income</li>
                    </ul>
                    <p className="mt-3">
                      Results are estimates for planning purposes. Consult a tax professional for accurate filing.
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

export default TaxCalculator