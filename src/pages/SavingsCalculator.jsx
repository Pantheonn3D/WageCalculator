import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  PiggyBank, Download, Share2, Info, DollarSign, TrendingUp, 
  Clock, Award, Users, CheckCircle, ArrowRight, BookOpen,
  Target, PieChart, BarChart3, Zap, Shield, Globe, Calculator
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { useRegion } from '../context/RegionContext';
import SavingsBreakdown from '../components/calculators/SavingsBreakdown';
import SavingsChart from '../components/calculators/SavingsChart';

// Constants
const DEFAULT_INITIAL_AMOUNT = '1000';
const DEFAULT_MONTHLY_CONTRIBUTION = '500';
const DEFAULT_ANNUAL_RETURN = '7';
const DEFAULT_YEARS = '10';
const DEFAULT_COMPOUNDING_FREQUENCY = '12'; // Monthly
const DEFAULT_INFLATION_RATE = '3';
const DEBOUNCE_DELAY_MS = 500;

const FEATURED_BENEFITS = [
  "Real-time compound calculations",
  "Multi-currency support", 
  "Inflation adjustment analysis",
  "Export and share projections"
];

const COMPOUNDING_OPTIONS = [
  { value: '1', label: 'Annually' },
  { value: '2', label: 'Semi-Annually' },
  { value: '4', label: 'Quarterly' },
  { value: '12', label: 'Monthly' },
  { value: '52', label: 'Weekly' },
  { value: '365', label: 'Daily' },
];

const RELATED_TOOLS = [
  { title: 'Investment Calculator', href: '/investment-calculator', icon: TrendingUp, description: 'Calculate investment returns and growth' },
  { title: 'Retirement Calculator', href: '/retirement-calculator', icon: Target, description: 'Plan for retirement savings goals' },
  { title: 'Budget Planner', href: '/budget-calculator', icon: PieChart, description: 'Plan your monthly budget effectively' },
  { title: 'Loan Calculator', href: '/loan-calculator', icon: Calculator, description: 'Calculate loan payments and interest' }
];

const CALCULATION_FEATURES = [
  { icon: Zap, title: 'Lightning Fast', description: 'Get instant compound interest calculations as you type' },
  { icon: Globe, title: 'Global Currencies', description: 'Support for multiple currencies and regions worldwide' },
  { icon: Shield, title: 'Privacy First', description: 'All calculations happen locally - your data stays private' },
  { icon: Award, title: 'Professional Grade', description: 'Used by financial advisors and investment professionals' }
];

const SavingsCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion();

  const [formData, setFormData] = useState({
    initialAmount: DEFAULT_INITIAL_AMOUNT,
    monthlyContribution: DEFAULT_MONTHLY_CONTRIBUTION,
    annualReturn: DEFAULT_ANNUAL_RETURN,
    years: DEFAULT_YEARS,
    compoundingFrequency: DEFAULT_COMPOUNDING_FREQUENCY,
    inflationRate: DEFAULT_INFLATION_RATE,
    goalAmount: '',
  });

  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const performCalculation = useCallback(() => {
    if (isNaN(parseFloat(formData.initialAmount)) && isNaN(parseFloat(formData.monthlyContribution))) {
        setResults(null);
        setIsCalculating(false);
        return;
    }
    setIsCalculating(true);
    
    try {
      const initialAmount = parseFloat(formData.initialAmount) || 0;
      const monthlyContribution = parseFloat(formData.monthlyContribution) || 0;
      const annualReturnRate = (parseFloat(formData.annualReturn) || 0) / 100;
      const years = parseFloat(formData.years) || 0;
      const compoundingFrequency = parseInt(formData.compoundingFrequency) || 12;
      const inflationRate = (parseFloat(formData.inflationRate) || 0) / 100;
      const goalAmount = parseFloat(formData.goalAmount) || 0;

      const n = compoundingFrequency;
      const t = years;
      const totalPeriods = n * t;
      const periodicRate = annualReturnRate / n;

      const fvInitial = initialAmount * Math.pow(1 + periodicRate, totalPeriods);
      
      let fvContributions = 0;
      const r_monthly = annualReturnRate / 12;
      const totalMonths = t * 12;

      if (monthlyContribution > 0 && r_monthly > 0) {
        fvContributions = monthlyContribution * ((Math.pow(1 + r_monthly, totalMonths) - 1) / r_monthly);
      } else if (monthlyContribution > 0 && r_monthly === 0) {
        fvContributions = monthlyContribution * totalMonths;
      }

      const totalFutureValue = fvInitial + fvContributions;
      const totalPrincipalContributions = initialAmount + (monthlyContribution * totalMonths);
      const totalInterestEarned = totalFutureValue - totalPrincipalContributions;
      
      const inflationAdjustedFutureValue = totalFutureValue / Math.pow(1 + inflationRate, t);
      
      const monthlyData = [];
      let currentBalance = initialAmount;
      let cumulativeContributions = initialAmount;
      for (let i = 0; i < totalMonths; i++) {
        currentBalance += monthlyContribution;
        currentBalance *= (1 + r_monthly);
        cumulativeContributions += monthlyContribution;
        monthlyData.push({
          month: i + 1,
          year: Math.floor((i + 1) / 12),
          balance: currentBalance,
          contributions: cumulativeContributions,
          interest: currentBalance - cumulativeContributions,
        });
      }
      monthlyData.unshift({ month: 0, year: 0, balance: initialAmount, contributions: initialAmount, interest: 0 });

      let timeToGoalYears = null;
      let monthlyContributionNeeded = null;

      if (goalAmount > 0 && goalAmount > initialAmount && annualReturnRate > 0 && monthlyContribution >= 0) {
        let tempBalance = initialAmount;
        let monthsToGoal = 0;
        if (tempBalance < goalAmount) {
            for (let m = 1; m <= years * 12 * 2; m++) {
                tempBalance = tempBalance * (1 + r_monthly) + monthlyContribution;
                monthsToGoal = m;
                if (tempBalance >= goalAmount) break;
            }
            if (tempBalance >= goalAmount) {
                timeToGoalYears = monthsToGoal / 12;
            } else {
                 timeToGoalYears = Infinity;
            }
        } else {
            timeToGoalYears = 0;
        }

        if (totalMonths > 0) {
            const fvOfPV = initialAmount * Math.pow(1 + r_monthly, totalMonths);
            if (Math.pow(1 + r_monthly, totalMonths) - 1 !== 0) {
                monthlyContributionNeeded = (goalAmount - fvOfPV) * (r_monthly / (Math.pow(1 + r_monthly, totalMonths) - 1));
                if (monthlyContributionNeeded < 0) monthlyContributionNeeded = 0;
            } else if (goalAmount > fvOfPV) {
                monthlyContributionNeeded = (goalAmount - fvOfPV) / totalMonths;
            } else {
                monthlyContributionNeeded = 0;
            }
        }
      }

      const calculations = {
        summary: {
          totalFutureValue,
          totalPrincipalContributions,
          totalInterestEarned,
          inflationAdjustedFutureValue,
          overallGainPercentage: totalPrincipalContributions > 0 ? (totalInterestEarned / totalPrincipalContributions) * 100 : 0,
        },
        inputs: {
          initialAmount,
          monthlyContribution,
          annualReturnRate,
          years,
          compoundingFrequency,
          inflationRate,
        },
        goalAnalysis: {
          targetAmount: goalAmount,
          timeToGoalYears,
          monthlyContributionNeeded,
          isGoalAchieved: goalAmount > 0 ? totalFutureValue >= goalAmount : null,
        },
        monthlyData,
      };
      setResults(calculations);
    } catch (error) {
      console.error('Savings calculation error:', error);
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  }, [formData]);

  useEffect(() => {
    if (
      (formData.initialAmount && !isNaN(parseFloat(formData.initialAmount))) ||
      (formData.monthlyContribution && !isNaN(parseFloat(formData.monthlyContribution)))
    ) {
      const timer = setTimeout(performCalculation, DEBOUNCE_DELAY_MS);
      return () => clearTimeout(timer);
    } else if (results !== null) {
      setResults(null);
    }
  }, [formData, performCalculation, results]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const exportResults = () => {
    if (!results) return;
    const countryData = countries?.[selectedCountry];
    const dataToExport = {
      calculationInput: {
        countryName: countryData?.name || 'N/A',
        currency: countryData?.currency || 'N/A',
        ...formData,
      },
      calculationOutput: results,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `savings-calculation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (!results) return;
    const countryData = countries?.[selectedCountry];
    const currencySymbol = countryData?.currency || ''; 

    const shareText = `Savings Projection:\nFuture Value: ${formatCurrency(results.summary.totalFutureValue, currencySymbol)}\nTotal Interest: ${formatCurrency(results.summary.totalInterestEarned, currencySymbol)}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Savings Projection', text: shareText, url: shareUrl });
      } catch (error) {
        console.error('Share via API failed:', error);
        try {
          await navigator.clipboard.writeText(`${shareText}\n\nView details: ${shareUrl}`);
          alert('Projection copied to clipboard! You can now paste it to share.');
        } catch (clipboardError) {
          alert('Sharing failed. Please try exporting or manually copy the page link.');
        }
      }
    } else {
       try {
        await navigator.clipboard.writeText(`${shareText}\n\nView details: ${shareUrl}`);
        alert('Projection copied to clipboard! You can now paste it to share.');
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
    "name": `Compound Interest Savings Calculator - ${currentCountryName}`,
    "description": `Calculate savings growth with compound interest in ${currentCountryName}. Project future value with regular contributions, inflation adjustment, and goal planning.`,
    "applicationCategory": "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript.",
    "featureList": [
      "Compound Interest Calculation (Annual, Monthly, Daily, etc.)", 
      "Regular Contributions Impact", 
      "Future Value Projection",
      "Interest Earned Calculation",
      "Inflation Adjustment (Real Value)",
      "Savings Goal Analysis",
      "Visual Growth Charts",
      "Data Export (JSON)",
      "Shareable Results"
    ],
    offers: { "@type": "Offer", price: "0" },
    provider: { "@type": "Organization", name: "WageCalculator" }
  }), [currentCountryName]);

  // Animation variants
  const fadeInY = (delay = 0, duration = 0.5) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration, delay, ease: "circOut" } },
  });

  const inputFieldClass = "w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200";
  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";

  return (
    <>
      <SEOHead 
        title={`Free Compound Interest Savings Calculator 2024 - Grow Your Money in ${currentCountryName}`}
        description={`Calculate your savings growth with compound interest in ${currentCountryName}. Free calculator shows future value with regular contributions, inflation effects, and goal planning. Start building wealth today.`}
        keywords={`savings calculator ${currentCountryName}, compound interest calculator ${currentCountryName}, investment growth calculator ${currentCountryName}, future value calculator ${currentCountryName}, financial planning tool ${currentCountryName}, retirement savings calculator ${currentCountryName}, money growth calculator ${currentCountryName}, compound savings calculator, free savings planner, wealth building calculator`}
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
                <PiggyBank className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  Savings Growth Calculator
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Harness the power of compound interest to grow your savings in {currentCountryName}. 
                See how your money can multiply over time with smart saving strategies.
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
                    <Target className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
                    Enter Your Savings Plan
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="initialAmount" className={labelClass}>Initial Amount ({currentCurrencySymbol})</label>
                      <input id="initialAmount" type="number" name="initialAmount" value={formData.initialAmount} onChange={handleInputChange} placeholder="e.g., 1000" className={inputFieldClass} min="0"/>
                    </div>
                    
                    <div>
                      <label htmlFor="monthlyContribution" className={labelClass}>Monthly Contribution ({currentCurrencySymbol})</label>
                      <input id="monthlyContribution" type="number" name="monthlyContribution" value={formData.monthlyContribution} onChange={handleInputChange} placeholder="e.g., 500" className={inputFieldClass} min="0"/>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="annualReturn" className={labelClass}>Annual Return (%)</label>
                        <input id="annualReturn" type="number" name="annualReturn" value={formData.annualReturn} onChange={handleInputChange} placeholder="e.g., 7" className={inputFieldClass} step="0.1" min="0"/>
                      </div>
                      
                      <div>
                        <label htmlFor="years" className={labelClass}>Time Period (Years)</label>
                        <input id="years" type="number" name="years" value={formData.years} onChange={handleInputChange} placeholder="e.g., 10" className={inputFieldClass} min="1"/>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="compoundingFrequency" className={labelClass}>Compounding Frequency</label>
                      <select id="compoundingFrequency" name="compoundingFrequency" value={formData.compoundingFrequency} onChange={handleInputChange} className={inputFieldClass}>
                        {COMPOUNDING_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="inflationRate" className={labelClass}>Inflation Rate (%)</label>
                        <input id="inflationRate" type="number" name="inflationRate" value={formData.inflationRate} onChange={handleInputChange} placeholder="e.g., 3" className={inputFieldClass} step="0.1" min="0"/>
                      </div>
                      
                      <div>
                        <label htmlFor="goalAmount" className={labelClass}>Savings Goal ({currentCurrencySymbol})</label>
                        <input id="goalAmount" type="number" name="goalAmount" value={formData.goalAmount} onChange={handleInputChange} placeholder="e.g., 50000" className={inputFieldClass} min="0"/>
                      </div>
                    </div>
                  </div>

                  {results && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
                    >
                      <button onClick={exportResults} aria-label="Export savings calculation results as JSON"
                        className="flex-1 inline-flex justify-center items-center px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200">
                        <Download className="w-5 h-5 mr-2" /> Export JSON
                      </button>
                      <button onClick={shareResults} aria-label="Share savings calculation results"
                        className="flex-1 inline-flex justify-center items-center px-4 py-3 border-2 border-transparent shadow-sm text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 transition-all duration-200">
                        <Share2 className="w-5 h-5 mr-2" /> Share Results
                      </button>
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
                {isCalculating && (!results || Object.keys(results).length === 0) ? (
                  <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 dark:border-primary-400 mb-6"></div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Calculating Your Savings</h3>
                    <p className="text-gray-500 dark:text-gray-400">Computing compound interest and projections...</p>
                  </div>
                ) : results ? (
                  <div className="space-y-6">
                    <SavingsBreakdown results={results} countryCurrency={currentCurrencySymbol} />
                    <SavingsChart results={results} countryCurrency={currentCurrencySymbol} />
                  </div>
                ) : (
                  <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                    <PiggyBank className="w-20 h-20 mb-6 text-gray-300 dark:text-neutral-600" />
                    <h3 className="text-2xl font-semibold mb-2">Ready to Calculate</h3>
                    <p className="text-lg mb-4">Enter your savings details to see growth projections</p>
                    <p className="text-sm">Results will include compound interest analysis and goal tracking</p>
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
                Why Our Savings Calculator is Different
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Advanced compound interest calculations with real-world factors like inflation and flexible contribution schedules.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {CALCULATION_FEATURES.map((feature, index) => {
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
                Complete Your Wealth Building Journey
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explore our comprehensive financial planning tools to maximize your savings potential.
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
                Complete Guide to Compound Interest Savings in {currentCountryName}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Master the art of wealth building through compound interest. Learn how to maximize your savings growth 
                and achieve your financial goals faster in {currentCountryName}.
              </p>
            </motion.div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <motion.div
                variants={fadeInY(0.1, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                  The Magic of Compound Interest
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Compound interest is often called the eighth wonder of the world - and for good reason. It's the process 
                  where your money earns returns not just on your initial investment, but also on all the previous returns 
                  you've accumulated. This creates a snowball effect that can dramatically accelerate your wealth building.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  In {currentCountryName}, understanding compound interest is crucial for effective financial planning. 
                  Whether you're saving for retirement, a home down payment, or building an emergency fund, the principles 
                  of compound growth can help you reach your goals faster than you might think possible.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The key factors that determine your compound interest growth are: the initial amount you invest, how much 
                  you contribute regularly, the rate of return you earn, how often the interest compounds, and most importantly - time. 
                  Even small amounts saved consistently over long periods can grow into substantial wealth.
                </p>
              </motion.div>

              <motion.div
                variants={fadeInY(0.2, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="grid md:grid-cols-2 gap-8 mb-12"
              >
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                    Maximizing Your Returns
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    To maximize compound interest benefits, focus on starting early, contributing regularly, and choosing 
                    appropriate investment vehicles for your goals and risk tolerance.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Even a difference of a few percentage points in annual returns can result in hundreds of thousands 
                    of dollars over long time periods. This is why it's worth researching and optimizing your investment strategy.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
                    The Power of Time
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Time is your greatest asset when it comes to compound interest. Starting 10 years earlier can often 
                    result in more wealth than doubling your monthly contributions later in life.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    This is why financial experts consistently recommend starting to save and invest as early as possible, 
                    even if you can only afford small amounts initially.
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
                  Smart Savings Strategies for {currentCountryName}
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Emergency Fund First</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Before focusing on long-term growth, ensure you have 3-6 months of expenses saved in an easily 
                      accessible account. This prevents you from dipping into long-term investments during emergencies.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Automate Your Savings</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Set up automatic transfers to your savings and investment accounts. This "pay yourself first" 
                      approach ensures consistent contributions without relying on willpower or memory.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Diversify Your Growth</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Don't put all your savings in one place. Consider a mix of high-yield savings accounts, 
                      index funds, bonds, and other investment vehicles based on your timeline and risk tolerance.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInY(0.4, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Users className="w-8 h-8 text-rose-600 dark:text-rose-400 mr-3" />
                  Understanding Inflation and Real Returns
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What is Inflation?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Inflation is the general increase in prices over time, which reduces the purchasing power of your money. 
                      In {currentCountryName}, historical inflation rates have averaged around 2-4% annually, though this can vary 
                      significantly based on economic conditions.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real vs Nominal Returns</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Your "real return" is your investment return minus inflation. If your savings earn 7% annually but inflation 
                      is 3%, your real return is 4%. This is why it's crucial to invest in assets that can outpace inflation over time, 
                      rather than keeping all your money in low-yield savings accounts.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Protecting Your Purchasing Power</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Our calculator includes inflation adjustment to show you both the nominal future value of your savings and 
                      the real purchasing power. This helps you set more realistic savings goals and choose investment strategies 
                      that maintain and grow your wealth in real terms.
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
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How often should interest compound for maximum growth?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      More frequent compounding generally leads to higher returns, but the difference diminishes as frequency increases. 
                      Daily compounding is only slightly better than monthly compounding. Focus more on the interest rate and consistency 
                      of contributions rather than compounding frequency.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What's a realistic annual return expectation?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Historical stock market returns in {currentCountryName} have averaged 7-10% annually over long periods, but include 
                      significant volatility. Conservative savings accounts might earn 1-3%, while balanced portfolios might target 5-7%. 
                      Your expected return should match your risk tolerance and investment timeline.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Should I prioritize paying off debt or saving?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Generally, pay off high-interest debt (like credit cards) before focusing on savings, since debt interest rates 
                      often exceed what you can earn safely. However, always maintain a small emergency fund and take advantage of 
                      any employer retirement plan matching, as this is "free money."
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How accurate are these projections?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Our calculator provides mathematical projections based on your inputs, but real-world returns vary due to market 
                      fluctuations, economic changes, and other factors. Use these projections as a planning tool, but review and adjust 
                      your strategy regularly based on actual performance and changing circumstances.
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
                    Important Investment Disclaimer
                  </h3>
                  <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none">
                    <p className="mb-3">
                      This savings calculator provides mathematical projections based on your inputs and assumed rates of return. 
                      These calculations are for educational and planning purposes only and should not be considered as investment advice 
                      or guarantees of future performance.
                    </p>
                    <p className="mb-3">
                      Actual investment returns vary due to market volatility, economic conditions, fees, taxes, and other factors not 
                      captured in these calculations. Past performance does not guarantee future results. Investment values can go up or down.
                    </p>
                    <p className="font-semibold text-amber-600 dark:text-amber-400">
                      Always consult with qualified financial advisors for personalized investment advice. Consider your risk tolerance, 
                      investment timeline, and financial goals before making investment decisions. This tool should supplement, 
                      not replace, professional financial guidance.
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

export default SavingsCalculator;