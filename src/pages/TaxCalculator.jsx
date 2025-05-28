import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Receipt, Download, Share2, Info, DollarSign, TrendingUp, 
  Clock, Award, Users, CheckCircle, ArrowRight, BookOpen,
  Target, PieChart, BarChart3, Zap, Shield, Globe, Calculator
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { useRegion } from '../context/RegionContext';
import { calculateTax, getEffectiveTaxRate, getMarginalTaxRate } from '../utils/taxCalculations';
import TaxBreakdown from '../components/calculators/TaxBreakdown';
import TaxChart from '../components/calculators/TaxChart';

// Constants
const DEFAULT_FILING_STATUS = 'single';
const DEFAULT_DEPENDENTS = '0';
const DEBOUNCE_DELAY_MS = 500;

const FEATURED_BENEFITS = [
  "Accurate tax calculations",
  "Multiple filing statuses",
  "Deduction optimization", 
  "Real-time results"
];

const RELATED_TOOLS = [
  { title: 'Salary Calculator', href: '/salary-calculator', icon: Calculator, description: 'Calculate your net salary after taxes' },
  { title: 'Hourly Calculator', href: '/hourly-calculator', icon: Clock, description: 'Convert hourly rates to annual income' },
  { title: 'Budget Planner', href: '/budget-calculator', icon: PieChart, description: 'Plan your monthly budget effectively' },
  { title: 'Savings Calculator', href: '/savings-calculator', icon: Target, description: 'Calculate savings goals and timelines' }
];

const TAX_FEATURES = [
  { icon: Zap, title: 'Instant Results', description: 'Get real-time tax calculations as you input your information' },
  { icon: Globe, title: 'Multi-Region Support', description: 'Accurate tax rates and regulations for your specific location' },
  { icon: Shield, title: 'Privacy First', description: 'All calculations happen locally - your financial data never leaves your device' },
  { icon: Award, title: 'Professional Accuracy', description: 'Trusted by tax professionals and financial advisors worldwide' }
];

const TaxCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion();

  const [formData, setFormData] = useState({
    income: '',
    filingStatus: DEFAULT_FILING_STATUS,
    deductions: '',
    dependents: DEFAULT_DEPENDENTS,
    additionalIncome: '0',
    retirement401k: '0',
    healthInsurance: '0',
  });

  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setResults(null);
  }, [selectedCountry, countries]);

  const performCalculation = useCallback(() => {
    if (!formData.income || isNaN(parseFloat(formData.income)) || !selectedCountry || !countries || !countries[selectedCountry]) {
      setResults(null);
      setIsCalculating(false);
      return;
    }
    setIsCalculating(true);
    
    try {
      const income = parseFloat(formData.income) || 0;
      const additionalIncome = parseFloat(formData.additionalIncome) || 0;
      const itemizedDeductions = parseFloat(formData.deductions) || 0; 
      const retirement401k = parseFloat(formData.retirement401k) || 0;
      const healthInsurancePremiums = parseFloat(formData.healthInsurance) || 0;
      const dependents = parseInt(formData.dependents) || 0;
      const filingStatus = formData.filingStatus;

      const grossAnnualIncome = income + additionalIncome;
      
      const taxCalculationParams = {
        filingStatus,
        dependents,
        itemizedDeductions,
        preTaxDeductions: {
            retirement401k,
            healthInsurancePremiums
        }
      };
      
      const taxInfo = calculateTax(grossAnnualIncome, selectedCountry, taxCalculationParams);
      const effectiveRate = getEffectiveTaxRate(grossAnnualIncome, selectedCountry, taxCalculationParams);
      const marginalRate = getMarginalTaxRate(grossAnnualIncome, selectedCountry, taxCalculationParams);
      
      const taxableIncome = taxInfo.taxableIncome !== undefined ? taxInfo.taxableIncome : grossAnnualIncome - (retirement401k + healthInsurancePremiums);
      const finalNetIncome = grossAnnualIncome - (taxInfo.totalTax || 0);

      const calculations = {
        income: {
          gross: grossAnnualIncome,
          taxable: taxableIncome,
          net: finalNetIncome,
        },
        taxes: {
          ...taxInfo,
          effectiveRate: effectiveRate,
          marginalRate: marginalRate,
        },
        deductions: {
          preTaxRetirement: retirement401k,
          preTaxHealth: healthInsurancePremiums,
          itemizedOrPostTax: itemizedDeductions,
        },
        monthly: {
          grossIncome: grossAnnualIncome / 12,
          netIncome: finalNetIncome / 12,
          taxes: (taxInfo.totalTax || 0) / 12,
        },
      };
      setResults(calculations);
    } catch (error) {
      console.error('Tax calculation error:', error);
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  }, [formData, selectedCountry, countries]);

  useEffect(() => {
    if (formData.income && !isNaN(parseFloat(formData.income)) && countries && countries[selectedCountry]) {
      const timer = setTimeout(performCalculation, DEBOUNCE_DELAY_MS);
      return () => clearTimeout(timer);
    } else if (results !== null) {
      setResults(null);
    }
  }, [formData, selectedCountry, countries, performCalculation, results]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const exportResults = () => {
    if (!results || !selectedCountry || !countries || !countries[selectedCountry]) return;
    const countryData = countries[selectedCountry];
    const dataToExport = {
      calculationInput: {
        countryCode: selectedCountry,
        countryName: countryData.name,
        currency: countryData.currency,
        ...formData,
      },
      calculationOutput: results,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-calculation-${selectedCountry}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (!results || !selectedCountry || !countries || !countries[selectedCountry]) return;
    const countryData = countries[selectedCountry];
    const shareText = `Tax Calculation for ${countryData.name}:\nGross Income: ${formatCurrency(results.income.gross, countryData.currency)}\nNet Income: ${formatCurrency(results.income.net, countryData.currency)}\nTotal Taxes: ${formatCurrency(results.taxes.totalTax, countryData.currency)}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Tax Calculation - ${countryData.name}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Share via API failed:', error);
        try {
          await navigator.clipboard.writeText(`${shareText}\n\nView details: ${shareUrl}`);
          alert('Results copied to clipboard! You can now paste it to share.');
        } catch (clipboardError) {
          alert('Sharing failed. Please try exporting or manually copy the page link.');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\nView details: ${shareUrl}`);
        alert('Results copied to clipboard! You can now paste it to share.');
      } catch (clipboardError) {
        alert('Unable to copy to clipboard. Please manually copy the page link.');
      }
    }
  };
  
  const currentCountryName = useMemo(() => 
    (countries && selectedCountry && countries[selectedCountry]) ? countries[selectedCountry].name : 'your region',
    [countries, selectedCountry]
  );
  
  const currentCurrencySymbol = useMemo(() => 
    (countries && selectedCountry && countries[selectedCountry]) ? countries[selectedCountry].currency : '$',
    [countries, selectedCountry]
  );

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `Income Tax Calculator - ${currentCountryName}`,
    "description": `Estimate your income tax liability in ${currentCountryName}. Considers federal, state/provincial taxes, social security, and common deductions.`,
    "applicationCategory": "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript.",
    "featureList": [
      "Income Tax Calculation", 
      "Pre-tax and Post-tax Deduction Handling", 
      "Effective and Marginal Tax Rate Estimation",
      "Filing Status and Dependents Consideration",
      "Multi-country Support",
      "Data Export (JSON)",
      "Shareable Results"
    ],
    offers: { "@type": "Offer", price: "0" },
    provider: { "@type": "Organization", name: "WageCalculator" }
  }), [currentCountryName]);

  const filingStatusOptions = useMemo(() => {
    return [
      { value: 'single', label: 'Single' },
      { value: 'married', label: 'Married Filing Jointly' },
      { value: 'married_separate', label: 'Married Filing Separately' },
      { value: 'hoh', label: 'Head of Household' },
    ];
  }, []);

  // Animation variants
  const fadeInY = (delay = 0, duration = 0.5) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration, delay, ease: "circOut" } },
  });

  return (
    <>
      <SEOHead 
        title={`Free Income Tax Calculator ${currentCountryName} 2024 - Estimate Your Tax Liability`}
        description={`Calculate your income tax liability in ${currentCountryName} with our free tax calculator. Includes federal, state, social security taxes and deductions. Get accurate tax estimates for 2024 tax planning.`}
        keywords={`tax calculator ${currentCountryName}, income tax calculator ${currentCountryName}, tax estimator ${currentCountryName}, tax deductions calculator ${currentCountryName}, net income after tax ${currentCountryName}, filing status calculator ${currentCountryName}, effective tax rate calculator ${currentCountryName}, marginal tax rate ${currentCountryName}, tax planning calculator ${currentCountryName}, free tax calculator`}
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
                <Receipt className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  Income Tax Calculator
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Estimate your income tax liability and optimize your deductions in {currentCountryName}. 
                Get accurate tax calculations with detailed breakdown for better financial planning.
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

        {/* Main Calculator Section */}
        <section className="py-12 md:py-16 -mt-8 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <Receipt className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
                    Tax Information
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="income" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Annual Gross Income ({currentCurrencySymbol})
                      </label>
                      <input
                        id="income"
                        type="number"
                        name="income"
                        value={formData.income}
                        onChange={handleInputChange}
                        placeholder="e.g., 75000"
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                        min="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="filingStatus" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Filing Status
                      </label>
                      <select
                        id="filingStatus"
                        name="filingStatus"
                        value={formData.filingStatus}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                      >
                        {filingStatusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="dependents" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Dependents
                        </label>
                        <input
                          id="dependents"
                          type="number"
                          name="dependents"
                          value={formData.dependents}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                          min="0"
                          step="1"
                        />
                      </div>

                      <div>
                        <label htmlFor="additionalIncome" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Additional Income
                        </label>
                        <input
                          id="additionalIncome"
                          type="number"
                          name="additionalIncome"
                          value={formData.additionalIncome}
                          onChange={handleInputChange}
                          placeholder="0"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="border-t dark:border-neutral-700 pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Pre-Tax Deductions</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="retirement401k" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Retirement Contributions (Annual)
                          </label>
                          <input
                            id="retirement401k"
                            type="number"
                            name="retirement401k"
                            value={formData.retirement401k}
                            onChange={handleInputChange}
                            placeholder="0"
                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                            min="0"
                          />
                        </div>

                        <div>
                          <label htmlFor="healthInsurance" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Health Insurance Premiums (Annual)
                          </label>
                          <input
                            id="healthInsurance"
                            type="number"
                            name="healthInsurance"
                            value={formData.healthInsurance}
                            onChange={handleInputChange}
                            placeholder="0"
                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t dark:border-neutral-700 pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Other Deductions</h3>
                      
                      <div>
                        <label htmlFor="deductions" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Itemized Deductions (Annual)
                        </label>
                        <input
                          id="deductions"
                          type="number"
                          name="deductions"
                          value={formData.deductions}
                          onChange={handleInputChange}
                          placeholder="0"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {results && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
                    >
                      <button
                        onClick={exportResults}
                        aria-label="Export tax calculation results as JSON"
                        className="flex-1 inline-flex justify-center items-center px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Export JSON
                      </button>
                      <button
                        onClick={shareResults}
                        aria-label="Share tax calculation results"
                        className="flex-1 inline-flex justify-center items-center px-4 py-3 border-2 border-transparent shadow-sm text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 transition-all duration-200"
                      >
                        <Share2 className="w-5 h-5 mr-2" />
                        Share Results
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Results Display */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2"
              >
                {isCalculating ? (
                  <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 dark:border-primary-400 mb-6"></div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Calculating Your Taxes</h3>
                    <p className="text-gray-500 dark:text-gray-400">Processing tax rates and deductions...</p>
                  </div>
                ) : results ? (
                  <div className="space-y-6">
                    <TaxBreakdown results={results} countryCurrency={currentCurrencySymbol} />
                    <TaxChart results={results} countryCurrency={currentCurrencySymbol} />
                  </div>
                ) : (
                  <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                    <Receipt className="w-20 h-20 mb-6 text-gray-300 dark:text-neutral-600" />
                    <h3 className="text-2xl font-semibold mb-2">Ready to Calculate</h3>
                    <p className="text-lg mb-4">Enter your income and deduction details</p>
                    <p className="text-sm">Results will include detailed tax breakdown and optimization tips</p>
                  </div>
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
                Advanced Tax Calculation Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Professional-grade tax calculations with comprehensive deduction analysis and optimization recommendations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {TAX_FEATURES.map((feature, index) => {
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
                Complete Your Tax Planning
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Use our comprehensive suite of financial calculators for complete tax and income planning.
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

        {/* Comprehensive Tax Guide Section */}
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
                Complete Tax Planning Guide for {currentCountryName}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Master your tax strategy with our comprehensive guide to income tax calculations, 
                deduction optimization, and financial planning in {currentCountryName}.
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
                  <Receipt className="w-8 h-8 text-primary-600 dark:text-primary-400 mr-3" />
                  Understanding Income Tax Calculations
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Income tax calculation in {currentCountryName} involves multiple components that work together to determine your final tax liability. 
                  Understanding each component helps you make informed financial decisions and optimize your tax strategy effectively.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Your taxable income forms the foundation of all tax calculations. This figure represents your total income minus allowable 
                  deductions and exemptions. The progressive tax system in {currentCountryName} means that different portions of your income 
                  are taxed at different rates, with higher income levels facing higher tax rates.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Effective tax planning requires understanding both your marginal tax rate (the rate on your last dollar of income) and 
                  your effective tax rate (your total tax as a percentage of total income). Our calculator provides both metrics to help 
                  you understand your complete tax picture.
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
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                    Tax Components & Structure
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    The tax system in {currentCountryName} typically includes federal income taxes, state or provincial taxes (where applicable), 
                    and various social contributions including social security and healthcare taxes.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Each component has its own rates, brackets, and calculation methods. Federal taxes usually follow progressive brackets, 
                    while social contributions may have flat rates with income caps. Understanding these differences is crucial for accurate planning.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Target className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                    Filing Status Impact
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Your filing status significantly affects your tax liability through different standard deductions, tax brackets, and 
                    available credits. Common statuses include single, married filing jointly, married filing separately, and head of household.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Each status offers different advantages depending on your situation. Married couples may benefit from filing jointly 
                    for lower overall rates, while separate filing might be advantageous in specific circumstances.
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
                  <Award className="w-8 h-8 text-amber-600 dark:text-amber-400 mr-3" />
                  Deduction Strategies and Optimization
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Pre-Tax Deductions</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Pre-tax deductions reduce your taxable income dollar-for-dollar. Common examples include retirement plan contributions, 
                      health insurance premiums, and flexible spending account contributions. These provide immediate tax savings.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Itemized vs Standard</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      You can choose between itemizing deductions or taking the standard deduction. Itemizing makes sense when your 
                      qualifying expenses exceed the standard deduction amount. Common itemized deductions include mortgage interest and charitable contributions.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Dependent Benefits</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Claiming dependents can provide significant tax benefits through additional exemptions and credits like the Child Tax Credit. 
                      These benefits phase out at higher income levels, making planning essential.
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
                  Advanced Tax Planning Strategies
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Income Timing and Management</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Strategic timing of income and deductions can significantly impact your tax liability. Consider deferring income to lower-tax years 
                      or accelerating deductions into higher-tax years. This is particularly relevant for bonuses, stock options, and business income.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Retirement Account Optimization</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Maximizing contributions to tax-advantaged retirement accounts provides immediate tax benefits while building long-term wealth. 
                      Different account types (traditional vs. Roth) offer different tax treatments, allowing for sophisticated tax planning strategies.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Tax Credit Maximization</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Tax credits provide dollar-for-dollar tax reductions and are more valuable than deductions. Common credits include education credits, 
                      child and dependent care credits, and energy efficiency credits. Some credits are refundable, meaning you can receive money back 
                      even if you owe no tax.
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tax Calculator Usage Tips</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Maximizing Accuracy</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      For the most accurate results, include all sources of income including wages, bonuses, investment income, and side business earnings. 
                      Also input all applicable deductions including retirement contributions, health insurance premiums, and other pre-tax benefits.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Scenario Comparison</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Use the calculator to compare different scenarios such as increasing retirement contributions, changing filing status, 
                      or evaluating the tax impact of a salary increase. This helps in making informed financial decisions.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Regular Updates</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Tax laws and rates change annually. Recalculate your taxes at the beginning of each tax year and whenever your income 
                      or deductions change significantly. This ensures your financial planning remains accurate and up-to-date.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Professional Consultation</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      While our calculator provides accurate estimates for most situations, complex tax situations involving business income, 
                      rental properties, significant investment activities, or major life changes may benefit from professional tax advice.
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
                    Important Tax Disclaimer
                  </h3>
                  <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none">
                    <p className="mb-3">
                      This tax calculator provides estimates based on current tax rates and standard calculations for {currentCountryName}. 
                      Results are for informational and planning purposes only and should not be considered as professional tax advice.
                    </p>
                    <p className="mb-3">
                      Tax laws are complex and vary significantly based on individual circumstances, filing status, available deductions, 
                      credits, and other factors not fully captured by this calculator. Tax rates and regulations change frequently and 
                      vary by jurisdiction within {currentCountryName}.
                    </p>
                    <p className="font-semibold text-amber-600 dark:text-amber-400">
                      Always consult with qualified tax professionals or certified public accountants for advice tailored to your specific 
                      tax situation. This tool should supplement, not replace, professional tax guidance for important financial and tax decisions.
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

export default TaxCalculator;