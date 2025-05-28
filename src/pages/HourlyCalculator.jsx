import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Clock, Download, Share2, Info, DollarSign, TrendingUp, 
  Calculator, Award, Users, CheckCircle, ArrowRight, BookOpen,
  Target, PieChart, BarChart3, Zap, Shield, Globe
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { useRegion } from '../context/RegionContext';
import { calculateTax, getEffectiveTaxRate, getMarginalTaxRate } from '../utils/taxCalculations';
import HourlyBreakdown from '../components/calculators/HourlyBreakdown';
import HourlyChart from '../components/calculators/HourlyChart';

// Constants
const DEFAULT_HOURS_PER_WEEK = 40;
const DEFAULT_WEEKS_PER_YEAR = 52;
const DEFAULT_OVERTIME_RATE_MULTIPLIER = 1.5;
const DEFAULT_VACATION_WEEKS = 2;
const DEBOUNCE_DELAY_MS = 500;

const FEATURED_BENEFITS = [
  "Real-time hourly calculations",
  "Overtime pay analysis",
  "Annual earnings projection", 
  "Tax-optimized results"
];

const RELATED_TOOLS = [
  { title: 'Salary Calculator', href: '/salary-calculator', icon: Calculator, description: 'Convert annual salary to hourly rates' },
  { title: 'Tax Calculator', href: '/tax-calculator', icon: BarChart3, description: 'Detailed tax analysis and planning' },
  { title: 'Budget Planner', href: '/budget-calculator', icon: PieChart, description: 'Plan your monthly budget effectively' },
  { title: 'Savings Calculator', href: '/savings-calculator', icon: Target, description: 'Calculate savings goals and timelines' }
];

const CALCULATION_FEATURES = [
  { icon: Zap, title: 'Instant Results', description: 'Get immediate hourly-to-annual calculations with real-time updates' },
  { icon: Globe, title: 'Multi-Country Support', description: 'Accurate wage calculations for different countries and tax systems' },
  { icon: Shield, title: 'Privacy First', description: 'All calculations happen locally - your wage information stays private' },
  { icon: Award, title: 'Professional Accuracy', description: 'Trusted by HR departments and payroll professionals worldwide' }
];

const HourlyCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion();

  const getCountrySpecificDefault = useMemo(() => {
    return (countryCode, field, defaultValue) => {
      if (countries && countries[countryCode]) {
        if (field === 'hoursPerWeek') return countries[countryCode]?.workingHours?.standard || defaultValue;
        if (field === 'overtimeRate') return countries[countryCode]?.workingHours?.overtime || defaultValue;
      }
      return defaultValue;
    };
  }, [countries]);

  const [formData, setFormData] = useState({
    hourlyRate: '',
    hoursPerWeek: getCountrySpecificDefault(selectedCountry, 'hoursPerWeek', DEFAULT_HOURS_PER_WEEK).toString(),
    weeksPerYear: DEFAULT_WEEKS_PER_YEAR.toString(),
    overtimeHours: '0',
    overtimeRate: getCountrySpecificDefault(selectedCountry, 'overtimeRate', DEFAULT_OVERTIME_RATE_MULTIPLIER).toString(),
    vacationWeeks: DEFAULT_VACATION_WEEKS.toString(),
    bonus: '0',
    deductions: '0',
  });

  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      hoursPerWeek: getCountrySpecificDefault(selectedCountry, 'hoursPerWeek', DEFAULT_HOURS_PER_WEEK).toString(),
      overtimeRate: getCountrySpecificDefault(selectedCountry, 'overtimeRate', DEFAULT_OVERTIME_RATE_MULTIPLIER).toString(),
    }));
    setResults(null);
  }, [selectedCountry, getCountrySpecificDefault]);

  const performCalculation = useCallback(() => {
    if (!formData.hourlyRate || isNaN(parseFloat(formData.hourlyRate)) || !selectedCountry || !countries || !countries[selectedCountry]) {
      setResults(null);
      setIsCalculating(false);
      return;
    }
    setIsCalculating(true);
    
    try {
      const hourlyRate = parseFloat(formData.hourlyRate) || 0;
      const hoursPerWeek = parseFloat(formData.hoursPerWeek) || DEFAULT_HOURS_PER_WEEK;
      const weeksPerYear = parseFloat(formData.weeksPerYear) || DEFAULT_WEEKS_PER_YEAR;
      const overtimeHoursPerWeek = parseFloat(formData.overtimeHours) || 0;
      const overtimeRateMultiplier = parseFloat(formData.overtimeRate) || DEFAULT_OVERTIME_RATE_MULTIPLIER;
      const vacationWeeks = parseFloat(formData.vacationWeeks) || 0;
      const annualBonus = parseFloat(formData.bonus) || 0;
      const annualVoluntaryDeductions = parseFloat(formData.deductions) || 0;

      const actualWorkingWeeks = Math.max(0, weeksPerYear - vacationWeeks);
      
      const totalStandardHoursAnnual = hoursPerWeek * actualWorkingWeeks;
      const totalOvertimeHoursAnnual = overtimeHoursPerWeek * actualWorkingWeeks;
      const totalWorkedHoursAnnual = totalStandardHoursAnnual + totalOvertimeHoursAnnual;

      const standardPayAnnual = totalStandardHoursAnnual * hourlyRate;
      const totalOvertimePayAnnual = totalOvertimeHoursAnnual * hourlyRate * overtimeRateMultiplier;

      const grossAnnualIncome = standardPayAnnual + totalOvertimePayAnnual + annualBonus;
      
      const taxInfo = calculateTax(grossAnnualIncome, selectedCountry);
      const totalMandatoryDeductions = taxInfo.totalTax || 0;
      const netAnnualIncome = grossAnnualIncome - totalMandatoryDeductions - annualVoluntaryDeductions;

      const effectiveTaxRate = getEffectiveTaxRate(grossAnnualIncome, selectedCountry);
      const marginalTaxRate = getMarginalTaxRate(grossAnnualIncome, selectedCountry);

      const calculations = {
        hourly: {
          regular: hourlyRate,
          overtime: hourlyRate * overtimeRateMultiplier,
          effectiveGross: totalWorkedHoursAnnual > 0 ? grossAnnualIncome / totalWorkedHoursAnnual : 0,
          effectiveNet: totalWorkedHoursAnnual > 0 ? netAnnualIncome / totalWorkedHoursAnnual : 0,
        },
        gross: {
          annual: grossAnnualIncome,
          monthly: grossAnnualIncome / 12,
          weekly: weeksPerYear > 0 ? grossAnnualIncome / weeksPerYear : 0,
          standardPayAnnual: standardPayAnnual,
          overtimePayAnnual: totalOvertimePayAnnual,
          bonusAnnual: annualBonus,
        },
        net: {
          annual: netAnnualIncome,
          monthly: netAnnualIncome / 12,
          weekly: weeksPerYear > 0 ? netAnnualIncome / weeksPerYear : 0,
        },
        hours: {
          standardAnnual: totalStandardHoursAnnual,
          overtimeAnnual: totalOvertimeHoursAnnual,
          totalAnnual: totalWorkedHoursAnnual,
          perWeekStandard: hoursPerWeek,
          perWeekOvertime: overtimeHoursPerWeek,
          perWeekTotal: hoursPerWeek + overtimeHoursPerWeek,
        },
        taxes: {
          totalMandatory: totalMandatoryDeductions,
          effectiveRate: effectiveTaxRate,
          marginalRate: marginalTaxRate,
          breakdown: {
            federalTax: taxInfo.federalTax || 0,
            stateTax: taxInfo.stateTax || 0,
            socialSecurity: taxInfo.socialSecurity || 0,
            medicare: taxInfo.medicare || 0,
            other: taxInfo.other || 0,
          },
        },
        deductions: {
          voluntaryAnnual: annualVoluntaryDeductions,
          totalAnnual: totalMandatoryDeductions + annualVoluntaryDeductions,
        },
        schedule: {
          workingWeeksAnnual: actualWorkingWeeks,
          vacationWeeksAnnual: vacationWeeks,
          weeksPerYearTotal: weeksPerYear,
        },
      };
      setResults(calculations);
    } catch (error) {
      console.error('Hourly Calculation error:', error);
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  }, [formData, selectedCountry, countries]);

  useEffect(() => {
    if (formData.hourlyRate && !isNaN(parseFloat(formData.hourlyRate)) && countries && countries[selectedCountry]) {
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
    a.download = `hourly-calculation-${selectedCountry}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (!results || !selectedCountry || !countries || !countries[selectedCountry]) return;
    const countryData = countries[selectedCountry];
    const baseHourlyText = results.hourly && results.hourly.regular !== undefined 
        ? formatCurrency(results.hourly.regular, countryData.currency) 
        : 'N/A';

    const shareText = `Hourly Wage Calculation for ${countryData.name}:\nBase Hourly: ${baseHourlyText}\nEst. Gross Annual: ${formatCurrency(results.gross.annual, countryData.currency)}\nEst. Net Annual: ${formatCurrency(results.net.annual, countryData.currency)}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hourly Wage Calculation - ${countryData.name}`,
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
    "name": `Hourly Wage Calculator - ${currentCountryName}`,
    "description": `Calculate your annual, monthly, and weekly earnings from an hourly wage in ${currentCountryName}, including overtime pay and estimated net income after taxes.`,
    "applicationCategory": "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript.",
    "featureList": [
      "Hourly to Annual Salary Conversion", 
      "Overtime Pay Calculation", 
      "Net Income Estimation (After Tax)",
      "Multi-country Support",
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

  return (
    <>
      <SEOHead 
        title={`Free Hourly Wage Calculator ${currentCountryName} 2024 - Convert Hourly to Annual Salary`}
        description={`Calculate your annual earnings from hourly wage in ${currentCountryName}. Free hourly pay calculator with overtime, vacation pay, and accurate tax estimates. Get instant salary projections from hourly rates.`}
        keywords={`hourly wage calculator ${currentCountryName}, hourly to salary calculator ${currentCountryName}, hourly pay calculator ${currentCountryName}, overtime pay calculator ${currentCountryName}, hourly rate to annual salary ${currentCountryName}, wage calculator ${currentCountryName}, hourly income calculator ${currentCountryName}, part time salary calculator ${currentCountryName}, hourly wage converter ${currentCountryName}, freelance rate calculator ${currentCountryName}`}
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
                <Clock className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  Hourly Wage Calculator
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Convert your hourly wage to annual salary with overtime calculations and accurate tax estimates for {currentCountryName}. 
                Perfect for freelancers, part-time workers, and salary negotiations.
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
                    <Clock className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
                    Hourly Information
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="hourlyRate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Hourly Rate ({currentCurrencySymbol})
                      </label>
                      <input
                        id="hourlyRate"
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleInputChange}
                        placeholder="e.g., 25.50"
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="hoursPerWeek" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Hours per Week
                        </label>
                        <input
                          id="hoursPerWeek"
                          type="number"
                          name="hoursPerWeek"
                          value={formData.hoursPerWeek}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                          min="1"
                          max="168"
                        />
                      </div>

                      <div>
                        <label htmlFor="weeksPerYear" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Weeks per Year
                        </label>
                        <input
                          id="weeksPerYear"
                          type="number"
                          name="weeksPerYear"
                          value={formData.weeksPerYear}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                          min="1"
                          max="52"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="vacationWeeks" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Vacation Weeks
                        </label>
                        <input
                          id="vacationWeeks"
                          type="number"
                          name="vacationWeeks"
                          value={formData.vacationWeeks}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                          min="0"
                        />
                      </div>

                      <div>
                        <label htmlFor="overtimeHours" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Overtime Hours/Week
                        </label>
                        <input
                          id="overtimeHours"
                          type="number"
                          name="overtimeHours"
                          value={formData.overtimeHours}
                          onChange={handleInputChange}
                          placeholder="0"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                          step="0.5"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="overtimeRate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Overtime Multiplier
                        </label>
                        <input
                          id="overtimeRate"
                          type="number"
                          name="overtimeRate"
                          value={formData.overtimeRate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                          step="0.1"
                          min="1"
                        />
                      </div>

                      <div>
                        <label htmlFor="bonus" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Annual Bonus
                        </label>
                        <input
                          id="bonus"
                          type="number"
                          name="bonus"
                          value={formData.bonus}
                          onChange={handleInputChange}
                          placeholder="0"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="deductions" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Additional Deductions (Annual)
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

                  {results && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
                    >
                      <button
                        onClick={exportResults}
                        aria-label="Export hourly calculation results as JSON"
                        className="flex-1 inline-flex justify-center items-center px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Export JSON
                      </button>
                      <button
                        onClick={shareResults}
                        aria-label="Share hourly calculation results"
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
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Calculating Your Earnings</h3>
                    <p className="text-gray-500 dark:text-gray-400">Processing hourly rates and overtime calculations...</p>
                  </div>
                ) : results ? (
                  <div className="space-y-6">
                    <HourlyBreakdown results={results} countryCurrency={currentCurrencySymbol}/>
                    <HourlyChart results={results} countryCurrency={currentCurrencySymbol}/>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                    <Clock className="w-20 h-20 mb-6 text-gray-300 dark:text-neutral-600" />
                    <h3 className="text-2xl font-semibold mb-2">Ready to Calculate</h3>
                    <p className="text-lg mb-4">Enter your hourly wage details to see your earnings breakdown</p>
                    <p className="text-sm">Results will include annual projections, overtime analysis, and tax estimates</p>
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
                Professional Hourly Wage Calculations
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From freelancers to part-time workers, get accurate salary projections with our advanced hourly calculator.
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
                Complete Your Wage Analysis
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explore our comprehensive suite of wage and financial calculators for complete earnings analysis.
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
                The Complete Guide to Hourly Wage Calculations in {currentCountryName}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Everything you need to know about converting hourly wages to annual salaries, understanding overtime pay, 
                and maximizing your earnings potential as an hourly worker in {currentCountryName}.
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
                  <Clock className="w-8 h-8 text-primary-600 dark:text-primary-400 mr-3" />
                  Understanding Hourly Wage Calculations
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Converting hourly wages to annual salary requires more than simple multiplication. Many factors influence 
                  your actual annual earnings, including working hours per week, weeks worked per year, vacation time, 
                  overtime opportunities, and regional employment standards in {currentCountryName}.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The standard calculation assumes 40 hours per week and 52 weeks per year, totaling 2,080 hours annually. 
                  However, this rarely reflects reality for most hourly workers. Paid vacation, sick leave, public holidays, 
                  and varying weekly schedules all impact your true annual earnings potential.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Understanding these variables helps you negotiate better hourly rates, plan your finances more accurately, 
                  and make informed decisions about job opportunities. Our calculator accounts for all these factors to 
                  provide realistic earnings projections for workers in {currentCountryName}.
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
                    Overtime Pay Calculations
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Overtime pay significantly impacts your annual earnings potential. In {currentCountryName}, overtime 
                    is typically paid at 1.5 times your regular hourly rate for hours worked beyond the standard workweek.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Understanding overtime regulations in your region helps you maximize earnings and ensure fair compensation. 
                    Some industries have different overtime thresholds, and certain positions may be exempt from overtime pay entirely.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                    Tax Implications for Hourly Workers
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Hourly workers face unique tax considerations, especially when income varies significantly throughout the year. 
                    Overtime pay, bonus payments, and irregular schedules can affect your tax bracket and withholding amounts.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Planning for quarterly estimated taxes, understanding payroll deductions, and optimizing your tax 
                    withholding can help maximize your take-home pay throughout the year.
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
                  Maximizing Your Hourly Earnings
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skill Development</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Continuously developing your skills can lead to higher hourly rates and better job opportunities. 
                      Consider certifications, additional training, and specializations relevant to your field.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Strategic Overtime</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Understanding when and how to work overtime can significantly boost your annual earnings. 
                      Balance the financial benefits with work-life balance and avoid burnout.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Benefits Optimization</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Even as an hourly worker, you may have access to benefits like health insurance, retirement plans, 
                      and paid time off. Understanding and optimizing these benefits adds significant value to your compensation.
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
                  Financial Planning for Hourly Workers
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Budgeting with Variable Income</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Hourly workers often face income variability due to changing schedules, seasonal work patterns, 
                      or overtime availability. Creating a budget based on your minimum expected hours while treating 
                      overtime and extra shifts as bonus income helps maintain financial stability.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Emergency Fund Priorities</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Building an emergency fund is especially crucial for hourly workers who may face unpredictable 
                      schedule changes or reduced hours. Aim for 6-12 months of expenses rather than the standard 
                      3-6 months recommended for salaried workers, given the potential for income instability.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Retirement Planning Strategies</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Even without employer-sponsored retirement plans, hourly workers can build wealth through IRAs, 
                      Roth IRAs, and other investment vehicles. Automating savings from every paycheck, regardless of 
                      size, helps build long-term financial security.
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
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How do I calculate annual salary from hourly wage?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Multiply your hourly rate by the number of hours you work per week, then multiply by the number 
                      of weeks you work per year. For example: $20/hour × 40 hours/week × 50 weeks/year = $40,000 annually. 
                      Don't forget to account for vacation time and overtime pay.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What's considered full-time for hourly workers?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      In {currentCountryName}, full-time employment typically means working 35-40 hours per week. However, 
                      this can vary by employer and industry. Full-time status often determines eligibility for benefits 
                      like health insurance and paid time off.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How does overtime affect my taxes?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Overtime pay is taxed at the same rate as regular income, but higher paychecks may result in higher 
                      withholding percentages. This doesn't mean overtime is taxed at a higher rate - you may receive a 
                      refund when filing your annual tax return if too much was withheld.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Should I negotiate hourly rate or seek salaried positions?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      This depends on your industry, career goals, and personal preferences. Hourly positions often offer 
                      overtime pay opportunities and schedule flexibility, while salaried positions may provide more stability 
                      and comprehensive benefits. Consider total compensation, not just base pay.
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
                      This hourly wage calculator provides estimates for informational purposes only and should not be 
                      considered as professional financial or tax advice. Actual earnings may vary based on specific 
                      employment terms, local regulations, and individual circumstances.
                    </p>
                    <p className="mb-3">
                      Overtime laws, tax rates, and employment standards vary by jurisdiction within {currentCountryName}. 
                      Some positions may be exempt from overtime pay, and certain deductions or benefits may not be 
                      reflected in these calculations.
                    </p>
                    <p className="font-semibold text-amber-600 dark:text-amber-400">
                      Always consult with qualified professionals regarding employment law, tax obligations, and financial 
                      planning decisions. This tool is designed to supplement, not replace, professional guidance for 
                      important career and financial decisions.
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

export default HourlyCalculator;