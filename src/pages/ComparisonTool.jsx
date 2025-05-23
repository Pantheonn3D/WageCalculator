import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Scale, Download, Share2, Info, Plus, Trash2, Check, X } from 'lucide-react'
import SEOHead from '../components/seo/SEOHead'
import { useRegion } from '../context/RegionContext'
import { calculateTax } from '../utils/taxCalculations'
import ComparisonChart from '../components/calculators/ComparisonChart'

const ComparisonTool = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion()
  const [offers, setOffers] = useState([
    { 
      id: 1, 
      name: 'Current Job', 
      salary: 75000, 
      bonus: 5000, 
      retirement: 3, 
      insurance: 300, 
      vacation: 15, 
      commute: 30, 
      remote: 1
    },
    { 
      id: 2, 
      name: 'New Offer', 
      salary: 85000, 
      bonus: 8000, 
      retirement: 4, 
      insurance: 250, 
      vacation: 20, 
      commute: 45, 
      remote: 3
    }
  ])
  const [results, setResults] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [nextId, setNextId] = useState(3)

  useEffect(() => {
    calculateComparison()
  }, [offers, selectedCountry])

  const calculateComparison = async () => {
    setIsCalculating(true)
    
    try {
      const calculatedOffers = offers.map(offer => {
        const annualSalary = parseFloat(offer.salary) || 0
        const annualBonus = parseFloat(offer.bonus) || 0
        const retirementMatch = parseFloat(offer.retirement) / 100 || 0
        const monthlyInsurance = parseFloat(offer.insurance) || 0
        const vacationDays = parseFloat(offer.vacation) || 0
        const commuteMinutes = parseFloat(offer.commute) || 0
        const remoteDays = parseFloat(offer.remote) || 0
        
        // Calculate total compensation
        const retirementBenefit = annualSalary * retirementMatch
        const totalCompensation = annualSalary + annualBonus + retirementBenefit
        
        // Calculate taxes
        const taxInfo = calculateTax(annualSalary + annualBonus, selectedCountry)
        const netIncome = annualSalary + annualBonus - taxInfo.totalTax
        
        // Calculate quality of life metrics
        const workDaysPerYear = 260 - vacationDays // ~260 working days in a year
        const commuteDaysPerYear = workDaysPerYear * (5 - remoteDays) / 5
        const commuteHoursPerYear = (commuteMinutes * 2 * commuteDaysPerYear) / 60
        
        const hourlyRate = annualSalary / (workDaysPerYear * 8)
        const hourlyRateWithCommute = annualSalary / ((workDaysPerYear * 8) + commuteHoursPerYear)
        const hourlyCompensation = totalCompensation / (workDaysPerYear * 8)
        
        // Work-life balance score (0-100)
        const workLifeScore = Math.min(100, Math.max(0, 
          50 + 
          (vacationDays - 15) * 2 + // More vacation is better
          (3 - commuteMinutes / 20) * 5 + // Shorter commute is better
          remoteDays * 5 // More remote days is better
        ))
        
        // Benefits score (0-100)
        const benefitsScore = Math.min(100, Math.max(0,
          50 + 
          (retirementMatch - 3) * 10 + // Better retirement match
          (300 - monthlyInsurance) / 10 // Lower insurance costs
        ))
        
        return {
          ...offer,
          totalCompensation,
          netIncome,
          retirementBenefit,
          annualInsurance: monthlyInsurance * 12,
          commuteHoursPerYear,
          hourlyRate,
          hourlyRateWithCommute,
          hourlyCompensation,
          workLifeScore,
          benefitsScore,
          overallScore: (
            (netIncome / 1000) * 0.5 + // Income has 50% weight
            workLifeScore * 0.3 + // Work-life has 30% weight
            benefitsScore * 0.2 // Benefits have 20% weight
          )
        }
      })
      
      // Find the best offer based on overall score
      const bestOffer = [...calculatedOffers].sort((a, b) => b.overallScore - a.overallScore)[0]
      
      setResults({
        offers: calculatedOffers,
        bestOfferId: bestOffer.id,
        comparisonDate: new Date().toISOString()
      })
    } catch (error) {
      console.error('Comparison calculation error:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleOfferChange = (id, field, value) => {
    setOffers(prev => prev.map(offer => 
      offer.id === id ? { ...offer, [field]: value } : offer
    ))
  }

  const addNewOffer = () => {
    setOffers(prev => [
      ...prev,
      { 
        id: nextId, 
        name: `Option ${nextId}`, 
        salary: 80000, 
        bonus: 5000, 
        retirement: 3, 
        insurance: 300, 
        vacation: 15, 
        commute: 30, 
        remote: 2
      }
    ])
    setNextId(prev => prev + 1)
  }

  const deleteOffer = (id) => {
    if (offers.length > 2) {
      setOffers(prev => prev.filter(offer => offer.id !== id))
    }
  }

  const exportResults = () => {
    if (!results) return
    
    const data = {
      country: countries[selectedCountry].name,
      currency: countries[selectedCountry].currency,
      offers: results.offers,
      bestOfferId: results.bestOfferId,
      comparisonDate: results.comparisonDate
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'job-offer-comparison.json'
    a.click()
  }

  const shareResults = async () => {
    if (!results || !navigator.share) return
    
    try {
      const bestOffer = results.offers.find(o => o.id === results.bestOfferId)
      await navigator.share({
        title: 'Job Offer Comparison Results',
        text: `Best offer: ${bestOffer.name} with a total compensation of ${formatCurrency(bestOffer.totalCompensation)}`,
        url: window.location.href
      })
    } catch (error) {
      console.log('Share failed:', error)
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Job Offer Comparison Tool",
    "description": "Compare multiple job offers with comprehensive financial analysis",
    "applicationCategory": "FinanceApplication",
    "featureList": ["Salary comparison", "Benefits analysis", "Work-life balance assessment"]
  }

  return (
    <>
      <SEOHead 
        title={`Job Offer Comparison Tool - Compare Salaries and Benefits`}
        description={`Compare multiple job offers and find the best option. Analyze salary, benefits, retirement, and work-life balance to make informed career decisions.`}
        keywords="job offer comparison, salary comparison, benefits comparison, career decision tool, compensation analysis"
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
              <Scale className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Job Offer Comparison
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compare multiple job offers and find the best option for your career
            </p>
          </motion.div>

          {/* Offer Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="calculator-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Job Offers</h2>
                <button 
                  onClick={addNewOffer}
                  className="btn-secondary flex items-center space-x-2 py-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Offer</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Job Name</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Annual Salary</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Bonus</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">401k Match (%)</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Insurance (Monthly)</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Vacation Days</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Commute (min)</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Remote Days/Week</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map((offer) => (
                      <tr key={offer.id} className="border-t border-gray-100">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={offer.name}
                            onChange={(e) => handleOfferChange(offer.id, 'name', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={offer.salary}
                            onChange={(e) => handleOfferChange(offer.id, 'salary', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={offer.bonus}
                            onChange={(e) => handleOfferChange(offer.id, 'bonus', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={offer.retirement}
                            onChange={(e) => handleOfferChange(offer.id, 'retirement', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            step="0.5"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={offer.insurance}
                            onChange={(e) => handleOfferChange(offer.id, 'insurance', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={offer.vacation}
                            onChange={(e) => handleOfferChange(offer.id, 'vacation', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={offer.commute}
                            onChange={(e) => handleOfferChange(offer.id, 'commute', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={offer.remote}
                            onChange={(e) => handleOfferChange(offer.id, 'remote', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                          >
                            <option value="0">0 days</option>
                            <option value="1">1 day</option>
                            <option value="2">2 days</option>
                            <option value="3">3 days</option>
                            <option value="4">4 days</option>
                            <option value="5">5 days (fully remote)</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <button 
                            onClick={() => deleteOffer(offer.id)}
                            disabled={offers.length <= 2}
                            className={`p-2 rounded ${
                              offers.length <= 2 
                                ? 'bg-gray-100 text-gray-400' 
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {results && (
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    onClick={exportResults}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  {navigator.share && (
                    <button
                      onClick={shareResults}
                      className="btn-secondary flex items-center space-x-2"
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
          {isCalculating ? (
            <div className="calculator-card flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : results ? (
            <div className="space-y-6">
              {/* Best Offer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="calculator-card bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-primary-500"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <Check className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Best Offer: {results.offers.find(o => o.id === results.bestOfferId)?.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Based on compensation, benefits, and work-life balance analysis
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">Total Compensation</div>
                        <div className="text-xl font-bold text-gray-900">
                          {formatCurrency(results.offers.find(o => o.id === results.bestOfferId)?.totalCompensation)}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">Net Income</div>
                        <div className="text-xl font-bold text-gray-900">
                          {formatCurrency(results.offers.find(o => o.id === results.bestOfferId)?.netIncome)}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">Overall Score</div>
                        <div className="text-xl font-bold text-gray-900">
                          {results.offers.find(o => o.id === results.bestOfferId)?.overallScore.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Comparison Charts */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <ComparisonChart results={results} />
              </motion.div>

              {/* Detailed Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="calculator-card"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Job Name</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Total Compensation</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Net Income</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Hourly Rate</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Hourly (with Commute)</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Work-Life Score</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Benefits Score</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Overall Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.offers.map((offer) => (
                        <tr key={offer.id} className={`border-t border-gray-100 ${offer.id === results.bestOfferId ? 'bg-green-50' : ''}`}>
                          <td className="py-2 px-3 font-medium">
                            {offer.name}
                            {offer.id === results.bestOfferId && (
                              <span className="ml-2 text-green-600">
                                <Check className="w-4 h-4 inline" />
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3">{formatCurrency(offer.totalCompensation)}</td>
                          <td className="py-2 px-3">{formatCurrency(offer.netIncome)}</td>
                          <td className="py-2 px-3">{formatCurrency(offer.hourlyRate)}</td>
                          <td className="py-2 px-3">{formatCurrency(offer.hourlyRateWithCommute)}</td>
                          <td className="py-2 px-3">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${offer.workLifeScore}%` }}></div>
                              </div>
                              <span>{offer.workLifeScore.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${offer.benefitsScore}%` }}></div>
                              </div>
                              <span>{offer.benefitsScore.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 font-semibold">{offer.overallScore.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="calculator-card flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Scale className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Enter job offer details above to compare options</p>
              </div>
            </div>
          )}

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-12"
          >
            <div className="calculator-card">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-primary-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How to Compare Job Offers
                  </h3>
                  <div className="prose prose-sm text-gray-600">
                    <p>
                      When comparing job offers, it's important to look beyond just the base salary. 
                      This tool helps you evaluate the total package including benefits, work-life balance, and long-term value.
                    </p>
                    <p className="mt-3">
                      Key factors to consider:
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li>• <strong>Total Compensation:</strong> Salary + bonus + retirement benefits</li>
                      <li>• <strong>Work-Life Balance:</strong> Vacation time, commute, remote work flexibility</li>
                      <li>• <strong>Benefits:</strong> Health insurance costs, retirement matching, other perks</li>
                      <li>• <strong>Hourly Rate with Commute:</strong> Your effective pay when including commute time</li>
                      <li>• <strong>Career Growth:</strong> Opportunities for advancement (not included in calculation)</li>
                    </ul>
                    <p className="mt-3">
                      The overall score is weighted with compensation (50%), work-life balance (30%), and benefits (20%).
                      Adjust the inputs based on your personal preferences and priorities.
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

export default ComparisonTool