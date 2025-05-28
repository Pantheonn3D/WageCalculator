import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calculator, Download, Share2, Info, DollarSign, TrendingUp, 
  Clock, Award, Users, CheckCircle, ArrowRight, BookOpen,
  Target, PieChart, BarChart3, Zap, Shield, Globe
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { useRegion } from '../context/RegionContext';
import { calculateTax, getEffectiveTaxRate, getMarginalTaxRate } from '../utils/taxCalculations';
import SalaryBreakdown from '../components/calculators/SalaryBreakdown';
import SalaryChart from '../components/calculators/SalaryChart';

// Constants
const DEFAULT_WORK_HOURS_PER_WEEK = 40;
const DEFAULT_VACATION_DAYS = 10;
const DEFAULT_PUBLIC_HOLIDAYS = 10;
const DEBOUNCE_DELAY_MS = 500;
const WEEKDAY_OCCURRENCE_FACTOR_FOR_HOLIDAYS = 0.75;

const FEATURED_BENEFITS = [
  "Instant accurate calculations",
  "Multi-currency support",
  "Tax breakdown analysis", 
  "Export and share results"
];

const RELATED_TOOLS = [
  { title: 'Hourly Calculator', href: '/hourly-calculator', icon: Clock, description: 'Convert hourly rates to annual salary' },
  { title: 'Tax Calculator', href: '/tax-calculator', icon: BarChart3, description: 'Detailed tax analysis and planning' },
  { title: 'Budget Planner', href: '/budget-calculator', icon: PieChart, description: 'Plan your monthly budget effectively' },
  { title: 'Savings Calculator', href: '/savings-calculator', icon: Target, description: 'Calculate savings goals and timelines' }
];

const CALCULATION_FEATURES = [
  { icon: Zap, title: 'Lightning Fast', description: 'Get instant results as you type with real-time calculations' },
  { icon: Globe, title: 'Global Accuracy', description: 'Precise tax rates and deductions for your specific location' },
  { icon: Shield, title: 'Privacy Protected', description: 'All calculations happen in your browser - your data stays private' },
  { icon: Award, title: 'Professional Grade', description: 'Used by HR professionals and financial advisors worldwide' }
];

const SalaryCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion();

  const getCountrySpecificDefault = useMemo(() => {
    return (countryCode, field, defaultValue) => {
      if (countries && countries[countryCode]) {
        if (field === 'workHours') {
          return countries[countryCode]?.workingHours?.standard || defaultValue;
        }
        return countries[countryCode]?.[field] || defaultValue;
      }
      return defaultValue;
    };
  }, [countries]);

  const [formData, setFormData] = useState({
    salary: '',
    payPeriod: 'annual',
    workHours: getCountrySpecificDefault(selectedCountry, 'workHours', DEFAULT_WORK_HOURS_PER_WEEK),
    vacationDays: getCountrySpecificDefault(selectedCountry, 'vacationDays', DEFAULT_VACATION_DAYS),
    publicHolidays: getCountrySpecificDefault(selectedCountry, 'holidays', DEFAULT_PUBLIC_HOLIDAYS),
    deductions: '',
    bonus: '',
    overtimeAmount: '',
  });
  
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      workHours: getCountrySpecificDefault(selectedCountry, 'workHours', DEFAULT_WORK_HOURS_PER_WEEK),
      vacationDays: getCountrySpecificDefault(selectedCountry, 'vacationDays', DEFAULT_VACATION_DAYS),
      publicHolidays: getCountrySpecificDefault(selectedCountry, 'holidays', DEFAULT_PUBLIC_HOLIDAYS),
    }));
    setResults(null);
  }, [selectedCountry, getCountrySpecificDefault]);

  const performCalculation = useCallback(() => {
    if (!formData.salary || isNaN(parseFloat(formData.salary)) || !selectedCountry || !countries[selectedCountry]) {
      setResults(null);
      return;
    }
    
    setIsCalculating(true);

    try {
      const salaryInput = parseFloat(formData.salary) || 0;
      const workHoursPerWeek = parseFloat(formData.workHours) || getCountrySpecificDefault(selectedCountry, 'workHours', DEFAULT_WORK_HOURS_PER_WEEK);
      const vacationDaysAnnual = parseFloat(formData.vacationDays) || getCountrySpecificDefault(selectedCountry, 'vacationDays', DEFAULT_VACATION_DAYS);
      const publicHolidaysAnnual = parseFloat(formData.publicHolidays) || getCountrySpecificDefault(selectedCountry, 'holidays', DEFAULT_PUBLIC_HOLIDAYS);
      const voluntaryDeductionsAnnual = parseFloat(formData.deductions) || 0;
      const bonusAnnual = parseFloat(formData.bonus) || 0;
      const overtimePayAnnual = parseFloat(formData.overtimeAmount) || 0;

      let annualSalaryFromInput = salaryInput;
      if (formData.payPeriod === 'monthly') {
        annualSalaryFromInput = salaryInput * 12;
      } else if (formData.payPeriod === 'weekly') {
        annualSalaryFromInput = salaryInput * 52;
      } else if (formData.payPeriod === 'hourly') {
        const validWorkHours = workHoursPerWeek > 0 ? workHoursPerWeek : DEFAULT_WORK_HOURS_PER_WEEK;
        annualSalaryFromInput = salaryInput * validWorkHours * 52;
      }

      const totalDaysInYear = 365.25; 
      const weekendsInYear = (totalDaysInYear / 7) * 2;
      const totalWeekdaysInYear = totalDaysInYear - weekendsInYear;
      
      const holidaysOnWeekdays = publicHolidaysAnnual * WEEKDAY_OCCURRENCE_FACTOR_FOR_HOLIDAYS;
      const vacationOnWeekdays = vacationDaysAnnual * WEEKDAY_OCCURRENCE_FACTOR_FOR_HOLIDAYS;
      
      const netWorkingDaysAnnual = Math.max(0, totalWeekdaysInYear - holidaysOnWeekdays - vacationOnWeekdays);
      
      const workingDaysPerWeek = 5; 
      const dailyHours = workHoursPerWeek > 0 ? workHoursPerWeek / workingDaysPerWeek : (DEFAULT_WORK_HOURS_PER_WEEK / workingDaysPerWeek);
      const workingHoursPerYear = Math.max(1, netWorkingDaysAnnual * dailyHours);

      const grossAnnualIncome = annualSalaryFromInput + bonusAnnual + overtimePayAnnual;
      
      const taxInfo = calculateTax(grossAnnualIncome, selectedCountry);
      const totalMandatoryDeductions = taxInfo.totalTax;
      const netAnnualIncome = grossAnnualIncome - totalMandatoryDeductions - voluntaryDeductionsAnnual;

      const effectiveTaxRate = getEffectiveTaxRate(grossAnnualIncome, selectedCountry);
      const marginalTaxRate = getMarginalTaxRate(grossAnnualIncome, selectedCountry);

      const calculations = {
        gross: {
          annual: grossAnnualIncome,
          monthly: grossAnnualIncome / 12,
          weekly: grossAnnualIncome / 52,
          daily: netWorkingDaysAnnual > 0 ? grossAnnualIncome / netWorkingDaysAnnual : 0,
          hourly: workingHoursPerYear > 0 ? grossAnnualIncome / workingHoursPerYear : 0,
        },
        net: {
          annual: netAnnualIncome,
          monthly: netAnnualIncome / 12,
          weekly: netAnnualIncome / 52,
          daily: netWorkingDaysAnnual > 0 ? netAnnualIncome / netWorkingDaysAnnual : 0,
          hourly: workingHoursPerYear > 0 ? netAnnualIncome / workingHoursPerYear : 0,
        },
        taxes: {
          ...taxInfo,
          breakdown: {
            federalTax: taxInfo.federalTax || 0,
            stateTax: taxInfo.stateTax || 0,
            socialSecurity: taxInfo.socialSecurity || 0,
            medicare: taxInfo.medicare || 0,
            other: taxInfo.other || 0,
          }
        },
        deductions: {
          mandatory: totalMandatoryDeductions,
          voluntary: voluntaryDeductionsAnnual,
          total: totalMandatoryDeductions + voluntaryDeductionsAnnual,
        },
        workInfo: {
          workingDaysPerYear: Math.round(netWorkingDaysAnnual * 100) / 100,
          workingHoursPerYear: Math.round(workingHoursPerYear * 100) / 100,
          vacationDays: vacationDaysAnnual,
          publicHolidays: publicHolidaysAnnual,
          workHoursPerWeek: workHoursPerWeek,
          effectiveTaxRate: effectiveTaxRate,
          marginalTaxRate: marginalTaxRate,
        },
      };
      setResults(calculations);
    } catch (error) {
      console.error('Calculation error:', error);
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  }, [formData, selectedCountry, countries, getCountrySpecificDefault]);

  useEffect(() => {
    if (formData.salary && !isNaN(parseFloat(formData.salary))) {
      const timer = setTimeout(() => {
        performCalculation();
      }, DEBOUNCE_DELAY_MS);
      return () => clearTimeout(timer);
    } else if (results !== null) {
        setResults(null);
    }
  }, [formData.salary, formData.payPeriod, formData.workHours, formData.vacationDays, formData.publicHolidays, formData.bonus, formData.deductions, formData.overtimeAmount, selectedCountry, performCalculation, results]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const exportResults = () => {
    if (!results || !selectedCountry || !countries[selectedCountry]) return;

    const countryData = countries[selectedCountry];
    const dataToExport = {
      calculationInput: {
        countryCode: selectedCountry,
        countryName: countryData.name,
        currency: countryData.currency,
        salary: formData.salary,
        payPeriod: formData.payPeriod,
        workHoursPerWeek: formData.workHours,
        vacationDaysAnnual: formData.vacationDays,
        publicHolidaysAnnual: formData.publicHolidays,
        annualBonus: formData.bonus,
        additionalVoluntaryDeductionsAnnual: formData.deductions,
        overtimePayAnnual: formData.overtimeAmount,
      },
      calculationOutput: {
        grossAnnual: results.gross.annual,
        grossMonthly: results.gross.monthly,
        netAnnual: results.net.annual,
        netMonthly: results.net.monthly,
        totalTaxAnnual: results.taxes.totalTax,
        taxBreakdown: results.taxes.breakdown,
        totalDeductionsAnnual: results.deductions.total,
        workSummary: results.workInfo,
        effectiveTaxRate: results.workInfo.effectiveTaxRate,
        marginalTaxRate: results.workInfo.marginalTaxRate,
      }
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salary-calculation-${selectedCountry}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (!results || !selectedCountry || !countries[selectedCountry]) return;

    const countryData = countries[selectedCountry];
    const shareText = `Salary Calculation Results for ${countryData.name}\nGross Annual: ${formatCurrency(results.gross.annual, countryData.currency)}\nNet Annual: ${formatCurrency(results.net.annual, countryData.currency)}\nEffective Tax Rate: ${results.workInfo.effectiveTaxRate.toFixed(1)}%\nMarginal Tax Rate: ${results.workInfo.marginalTaxRate.toFixed(1)}%`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Salary Calculation for ${countryData.name}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Share failed:', error);
        try {
          await navigator.clipboard.writeText(`${shareText}\n\nView calculation: ${shareUrl}`);
          alert('Results copied to clipboard! You can now paste it to share.');
        } catch (clipboardError) {
          alert('Sharing failed. Please try exporting or manually copy the page link.');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\nView calculation: ${shareUrl}`);
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
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `Salary Calculator - ${currentCountryName}`,
    description: `Calculate your net salary after taxes and deductions in ${currentCountryName}. This tool helps you understand your take-home pay by considering relevant income taxes and social contributions.`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript.",
    featureList: [
      'Gross to Net Salary Calculation',
      'Multi-country Tax Estimation',
      'Pay Period Conversion (Annual, Monthly, Weekly, Hourly)',
      'Tax Breakdown Display',
      'Work-Life Metrics (Working Days, Hours)',
      'Effective Tax Rate Calculation',
      'Marginal Tax Rate Calculation',
      'Data Export (JSON)',
      'Shareable Results',
    ],
    offers: {
        "@type": "Offer",
        "price": "0"
    },
    provider: {
        "@type": "Organization",
        "name": "WageCalculator" 
    }
  }), [currentCountryName]);

  // Animation variants
  const fadeInY = (delay = 0, duration = 0.5) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration, delay, ease: "circOut" } },
  });

  return (
    <>
      <SEOHead
        title={`Free Salary Calculator ${currentCountryName} 2024 - Net Pay After Tax Calculator`}
        description={`Calculate your exact take-home pay in ${currentCountryName} with our free salary calculator. Get accurate net salary after taxes, deductions & social contributions. Includes detailed tax breakdown for 2024.`}
        keywords={`salary calculator ${currentCountryName}, net pay calculator ${currentCountryName}, take home pay calculator ${currentCountryName}, after tax salary calculator ${currentCountryName}, income tax calculator ${currentCountryName}, wage calculator ${currentCountryName}, payroll calculator ${currentCountryName}, gross to net salary ${currentCountryName}, salary breakdown calculator ${currentCountryName}, tax deduction calculator ${currentCountryName}, free salary calculator, online paycheck calculator`}
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
                <Calculator className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  Salary Calculator
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Calculate your exact take-home pay after taxes and deductions in {currentCountryName}. 
                Get instant, accurate results with detailed breakdown.
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
                    <DollarSign className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
                    Enter Your Details
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="salary" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Salary Amount ({currentCurrencySymbol})
                      </label>
                      <input
                        id="salary"
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        placeholder="e.g., 75000"
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="payPeriod" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Pay Period
                      </label>
                      <select
                        id="payPeriod"
                        name="payPeriod"
                        value={formData.payPeriod}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                      >
                        <option value="annual">Annual</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="hourly">Hourly</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="workHours" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Hours/Week
                        </label>
                        <input 
                          id="workHours" 
                          type="number" 
                          name="workHours" 
                          value={formData.workHours} 
                          onChange={handleInputChange} 
                          min="1" 
                          max="168" 
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200" 
                        />
                      </div>

                      <div>
                        <label htmlFor="vacationDays" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Vacation Days
                        </label>
                        <input 
                          id="vacationDays" 
                          type="number" 
                          name="vacationDays" 
                          value={formData.vacationDays} 
                          onChange={handleInputChange} 
                          min="0" 
                          max="365" 
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="publicHolidays" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Public Holidays
                        </label>
                        <input 
                          id="publicHolidays" 
                          type="number" 
                          name="publicHolidays" 
                          value={formData.publicHolidays} 
                          onChange={handleInputChange} 
                          min="0" 
                          max="365" 
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200" 
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
                          min="0" 
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="overtimeAmount" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Overtime Pay
                        </label>
                        <input 
                          id="overtimeAmount" 
                          type="number" 
                          name="overtimeAmount" 
                          value={formData.overtimeAmount} 
                          onChange={handleInputChange} 
                          placeholder="0" 
                          min="0" 
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200" 
                        />
                      </div>

                      <div>
                        <label htmlFor="deductions" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Extra Deductions
                        </label>
                        <input 
                          id="deductions" 
                          type="number" 
                          name="deductions" 
                          value={formData.deductions} 
                          onChange={handleInputChange} 
                          placeholder="0" 
                          min="0" 
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200" 
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
                        aria-label="Export salary calculation results as JSON file"
                        className="flex-1 inline-flex justify-center items-center px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Export JSON
                      </button>
                      <button
                        onClick={shareResults}
                        aria-label="Share salary calculation results"
                        className="flex-1 inline-flex justify-center items-center px-4 py-3 border-2 border-transparent shadow-sm text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 transition-all duration-200"
                      >
                        <Share2 className="w-5 h-5 mr-2" />
                        Share Results
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
                {isCalculating ? (
                  <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 dark:border-primary-400 mb-6"></div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Calculating Your Salary</h3>
                    <p className="text-gray-500 dark:text-gray-400">Processing tax rates and deductions...</p>
                  </div>
                ) : results ? (
                  <div className="space-y-6">
                    <SalaryBreakdown results={results} countryCurrency={currentCurrencySymbol} />
                    <SalaryChart results={results} countryCurrency={currentCurrencySymbol} />
                  </div>
                ) : (
                  <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                    <Calculator className="w-20 h-20 mb-6 text-gray-300 dark:text-neutral-600" />
                    <h3 className="text-2xl font-semibold mb-2">Ready to Calculate</h3>
                    <p className="text-lg mb-4">Enter your salary information to see detailed breakdown</p>
                    <p className="text-sm">Results will include tax analysis, net pay, and working hours breakdown</p>
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
                Why Our Salary Calculator Stands Out
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Professional-grade accuracy meets user-friendly design. Trusted by thousands for precise salary calculations.
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
                Complete Your Financial Planning
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explore our suite of financial calculators to get a complete picture of your finances.
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
                Complete Salary Calculation Guide for {currentCountryName}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Master your financial planning with our comprehensive guide to understanding salary calculations, 
                tax implications, and take-home pay optimization in {currentCountryName}.
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
                  <DollarSign className="w-8 h-8 text-primary-600 dark:text-primary-400 mr-3" />
                  Understanding Gross vs Net Salary
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The distinction between gross and net salary is fundamental to understanding your actual earning power. 
                  Your gross salary represents your total compensation before any deductions, while your net salary 
                  (take-home pay) is what you actually receive after taxes and other mandatory deductions are subtracted.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  In {currentCountryName}, various factors influence the difference between these two figures. Income taxes, 
                  social security contributions, healthcare premiums, and other mandatory deductions can significantly 
                  reduce your gross salary. Understanding these deductions helps you make informed decisions about job offers, 
                  salary negotiations, and financial planning.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The effective tax rate in {currentCountryName} varies based on income levels, filing status, and available 
                  deductions. Higher earners typically face progressive tax rates, meaning a larger percentage of their income 
                  goes to taxes. Our salary calculator accounts for these complexities to provide accurate net pay estimates.
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
                    Tax Components in {currentCountryName}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Income taxes typically form the largest portion of deductions from your gross salary. These may include 
                    federal income taxes, state or provincial taxes (where applicable), and local taxes.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Social security systems require mandatory contributions that fund retirement benefits, disability insurance, 
                    and healthcare programs. These contributions are typically calculated as a percentage of your income up to 
                    certain thresholds.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Clock className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                    Working Hours & Pay Periods
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Accurate salary calculations require understanding how different pay periods translate to annual income. 
                    Whether you're paid hourly, weekly, bi-weekly, monthly, or annually, each structure has implications.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Converting hourly wages to annual salary involves accounting for vacation days, public holidays, sick leave, 
                    and actual working hours per week in {currentCountryName}.
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
                  Maximizing Your Take-Home Pay
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tax-Advantaged Contributions</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Contributing to employer-sponsored retirement plans or individual retirement accounts can reduce your 
                      taxable income while building long-term wealth.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Health Savings Accounts</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      HSAs and FSAs offer triple tax advantages: contributions are tax-deductible, growth is tax-free, 
                      and withdrawals for qualified expenses are tax-free.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tax Credits & Deductions</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Tax credits provide dollar-for-dollar reductions in your tax liability, while deductions reduce your 
                      taxable income. Maximizing these requires careful planning.
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
                  Financial Planning Applications
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Monthly Budget Planning</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Your net monthly income determines your spending capacity and saving potential. Use the monthly net pay 
                      figure to create realistic budgets that account for all necessary expenses while leaving room for savings 
                      and discretionary spending. The 50/30/20 rule suggests allocating 50% to needs, 30% to wants, and 20% to 
                      savings and debt repayment.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Emergency Fund Calculations</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Financial experts recommend maintaining an emergency fund covering 3-6 months of expenses. Using your net 
                      income calculations, determine how much you need to save monthly to build this safety net. Consider your 
                      job stability, industry volatility, and personal circumstances when determining the appropriate emergency 
                      fund size.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Retirement Planning Considerations</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Retirement planning requires understanding both your current income and expected future needs. Most financial 
                      advisors recommend saving 10-15% of gross income for retirement. Use the calculator to see how different 
                      contribution levels affect your take-home pay and plan accordingly for your long-term financial security.
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
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How accurate are the salary calculator results?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Our calculator provides estimates based on current tax rates and standard deductions for {currentCountryName}. 
                      While highly accurate for most situations, individual circumstances such as additional deductions, credits, 
                      or complex tax situations may cause variations. For precise calculations, consult a tax professional.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What information do I need to use the calculator?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Basic information includes your gross salary and pay period. For more accurate results, include bonus amounts, 
                      overtime pay, retirement contributions, and other voluntary deductions. The more complete your input, the more 
                      accurate your results will be.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I use this calculator for comparing job offers?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Absolutely! The calculator is excellent for comparing job offers with different salary structures, benefit 
                      packages, or locations. Compare the net pay results to understand the true value of each offer beyond just 
                      the gross salary figures.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How often should I recalculate my net pay?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Recalculate whenever your income changes, at the beginning of each tax year when rates may change, or when 
                      you modify your benefit elections. Major life changes such as marriage, children, or home purchases may also 
                      affect your calculations.
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
                      This salary calculator provides estimates based on current tax rates and standard calculations for {currentCountryName}. 
                      Results are for informational purposes only and should not be considered as professional financial or tax advice.
                    </p>
                    <p className="mb-3">
                      Individual tax situations vary significantly based on personal circumstances, deductions, credits, filing status, 
                      and other factors not captured by this calculator. Tax laws change frequently and vary by jurisdiction within {currentCountryName}.
                    </p>
                    <p className="font-semibold text-amber-600 dark:text-amber-400">
                      Always consult with qualified tax professionals or financial advisors for personalized advice regarding your 
                      specific situation. This tool should supplement, not replace, professional guidance for important financial decisions.
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

export default SalaryCalculator;