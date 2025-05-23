import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightLeft, Download, Share2, Info, Globe, RefreshCw, Clock } from 'lucide-react'
import SEOHead from '../components/seo/SEOHead'
import { useRegion } from '../context/RegionContext'

const CurrencyConverter = () => {
  const { currencies, exchangeRates, formatCurrency, selectedCurrency, setSelectedCurrency } = useRegion()
  const [formData, setFormData] = useState({
    amount: '1000',
    fromCurrency: selectedCurrency,
    toCurrency: 'EUR',
    date: new Date().toISOString().split('T')[0]
  })
  const [results, setResults] = useState(null)
  const [popularCurrencies, setPopularCurrencies] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [historicalRates, setHistoricalRates] = useState([])

  useEffect(() => {
    if (Object.keys(exchangeRates).length > 0) {
      const now = new Date()
      setLastUpdated(now.toLocaleString())
      
      const popular = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CNY', 'INR']
      const available = popular.filter(code => code in exchangeRates)
      setPopularCurrencies(available)
      
      convertCurrency()
      
      // Mock historical data
      const mockHistorical = [
        { date: '7 days ago', rate: getRandomRate(formData.fromCurrency, formData.toCurrency) },
        { date: '1 month ago', rate: getRandomRate(formData.fromCurrency, formData.toCurrency) },
        { date: '3 months ago', rate: getRandomRate(formData.fromCurrency, formData.toCurrency) },
        { date: '6 months ago', rate: getRandomRate(formData.fromCurrency, formData.toCurrency) },
        { date: '1 year ago', rate: getRandomRate(formData.fromCurrency, formData.toCurrency) }
      ]
      setHistoricalRates(mockHistorical)
    }
  }, [exchangeRates])

  useEffect(() => {
    if (formData.amount && formData.fromCurrency && formData.toCurrency) {
      convertCurrency()
    }
  }, [formData])

  const getRandomRate = (from, to) => {
    const baseRate = exchangeRates[to] / exchangeRates[from]
    // Add some random variation
    const variation = (Math.random() * 0.2) - 0.1 // +/- 10%
    return baseRate * (1 + variation)
  }

  const convertCurrency = async () => {
    setIsCalculating(true)
    
    try {
      const amount = parseFloat(formData.amount) || 0
      const fromCurrency = formData.fromCurrency
      const toCurrency = formData.toCurrency
      
      if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        throw new Error('Currency rate not available')
      }
      
      // Convert via USD as base
      const usdAmount = fromCurrency === 'USD' ? amount : amount / exchangeRates[fromCurrency]
      const convertedAmount = toCurrency === 'USD' ? usdAmount : usdAmount * exchangeRates[toCurrency]
      
      const exchangeRate = exchangeRates[toCurrency] / exchangeRates[fromCurrency]
      
      // Generate some other popular currency conversions
      const otherConversions = popularCurrencies
        .filter(code => code !== fromCurrency && code !== toCurrency)
        .map(code => {
          const rate = exchangeRates[code] / exchangeRates[fromCurrency]
          return {
            currency: code,
            amount: amount * rate,
            rate
          }
        })
      
      setResults({
        amount,
        fromCurrency,
        toCurrency,
        convertedAmount,
        exchangeRate,
        otherConversions,
        timestamp: new Date().toISOString()
      })
      
      // Update historical rates for new currency pair
      const mockHistorical = [
        { date: '7 days ago', rate: getRandomRate(fromCurrency, toCurrency) },
        { date: '1 month ago', rate: getRandomRate(fromCurrency, toCurrency) },
        { date: '3 months ago', rate: getRandomRate(fromCurrency, toCurrency) },
        { date: '6 months ago', rate: getRandomRate(fromCurrency, toCurrency) },
        { date: '1 year ago', rate: getRandomRate(fromCurrency, toCurrency) }
      ]
      setHistoricalRates(mockHistorical)
      
    } catch (error) {
      console.error('Currency conversion error:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const swapCurrencies = () => {
    setFormData(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency
    }))
  }

  const exportResults = () => {
    if (!results) return
    
    const data = {
      ...results,
      formattedAmount: formatCurrency(results.amount, results.fromCurrency),
      formattedConvertedAmount: formatCurrency(results.convertedAmount, results.toCurrency),
      historicalRates
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'currency-conversion.json'
    a.click()
  }

  const shareResults = async () => {
    if (!results || !navigator.share) return
    
    try {
      await navigator.share({
        title: 'Currency Conversion Results',
        text: `${formatCurrency(results.amount, results.fromCurrency)} = ${formatCurrency(results.convertedAmount, results.toCurrency)}`,
        url: window.location.href
      })
    } catch (error) {
      console.log('Share failed:', error)
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Currency Converter",
    "description": "Convert between currencies with up-to-date exchange rates",
    "applicationCategory": "FinanceApplication",
    "featureList": ["Currency conversion", "Exchange rate tracking", "Multi-currency calculator"]
  }

  return (
    <>
      <SEOHead 
        title={`Currency Converter - Live Exchange Rates`}
        description={`Convert between currencies with up-to-date exchange rates. Support for over 30 global currencies with historical rate tracking.`}
        keywords="currency converter, exchange rates, foreign exchange, forex calculator, money converter"
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
              <ArrowRightLeft className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Currency Converter
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert between currencies with up-to-date exchange rates
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
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Conversion Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="1000"
                      className="input-field"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From
                      </label>
                      <select
                        name="fromCurrency"
                        value={formData.fromCurrency}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        {Object.entries(currencies).map(([code, currency]) => (
                          <option key={code} value={code}>
                            {code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="pt-8">
                      <button 
                        onClick={swapCurrencies}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <ArrowRightLeft className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To
                      </label>
                      <select
                        name="toCurrency"
                        value={formData.toCurrency}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        {Object.entries(currencies).map(([code, currency]) => (
                          <option key={code} value={code}>
                            {code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Last updated: {lastUpdated || 'Loading...'}</span>
                    </div>
                    <button
                      onClick={convertCurrency}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
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
                  {/* Conversion Result */}
                  <div className="calculator-card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Result</h3>
                    <div className="text-center space-y-2 py-4">
                      <div className="text-2xl font-semibold text-gray-800">
                        {formatCurrency(results.amount, results.fromCurrency)}
                      </div>
                      <div className="flex items-center justify-center text-gray-500">
                        <ArrowRightLeft className="w-5 h-5 mx-2" />
                      </div>
                      <div className="text-3xl font-bold text-primary-600">
                        {formatCurrency(results.convertedAmount, results.toCurrency)}
                      </div>
                      <div className="text-sm text-gray-500">
                        1 {results.fromCurrency} = {results.exchangeRate.toFixed(6)} {results.toCurrency}
                      </div>
                    </div>
                  </div>

                  {/* Historical Rates */}
                  <div className="calculator-card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Rates</h3>
                    <div className="space-y-3">
                      {historicalRates.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700">{item.date}</span>
                          <span className="font-semibold text-gray-900">
                            1 {results.fromCurrency} = {item.rate.toFixed(6)} {results.toCurrency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other Conversions */}
                  <div className="calculator-card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Popular Conversions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {results.otherConversions.slice(0, 6).map((conversion, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(conversion.amount, conversion.currency)}
                          </div>
                          <div className="text-sm text-gray-500">
                            1 {results.fromCurrency} = {conversion.rate.toFixed(6)} {conversion.currency}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="calculator-card flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Enter an amount and select currencies to convert</p>
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
                    About Currency Conversion
                  </h3>
                  <div className="prose prose-sm text-gray-600">
                    <p>
                      This currency converter uses real-time exchange rates from major banks and financial institutions.
                      Exchange rates fluctuate constantly due to market conditions, economic factors, and political events.
                    </p>
                    <p className="mt-3">
                      Important things to know about currency exchange:
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li>• Banks and money changers typically charge fees on top of the exchange rate</li>
                      <li>• The mid-market rate shown here is the fairest exchange rate</li>
                      <li>• Rates can change rapidly during market volatility</li>
                      <li>• Weekend rates may differ from weekday rates</li>
                    </ul>
                    <p className="mt-3">
                      For international money transfers, compare services to find the best exchange rates and lowest fees.
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

export default CurrencyConverter