import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { motion } from 'framer-motion';
import { ArrowRightLeft, Download, Share2, Info, Globe, RefreshCw, Clock, ChevronRight } from 'lucide-react'; // Added ChevronRight
import SEOHead from '../components/seo/SEOHead';
import { useRegion } from '../context/RegionContext';

const CurrencyConverter = () => {
  const { currencies, exchangeRates, formatCurrency, selectedCurrency: initialSelectedCurrency } = useRegion();
  
  const [formData, setFormData] = useState({
    amount: '1000',
    fromCurrency: initialSelectedCurrency || 'USD',
    toCurrency: 'EUR',
    // date: new Date().toISOString().split('T')[0] // Not actively used with current exchangeRates logic
  });
  
  const [results, setResults] = useState(null);
  const [popularCurrencies, setPopularCurrencies] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false); // Kept for UI feedback
  const [historicalRates, setHistoricalRates] = useState([]);
  const [error, setError] = useState(null); // To display errors if rates are missing

  // This useEffect now relies on exchangeRates from context
  useEffect(() => {
    if (Object.keys(exchangeRates).length > 0) {
      // Assuming exchangeRates are fetched once, lastUpdated can be set once
      // Or, if you had a mechanism to refresh exchangeRates in context, this would update
      if (!lastUpdated) { // Set only once or if refreshed
         setLastUpdated(new Date().toLocaleString()); // Placeholder: ideally this comes from API response time
      }
      
      const popular = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CNY', 'INR'];
      const available = popular.filter(code => code in exchangeRates && currencies[code]);
      setPopularCurrencies(available);
      
      // Trigger initial conversion if form is ready
      if (formData.amount && formData.fromCurrency && formData.toCurrency) {
        convertAndDisplay();
      }
    } else if (Object.keys(currencies).length > 0) { // If currencies are loaded but no rates yet
        setLastUpdated('Rates not yet available');
    }
  }, [exchangeRates, currencies]); // Depend on exchangeRates and currencies from context

  // Ensure fromCurrency is valid when context or formData changes
  useEffect(() => {
    if (Object.keys(currencies).length > 0 && !currencies[formData.fromCurrency]) {
        // If current fromCurrency is invalid (e.g. after context load), reset to initial or USD
        setFormData(prev => ({ ...prev, fromCurrency: initialSelectedCurrency || 'USD' }));
    }
  }, [currencies, formData.fromCurrency, initialSelectedCurrency]);


  const getRandomRateVariation = (baseRate) => {
    if (typeof baseRate !== 'number' || isNaN(baseRate) || !isFinite(baseRate)) return 1; // Should not happen if baseRate is valid
    const variation = (Math.random() * 0.1) - 0.05; // +/- 5% variation
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
      const directRate = exchangeRates[to] / exchangeRates[from]; // Effective rate from -> to via USD
      
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
        .slice(0, 6);
      
      setResults({
        amount,
        fromCurrency: from,
        toCurrency: to,
        convertedAmount,
        exchangeRate: directRate,
        otherConversions,
        timestamp: new Date().toISOString()
      });

      // Update mock historical rates (relative to the current conversion pair)
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
  }, [formData, exchangeRates, popularCurrencies]); // Removed formatCurrency from deps if not used directly inside

  useEffect(() => {
    convertAndDisplay();
  }, [formData, exchangeRates, convertAndDisplay]); // convertAndDisplay is now a dependency


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

  // Export and Share functions remain mostly the same
  const exportResults = () => {
    if (!results || error) return;
    const data = {
      amount: results.amount,
      fromCurrency: results.fromCurrency,
      toCurrency: results.toCurrency,
      convertedAmount: results.convertedAmount,
      exchangeRate: results.exchangeRate,
      timestamp: results.timestamp,
      // Mock historical data is fine for export if it's what's displayed
      historicalRates: historicalRates.map(hr => ({date: hr.date, rate: hr.rate.toFixed(6)})), 
      otherConversions: results.otherConversions.map(oc => ({...oc, rate: oc.rate.toFixed(6)}))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversion_${results.fromCurrency}_to_${results.toCurrency}.json`;
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
  
  const structuredData = { /* ... same as before ... */ };

  // Motion variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      <SEOHead 
        title="Currency Converter - Exchange Rates" // Simplified title
        description="Convert amounts between global currencies using exchange rates based on USD. Includes popular conversions and mock historical data."
        keywords="currency converter, exchange rates, foreign exchange, forex calculator, money converter, USD base rates"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center bg-primary-100 text-primary-600 p-3 rounded-full mb-4">
                <ArrowRightLeft className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Currency Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert amounts between global currencies. Rates are relative to USD and updated periodically.
            </p>
          </motion.div>

          {/* Input Form */}
          <motion.div
            variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl mb-8">
              <div className="grid grid-cols-1 md:grid-cols-[2fr_auto_2fr_auto] gap-x-4 gap-y-4 items-end mb-4">
                  <div className="md:col-span-2"> {/* Amount takes more space */}
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount to Convert
                    </label>
                    <input
                      id="amount"
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="1000"
                      className="input-field py-3 text-lg"
                    />
                  </div>
                  {/* Swap button will be between currency selectors */}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[2fr_auto_2fr] gap-x-4 gap-y-4 items-end">
                  <div>
                    <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                      From Currency
                    </label>
                    <select
                      id="fromCurrency"
                      name="fromCurrency"
                      value={formData.fromCurrency}
                      onChange={handleInputChange}
                      className="input-field py-3 text-base"
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
                   <div className="flex justify-center pt-5"> {/* Swap button */}
                      <button 
                        onClick={swapCurrencies}
                        title="Swap currencies"
                        disabled={Object.keys(currencies).length === 0}
                        className="p-3 bg-gray-100 rounded-full hover:bg-primary-100 hover:text-primary-600 transition-colors text-gray-600 disabled:opacity-50"
                      >
                        <ArrowRightLeft className="w-5 h-5" />
                      </button>
                    </div>
                  <div>
                    <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                      To Currency
                    </label>
                    <select
                      id="toCurrency"
                      name="toCurrency"
                      value={formData.toCurrency}
                      onChange={handleInputChange}
                      className="input-field py-3 text-base"
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
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Rates last updated: {lastUpdated || 'Loading rates...'} (Based on USD)</span>
                </div>
                {/* Manual refresh might not be needed if context auto-updates, but kept for explicitness */}
                <button
                  onClick={convertAndDisplay} // Re-run conversion with current context rates
                  disabled={isCalculating || Object.keys(exchangeRates).length === 0}
                  className="flex items-center space-x-1.5 text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
                  <span>Recalculate</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Area */}
          <motion.div
            variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.5, delay: 0.2 }}
          >
             {error && (
                 <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow mb-6" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}
            {isCalculating && !results && !error && (
              <div className="bg-white p-8 rounded-xl shadow-xl flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            )}
            {!isCalculating && !results && !error && Object.keys(exchangeRates).length > 0 && (
                 <div className="bg-white p-8 rounded-xl shadow-xl text-center text-gray-500 min-h-[200px] flex flex-col justify-center items-center">
                    <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Enter an amount to see the conversion.</p>
                </div>
            )}
             {!isCalculating && !results && !error && Object.keys(exchangeRates).length === 0 && ( // No rates loaded yet
                 <div className="bg-white p-8 rounded-xl shadow-xl text-center text-gray-500 min-h-[200px] flex flex-col justify-center items-center">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Loading exchange rates... Please wait.</p>
                </div>
            )}

            {results && !error && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl text-center">
                  <p className="text-sm text-gray-500 mb-1">
                    {formatCurrency(results.amount, results.fromCurrency, {smartDecimals: true})} is approximately
                  </p>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-600 mb-2 tracking-tight">
                    {formatCurrency(results.convertedAmount, results.toCurrency, {smartDecimals: true})}
                  </p>
                  <p className="text-sm text-gray-600">
                    1 {results.fromCurrency} ≈ {results.exchangeRate.toFixed(6)} {results.toCurrency}
                  </p>
                  <div className="mt-6 flex justify-center space-x-3">
                    <button onClick={exportResults} className="btn-secondary py-2 px-4 text-sm">
                      <Download className="w-4 h-4 mr-1.5 inline-block" /> Export
                    </button>
                    {navigator.share && (
                      <button onClick={shareResults} className="btn-secondary py-2 px-4 text-sm">
                        <Share2 className="w-4 h-4 mr-1.5 inline-block" /> Share
                      </button>
                    )}
                  </div>
                </div>

                {historicalRates.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Mock Historical Trend (Illustrative)</h3>
                    <div className="space-y-2">
                      {historicalRates.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-md text-sm">
                          <span className="text-gray-600">{item.date}</span>
                          <span className="font-medium text-gray-800">
                            1 {results.fromCurrency} ≈ {item.rate.toFixed(6)} {results.toCurrency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.otherConversions && results.otherConversions.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversions to Other Currencies:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {results.otherConversions.map((conv) => (
                        <div key={conv.currency} className="p-3 bg-gray-50 rounded-lg text-sm">
                          <div className="font-semibold text-gray-700">
                            {formatCurrency(conv.amount, conv.currency, {smartDecimals:true})}
                          </div>
                          <div className="text-xs text-gray-500">
                            Rate: {conv.rate.toFixed(6)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Information Section */}
          <motion.div 
            variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12"
          >
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl"> {/* Use card styling */}
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About Our Currency Converter
                  </h3>
                  <div className="prose prose-sm text-gray-600 max-w-none">
                    <p>
                      This tool uses exchange rates that are typically updated once per day, based on USD as the central currency.
                      These rates are indicative and should be used for informational purposes.
                    </p>
                    <p className="mt-3">
                      For actual transactions:
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li>• Financial institutions and money transfer services will apply their own exchange rates and may include fees or commissions.</li>
                      <li>• The rates you see here (mid-market rates) might differ from buy/sell rates offered by banks.</li>
                      <li>• Exchange rates can change frequently throughout the day based on global market activity.</li>
                    </ul>
                    <p className="mt-3">
                      Always confirm the final rate with your financial provider before making any transactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CurrencyConverter;