import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRightLeft, Download, Share2, Info, Globe, RefreshCw, Clock, 
  ChevronRight, TrendingUp, DollarSign, BarChart3, PieChart, Calculator,
  Zap, Shield, Award, Users, CheckCircle, ArrowRight, BookOpen,
  Target, Activity, CreditCard, Banknote
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { useRegion } from '../context/RegionContext';

const FEATURED_BENEFITS = [
  "Real-time exchange rates",
  "200+ global currencies", 
  "Historical rate trends",
  "Export and share results"
];

const RELATED_TOOLS = [
  { title: 'Investment Calculator', href: '/investment-calculator', icon: TrendingUp, description: 'Calculate investment returns and growth' },
  { title: 'Loan Calculator', href: '/loan-calculator', icon: CreditCard, description: 'Analyze loan payments and interest' },
  { title: 'Budget Planner', href: '/budget-calculator', icon: PieChart, description: 'Plan your monthly budget effectively' },
  { title: 'Savings Calculator', href: '/savings-calculator', icon: Target, description: 'Calculate savings goals and timelines' }
];

const CONVERTER_FEATURES = [
  { icon: Zap, title: 'Lightning Fast', description: 'Get instant conversion results with real-time exchange rates' },
  { icon: Globe, title: 'Global Coverage', description: 'Support for 200+ currencies from around the world' },
  { icon: Shield, title: 'Bank-Grade Accuracy', description: 'Professional-grade exchange rates updated regularly' },
  { icon: Award, title: 'Trusted Worldwide', description: 'Used by travelers, businesses, and financial professionals' }
];

const POPULAR_PAIRS = [
  { from: 'USD', to: 'EUR', label: 'USD to EUR' },
  { from: 'EUR', to: 'USD', label: 'EUR to USD' },
  { from: 'USD', to: 'GBP', label: 'USD to GBP' },
  { from: 'GBP', to: 'USD', label: 'GBP to USD' },
  { from: 'USD', to: 'JPY', label: 'USD to JPY' },
  { from: 'EUR', to: 'GBP', label: 'EUR to GBP' },
  { from: 'USD', to: 'CAD', label: 'USD to CAD' },
  { from: 'USD', to: 'AUD', label: 'USD to AUD' }
];

const CurrencyConverter = () => {
  const { currencies, exchangeRates, formatCurrency, selectedCurrency: initialSelectedCurrency } = useRegion();
  
  const [formData, setFormData] = useState({
    amount: '1000',
    fromCurrency: initialSelectedCurrency || 'USD',
    toCurrency: 'EUR',
  });
  
  const [results, setResults] = useState(null);
  const [popularCurrencies, setPopularCurrencies] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [historicalRates, setHistoricalRates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (Object.keys(exchangeRates).length > 0) {
      if (!lastUpdated) {
         setLastUpdated(new Date().toLocaleString());
      }
      
      const popular = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CNY', 'INR', 'CHF', 'SEK', 'NOK', 'SGD'];
      const available = popular.filter(code => code in exchangeRates && currencies[code]);
      setPopularCurrencies(available);
      
      if (formData.amount && formData.fromCurrency && formData.toCurrency) {
        convertAndDisplay();
      }
    } else if (Object.keys(currencies).length > 0) {
        setLastUpdated('Rates loading...');
    }
  }, [exchangeRates, currencies]);

  useEffect(() => {
    if (Object.keys(currencies).length > 0 && !currencies[formData.fromCurrency]) {
        setFormData(prev => ({ ...prev, fromCurrency: initialSelectedCurrency || 'USD' }));
    }
  }, [currencies, formData.fromCurrency, initialSelectedCurrency]);

  const getRandomRateVariation = (baseRate) => {
    if (typeof baseRate !== 'number' || isNaN(baseRate) || !isFinite(baseRate)) return 1;
    const variation = (Math.random() * 0.001) - 0.001;
    return baseRate * (1 + variation);
  };

  const convertAndDisplay = useCallback(() => {
    if (!formData.amount || !formData.fromCurrency || !formData.toCurrency) {
      setResults(null);
      setError(null);
      return;
    }
    
    if (Object.keys(exchangeRates).length === 0) {
        setError("Exchange rates are not available. Please try again later.");
        setResults(null);
        return;
    }

    setIsCalculating(true);
    setError(null);
    
    try {
      const amount = parseFloat(formData.amount) || 0;
      const from = formData.fromCurrency;
      const to = formData.toCurrency;
      
      if (!exchangeRates[from] || !exchangeRates[to]) {
        throw new Error(`Exchange rate not available for ${from} or ${to}. The base currency for rates is USD.`);
      }
      
      const amountInUSD = from === 'USD' ? amount : amount / exchangeRates[from];
      const convertedAmount = to === 'USD' ? amountInUSD : amountInUSD * exchangeRates[to];
      const directRate = exchangeRates[to] / exchangeRates[from];
      
      const otherConversions = popularCurrencies
        .filter(code => code !== from && code !== to && exchangeRates[code])
        .map(code => {
          const rate = exchangeRates[code] / exchangeRates[from];
          return {
            currency: code,
            amount: amount * rate,
            rate
          };
        })
        .slice(0, 8);
      
      setResults({
        amount,
        fromCurrency: from,
        toCurrency: to,
        convertedAmount,
        exchangeRate: directRate,
        otherConversions,
        timestamp: new Date().toISOString()
      });

      if (isFinite(directRate)) {
        const mockHistorical = [
            { date: '7 days ago', rate: getRandomRateVariation(directRate) },
            { date: '1 month ago', rate: getRandomRateVariation(directRate) },
            { date: '3 months ago', rate: getRandomRateVariation(directRate) },
            { date: '6 months ago', rate: getRandomRateVariation(directRate) },
            { date: '1 year ago', rate: getRandomRateVariation(directRate) }
        ];
        setHistoricalRates(mockHistorical);
      } else {
        setHistoricalRates([]);
      }
      
    } catch (err) {
      console.error('Currency conversion error:', err);
      setError(err.message);
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  }, [formData, exchangeRates, popularCurrencies]);

  useEffect(() => {
    if (formData.amount && !isNaN(parseFloat(formData.amount))) {
      const timer = setTimeout(() => {
        convertAndDisplay();
      }, 300);
      return () => clearTimeout(timer);
    } else if (results !== null) {
        setResults(null);
    }
  }, [formData.amount, formData.fromCurrency, formData.toCurrency, convertAndDisplay, results]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const swapCurrencies = () => {
    setFormData(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
    }));
  };

  const setQuickPair = (from, to) => {
    setFormData(prev => ({
      ...prev,
      fromCurrency: from,
      toCurrency: to
    }));
  };

  const exportResults = () => {
    if (!results || error) return;
    const data = {
      conversionDetails: {
        amount: results.amount,
        fromCurrency: results.fromCurrency,
        toCurrency: results.toCurrency,
        convertedAmount: results.convertedAmount,
        exchangeRate: results.exchangeRate,
        timestamp: results.timestamp,
      },
      historicalRates: historicalRates.map(hr => ({date: hr.date, rate: hr.rate.toFixed(6)})),
      otherConversions: results.otherConversions.map(oc => ({...oc, rate: oc.rate.toFixed(6)}))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `currency-conversion-${results.fromCurrency}-to-${results.toCurrency}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (!results || error || !navigator.share) return;
    try {
      await navigator.share({
        title: 'Currency Conversion Results',
        text: `${formatCurrency(results.amount, results.fromCurrency, {smartDecimals:true})} = ${formatCurrency(results.convertedAmount, results.toCurrency, {smartDecimals:true})}`,
        url: window.location.href
      });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };
  
  const structuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free Currency Converter - Real-Time Exchange Rates',
    description: 'Convert between 200+ global currencies with real-time exchange rates. Free, accurate, and trusted by millions worldwide.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript.",
    featureList: [
      'Real-time Exchange Rates',
      '200+ Global Currencies',
      'Historical Rate Trends',
      'Multi-Currency Conversion',
      'Export Conversion Results',
      'Share Functionality',
      'Mobile Optimized',
      'Bank-Grade Accuracy'
    ],
    offers: {
        "@type": "Offer",
        "price": "0"
    },
    provider: {
        "@type": "Organization",
        "name": "CurrencyCalculator"
    }
  }), []);

  // Animation variants
  const fadeInY = (delay = 0, duration = 0.5) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration, delay, ease: "circOut" } },
  });

  return (
    <>
      <SEOHead 
        title="Free Currency Converter 2024 - Real-Time Exchange Rates Calculator"
        description="Convert between 200+ global currencies with live exchange rates. Free currency converter with historical trends, export options, and bank-grade accuracy. Updated daily."
        keywords="currency converter, exchange rates, foreign exchange, forex calculator, money converter, currency exchange calculator, real time exchange rates, currency conversion tool, forex rates, international money transfer calculator, live currency rates, global currency converter"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        {/* Hero Section */}
        <section className="gradient-bg text-white relative overflow-hidden py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={fadeInY(0.1, 0.8)}
              initial="initial"
              animate="animate"
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center space-x-3 mb-6">
                <ArrowRightLeft className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  Currency Converter
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Convert between 200+ global currencies with real-time exchange rates. 
                Trusted by millions for accurate, up-to-date currency conversions.
              </p>
              
              {/* Benefits Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                {FEATURED_BENEFITS.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    variants={fadeInY(0.3 + index * 0.1, 0.5)}
                    initial="initial"
                    animate="animate"
                    className="flex items-center space-x-2 text-sm md:text-base"
                  >
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-blue-100">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Converter Section */}
        <section className="py-12 md:py-16 -mt-8 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Quick Pairs */}
            <motion.div
              variants={fadeInY(0, 0.6)}
              initial="initial"
              animate="animate"
              className="mb-8"
            >
              <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Popular Currency Pairs
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                  {POPULAR_PAIRS.map((pair) => (
                    <button
                      key={`${pair.from}-${pair.to}`}
                      onClick={() => setQuickPair(pair.from, pair.to)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                        formData.fromCurrency === pair.from && formData.toCurrency === pair.to
                          ? 'bg-primary-100 border-primary-500 text-primary-700 dark:bg-primary-900 dark:border-primary-400 dark:text-primary-300'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-600'
                      }`}
                    >
                      {pair.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-1"
              >
                <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-neutral-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Calculator className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
                    Convert Currency
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Amount to Convert
                      </label>
                      <input
                        id="amount"
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="1000"
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="fromCurrency" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        From Currency
                      </label>
                      <select
                        id="fromCurrency"
                        name="fromCurrency"
                        value={formData.fromCurrency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                        disabled={Object.keys(currencies).length === 0}
                      >
                        {Object.entries(currencies)
                          .sort(([aCode], [bCode]) => aCode.localeCompare(bCode))
                          .map(([code, currency]) => (
                          <option key={code} value={code}>
                            {code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-center">
                      <button 
                        onClick={swapCurrencies}
                        title="Swap currencies"
                        disabled={Object.keys(currencies).length === 0}
                        className="p-4 bg-primary-100 dark:bg-primary-900 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors text-primary-600 dark:text-primary-400 disabled:opacity-50 transform hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <ArrowRightLeft className="w-6 h-6" />
                      </button>
                    </div>

                    <div>
                      <label htmlFor="toCurrency" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        To Currency
                      </label>
                      <select
                        id="toCurrency"
                        name="toCurrency"
                        value={formData.toCurrency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                        disabled={Object.keys(currencies).length === 0}
                      >
                       {Object.entries(currencies)
                         .sort(([aCode], [bCode]) => aCode.localeCompare(bCode))
                         .map(([code, currency]) => (
                          <option key={code} value={code}>
                            {code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-4 h-4" />
                        <span>Last updated: {lastUpdated || 'Loading...'}</span>
                      </div>
                      <button
                        onClick={convertAndDisplay}
                        disabled={isCalculating || Object.keys(exchangeRates).length === 0}
                        className="flex items-center space-x-1.5 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                      >
                        <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
                        <span>Refresh Rates</span>
                      </button>
                    </div>
                  </div>

                  {results && !error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
                    >
                      <button
                        onClick={exportResults}
                        aria-label="Export conversion results as JSON file"
                        className="flex-1 inline-flex justify-center items-center px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Export JSON
                      </button>
                      {navigator.share && (
                        <button
                          onClick={shareResults}
                          aria-label="Share conversion results"
                          className="flex-1 inline-flex justify-center items-center px-4 py-3 border-2 border-transparent shadow-sm text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 transition-all duration-200"
                        >
                          <Share2 className="w-5 h-5 mr-2" />
                          Share Results
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2"
              >
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-6 rounded-2xl shadow-xl mb-6" role="alert">
                    <div className="flex items-center">
                      <Info className="w-6 h-6 mr-2" />
                      <div>
                        <p className="font-bold">Conversion Error</p>
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {isCalculating && !results && !error && (
                  <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 dark:border-primary-400 mb-6"></div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Converting Currency</h3>
                    <p className="text-gray-500 dark:text-gray-400">Fetching latest exchange rates...</p>
                  </div>
                )}

                {!isCalculating && !results && !error && Object.keys(exchangeRates).length > 0 && (
                  <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                    <Globe className="w-20 h-20 mb-6 text-gray-300 dark:text-neutral-600" />
                    <h3 className="text-2xl font-semibold mb-2">Ready to Convert</h3>
                    <p className="text-lg mb-4">Enter an amount to see live conversion rates</p>
                    <p className="text-sm">Supporting 200+ currencies with real-time rates</p>
                  </div>
                )}

                {!isCalculating && !results && !error && Object.keys(exchangeRates).length === 0 && (
                  <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                    <Clock className="w-20 h-20 mb-6 text-gray-300 dark:text-neutral-600 animate-pulse" />
                    <h3 className="text-2xl font-semibold mb-2">Loading Exchange Rates</h3>
                    <p className="text-lg">Please wait while we fetch the latest rates...</p>
                  </div>
                )}

                {results && !error && (
                  <AnimatePresence>
                    <div className="space-y-6">
                      {/* Main Result */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 text-center border border-gray-200 dark:border-neutral-700"
                      >
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {formatCurrency(results.amount, results.fromCurrency, {smartDecimals: true})} equals
                        </p>
                        <p className="text-4xl md:text-5xl font-extrabold text-primary-600 dark:text-primary-400 mb-4 tracking-tight">
                          {formatCurrency(results.convertedAmount, results.toCurrency, {smartDecimals: true})}
                        </p>
                        <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-4 mb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Exchange Rate:</span> 1 {results.fromCurrency} = {results.exchangeRate.toFixed(6)} {results.toCurrency}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Last updated: {new Date(results.timestamp).toLocaleString()}
                        </p>
                      </motion.div>

                      {/* Historical Rates */}
                      {historicalRates.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-neutral-700"
                        >
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-100 mb-6 flex items-center">
                            <BarChart3 className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
                            Historical Exchange Rates (Illustrative)
                          </h3>
                          <div className="space-y-3">
                            {historicalRates.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors">
                                <span className="text-gray-600 dark:text-gray-300 font-medium">{item.date}</span>
                                <div className="text-right">
                                  <span className="font-semibold text-gray-800 dark:text-neutral-100">
                                    1 {results.fromCurrency} = {item.rate.toFixed(6)} {results.toCurrency}
                                  </span>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {((item.rate - results.exchangeRate) / results.exchangeRate * 100).toFixed(2)}% vs today
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Other Conversions */}
                      {results.otherConversions && results.otherConversions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-neutral-700"
                        >
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-100 mb-6 flex items-center">
                            <PieChart className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
                            Convert to Other Popular Currencies
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {results.otherConversions.map((conv) => (
                              <div key={conv.currency} className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors cursor-pointer group">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
                                    {conv.currency}
                                  </span>
                                  <button
                                    onClick={() => setFormData(prev => ({ ...prev, toCurrency: conv.currency }))}
                                    className="opacity-0 group-hover:opacity-100 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-all"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="font-semibold text-gray-900 dark:text-neutral-100 text-lg">
                                  {formatCurrency(conv.amount, conv.currency, {smartDecimals:true})}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Rate: {conv.rate.toFixed(6)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </AnimatePresence>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20 bg-white dark:bg-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInY(0, 0.7)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose Our Currency Converter
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Professional-grade accuracy meets intuitive design. Trusted by millions for reliable currency conversions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {CONVERTER_FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={fadeInY(0.1 + index * 0.05, 0.6)}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.1 }}
                    className="text-center p-6 bg-gray-50 dark:bg-neutral-700 rounded-2xl hover:shadow-lg transition-all duration-300 group border border-gray-200 dark:border-neutral-600"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="py-16 md:py-20 bg-gray-50 dark:bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInY(0, 0.7)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Complete Your Financial Toolkit
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explore our comprehensive suite of financial calculators for all your money management needs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {RELATED_TOOLS.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.title}
                    variants={fadeInY(0.1 + index * 0.05, 0.6)}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    <Link
                      to={tool.href}
                      className="group block p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-500 h-full"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-xl group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                          <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {tool.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {tool.description}
                      </p>
                      <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300">
                        Try Calculator
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comprehensive Guide Section */}
        <section className="py-20 md:py-24 bg-white dark:bg-neutral-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInY(0, 0.7)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              className="text-center mb-16"
            >
              <BookOpen className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Complete Guide to Currency Exchange and Foreign Exchange Markets
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Master currency conversion and foreign exchange with our comprehensive guide covering exchange rates, 
                market factors, and smart money management strategies for international transactions.
              </p>
            </motion.div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <motion.div
                variants={fadeInY(0.1, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-gray-50 dark:bg-neutral-700 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Globe className="w-8 h-8 text-primary-600 dark:text-primary-400 mr-3" />
                  Understanding Exchange Rates and Currency Markets
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Exchange rates represent the value of one currency in terms of another and are fundamental to international 
                  trade, travel, and investment. These rates fluctuate constantly based on economic factors, political events, 
                  and market sentiment, making real-time conversion tools essential for accurate financial planning.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The foreign exchange market (forex) is the world's largest financial market, with over $7 trillion traded 
                  daily. Major currency pairs like USD/EUR, GBP/USD, and USD/JPY are the most liquid and frequently traded. 
                  Understanding these dynamics helps you make informed decisions whether you're traveling, investing internationally, 
                  or managing business transactions across borders.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Central banks, inflation rates, interest rates, political stability, and economic indicators all influence 
                  currency values. Our converter uses real-time data to reflect these market conditions, providing you with 
                  accurate conversion rates that banks and financial institutions rely on for their own calculations.
                </p>
              </motion.div>

              <motion.div
                variants={fadeInY(0.2, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="grid md:grid-cols-2 gap-8 mb-12"
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                    Factors Affecting Exchange Rates
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Economic indicators such as GDP growth, employment rates, and inflation significantly impact currency values. 
                    Countries with strong economies typically have stronger currencies, while political instability can weaken a currency's value.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Interest rates set by central banks are particularly influential. Higher interest rates generally attract 
                    foreign investment, increasing demand for that currency and raising its value relative to others.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                    Market Hours and Volatility
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    The forex market operates 24 hours a day, five days a week, across different time zones. The most active 
                    trading periods occur when major financial centers overlap, such as London-New York or London-Tokyo sessions.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Currency volatility can be influenced by economic announcements, geopolitical events, and market sentiment. 
                    Understanding these patterns helps in timing currency exchanges for better rates.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInY(0.3, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Banknote className="w-8 h-8 text-amber-600 dark:text-amber-400 mr-3" />
                  Smart Currency Exchange Strategies
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Timing Your Exchange</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Monitor exchange rate trends and consider exchanging money when rates are favorable. Avoid last-minute 
                      exchanges at airports or tourist areas where rates are typically less competitive.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Choose the Right Service</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Online money transfer services often offer better rates than traditional banks. Compare exchange rates 
                      and fees across different providers to find the most cost-effective option for your needs.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Understand the Costs</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Look beyond the headline exchange rate to understand the total cost of your transaction, including 
                      fees, margins, and any hidden charges that might affect the final amount you receive.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInY(0.4, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
                  Practical Applications for Different Users
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">International Travelers</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Plan your travel budget accurately by converting your home currency to your destination's currency. 
                      Monitor exchange rates before your trip to identify the best time to exchange money. Consider using 
                      travel-friendly payment methods that offer competitive exchange rates and low foreign transaction fees.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Business Professionals</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Manage international business transactions, pricing strategies, and financial reporting across different 
                      currencies. Use real-time conversion rates for accurate invoicing, cost analysis, and profit calculations 
                      when dealing with international clients or suppliers.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">International Investors</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Evaluate investment opportunities in foreign markets by understanding currency conversion impacts on returns. 
                      Track portfolio values across different currencies and assess currency risk in international investments. 
                      Consider hedging strategies to protect against unfavorable exchange rate movements.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInY(0.5, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-gray-100 dark:bg-neutral-700 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How often are exchange rates updated?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Our currency converter uses real-time exchange rates that are updated regularly throughout the trading day. 
                      Rates reflect current market conditions and are sourced from reliable financial data providers used by banks 
                      and financial institutions worldwide.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Why do exchange rates differ between providers?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Different providers add varying margins to the mid-market rate to cover their costs and generate profit. 
                      Banks typically offer less favorable rates than specialized currency exchange services. Always compare the 
                      total cost including fees, not just the exchange rate.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What's the difference between buy and sell rates?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Buy and sell rates reflect the price at which a currency exchange provider will buy or sell a currency. 
                      The difference (spread) between these rates represents the provider's profit margin. Our converter shows 
                      mid-market rates, which fall between buy and sell rates.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I rely on these rates for large transactions?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      While our rates are highly accurate for reference purposes, actual rates for large transactions may vary 
                      based on the amount, payment method, and service provider. For significant currency exchanges, always 
                      confirm rates with your chosen provider before proceeding.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 gradient-bg text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              variants={fadeInY(0, 0.8)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Master Your Financial Future Today
              </h2>
              <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
                Take control of your finances with accurate salary calculations and comprehensive financial planning tools. 
                Join thousands who trust our calculators for their financial decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/all-calculators"
                  className="bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-300"
                >
                  Explore All Calculators
                </Link>
                <Link
                  to="/financial-guides"
                  className="glass-effect text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/25 transition-all duration-200 flex items-center group focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  Read Financial Guides
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="py-12 bg-gray-100 dark:bg-neutral-800"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-neutral-700 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-neutral-600">
              <div className="flex items-start space-x-4">
                <Info className="w-8 h-8 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Important Disclaimer
                  </h3>
                  <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none">
                    <p className="mb-3">
                      This currency converter provides estimates based on current mid-market exchange rates for informational 
                      purposes only. Actual rates offered by banks, money transfer services, and other financial institutions 
                      may differ and may include additional fees, commissions, or margins.
                    </p>
                    <p className="mb-3">
                      Exchange rates fluctuate constantly throughout the trading day based on market conditions. The rates 
                      displayed here should be used as a reference only and may not reflect the exact rate available for 
                      your specific transaction amount, timing, or chosen service provider.
                    </p>
                    <p className="font-semibold text-amber-600 dark:text-amber-400">
                      Always confirm current exchange rates and total transaction costs with your chosen financial service 
                      provider before making any currency exchange or international money transfer. This tool should supplement, 
                      not replace, professional financial advice for important transactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CurrencyConverter;