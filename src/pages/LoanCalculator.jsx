import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CreditCard, Download, Share2, Info, DollarSign, TrendingUp, 
  Clock, Award, Users, CheckCircle, ArrowRight, BookOpen,
  Target, PieChart, BarChart3, Zap, Shield, Globe, Home,
  Calculator, Car, GraduationCap, Building
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { useRegion } from '../context/RegionContext';
import LoanBreakdown from '../components/calculators/LoanBreakdown';
import LoanChart from '../components/calculators/LoanChart';

// Constants
const DEFAULT_LOAN_AMOUNT = '250000';
const DEFAULT_INTEREST_RATE = '4.5';
const DEFAULT_LOAN_TERM = '30';
const DEFAULT_DOWN_PAYMENT = '50000';
const DEBOUNCE_DELAY_MS = 300;

const FEATURED_BENEFITS = [
  "Instant amortization schedules",
  "Multiple loan type support", 
  "Interactive payment charts",
  "Export detailed reports"
];

const LOAN_TYPES = [
  { 
    value: 'mortgage', 
    label: 'Mortgage Loan', 
    icon: Home,
    description: 'Home purchase and refinancing loans'
  },
  { 
    value: 'auto', 
    label: 'Auto Loan', 
    icon: Car,
    description: 'Vehicle financing and car loans'
  },
  { 
    value: 'personal', 
    label: 'Personal Loan', 
    icon: DollarSign,
    description: 'Unsecured personal financing'
  },
  { 
    value: 'student', 
    label: 'Student Loan', 
    icon: GraduationCap,
    description: 'Education financing options'
  }
];

const RELATED_TOOLS = [
  { title: 'Mortgage Calculator', href: '/mortgage-calculator', icon: Home, description: 'Specialized mortgage payment calculator' },
  { title: 'Auto Loan Calculator', href: '/auto-loan-calculator', icon: Car, description: 'Vehicle loan payment calculator' },
  { title: 'Refinance Calculator', href: '/refinance-calculator', icon: Building, description: 'Compare refinancing options' },
  { title: 'Debt Consolidation', href: '/debt-calculator', icon: Target, description: 'Consolidate multiple debts' }
];

const CALCULATION_FEATURES = [
  { icon: Zap, title: 'Real-Time Results', description: 'Get instant loan calculations as you adjust parameters' },
  { icon: Globe, title: 'Multi-Currency', description: 'Calculate loans in your local currency with region-specific rates' },
  { icon: Shield, title: 'Secure & Private', description: 'All calculations are performed locally - your data never leaves your device' },
  { icon: Award, title: 'Professional Accuracy', description: 'Bank-grade calculations trusted by financial professionals' }
];

const LoanCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion();
  
  const [formData, setFormData] = useState({
    loanAmount: DEFAULT_LOAN_AMOUNT,
    interestRate: DEFAULT_INTEREST_RATE,
    loanTerm: DEFAULT_LOAN_TERM,
    downPayment: DEFAULT_DOWN_PAYMENT,
    extraPayment: '0',
    propertyTax: '3000',
    insurance: '1200',
    pmi: '0',
    loanType: 'mortgage'
  });
  
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateLoan = useCallback(async () => {
    if (!formData.loanAmount || !formData.interestRate || !formData.loanTerm) {
      setResults(null);
      return;
    }

    setIsCalculating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing
      
      const loanAmount = parseFloat(formData.loanAmount) || 0;
      const downPayment = parseFloat(formData.downPayment) || 0;
      const principal = loanAmount - downPayment;
      const annualRate = parseFloat(formData.interestRate) / 100 || 0;
      const monthlyRate = annualRate / 12;
      const loanTermYears = parseFloat(formData.loanTerm) || 30;
      const totalPayments = loanTermYears * 12;
      const extraPayment = parseFloat(formData.extraPayment) || 0;
      const propertyTax = parseFloat(formData.propertyTax) || 0;
      const insurance = parseFloat(formData.insurance) || 0;
      const pmi = parseFloat(formData.pmi) || 0;

      // Calculate monthly payment using formula: M = P[r(1+r)^n]/[(1+r)^n-1]
      let monthlyPayment = 0;
      if (monthlyRate > 0) {
        monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                        (Math.pow(1 + monthlyRate, totalPayments) - 1);
      } else {
        monthlyPayment = principal / totalPayments;
      }

      const monthlyTaxInsurance = (propertyTax + insurance) / 12;
      const totalMonthlyPayment = monthlyPayment + monthlyTaxInsurance + pmi + extraPayment;

      // Calculate amortization schedule
      const schedule = [];
      let remainingBalance = principal;
      let totalInterestPaid = 0;
      let totalPrincipalPaid = 0;
      let paymentNumber = 0;

      while (remainingBalance > 0.01 && paymentNumber < totalPayments) {
        paymentNumber++;
        const interestPayment = remainingBalance * monthlyRate;
        let principalPayment = monthlyPayment - interestPayment + extraPayment;
        
        if (principalPayment > remainingBalance) {
          principalPayment = remainingBalance;
        }

        remainingBalance -= principalPayment;
        totalInterestPaid += interestPayment;
        totalPrincipalPaid += principalPayment;

        schedule.push({
          payment: paymentNumber,
          principalPayment,
          interestPayment,
          totalPayment: principalPayment + interestPayment,
          remainingBalance,
          cumulativeInterest: totalInterestPaid,
          cumulativePrincipal: totalPrincipalPaid
        });
      }

      const totalAmount = totalPrincipalPaid + totalInterestPaid;
      const interestSaved = extraPayment > 0 ? 
        (principal * Math.pow(1 + monthlyRate, totalPayments) - principal) - totalInterestPaid : 0;
      const timeSaved = totalPayments - paymentNumber;

      // Yearly summary for charts
      const yearlyData = [];
      for (let year = 1; year <= Math.ceil(paymentNumber / 12); year++) {
        const yearStart = (year - 1) * 12;
        const yearEnd = Math.min(year * 12, paymentNumber);
        const yearPayments = schedule.slice(yearStart, yearEnd);
        
        if (yearPayments.length > 0) {
          const yearInterest = yearPayments.reduce((sum, p) => sum + p.interestPayment, 0);
          const yearPrincipal = yearPayments.reduce((sum, p) => sum + p.principalPayment, 0);
          const endBalance = yearPayments[yearPayments.length - 1].remainingBalance;
          
          yearlyData.push({
            year,
            interest: yearInterest,
            principal: yearPrincipal,
            balance: endBalance,
            cumulativeInterest: yearPayments[yearPayments.length - 1].cumulativeInterest
          });
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
      };

      setResults(calculations);
    } catch (error) {
      console.error('Loan calculation error:', error);
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  }, [formData]);

  useEffect(() => {
    if (formData.loanAmount && formData.interestRate && formData.loanTerm) {
      const timer = setTimeout(() => {
        calculateLoan();
      }, DEBOUNCE_DELAY_MS);
      return () => clearTimeout(timer);
    } else {
      setResults(null);
    }
  }, [formData, calculateLoan]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const exportResults = () => {
    if (!results || !selectedCountry || !countries[selectedCountry]) return;

    const countryData = countries[selectedCountry];
    const dataToExport = {
      calculationInput: {
        countryCode: selectedCountry,
        countryName: countryData.name,
        currency: countryData.currency,
        ...formData,
        calculationDate: new Date().toISOString()
      },
      calculationOutput: {
        ...results,
        summary: {
          monthlyPayment: results.loan.monthlyPayment,
          totalInterest: results.loan.totalInterest,
          totalAmount: results.loan.totalAmount,
          payoffTime: `${Math.floor(results.loan.payoffTime / 12)} years, ${results.loan.payoffTime % 12} months`
        }
      }
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loan-calculation-${formData.loanType}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (!results || !selectedCountry || !countries[selectedCountry]) return;

    const countryData = countries[selectedCountry];
    const shareText = `Loan Calculation Results (${formData.loanType})\nLoan Amount: ${formatCurrency(results.loan.amount, countryData.currency)}\nMonthly Payment: ${formatCurrency(results.loan.monthlyPayment, countryData.currency)}\nTotal Interest: ${formatCurrency(results.loan.totalInterest, countryData.currency)}\nPayoff Time: ${Math.floor(results.loan.payoffTime / 12)} years, ${results.loan.payoffTime % 12} months`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${formData.loanType.charAt(0).toUpperCase() + formData.loanType.slice(1)} Loan Calculation`,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        try {
          await navigator.clipboard.writeText(`${shareText}\n\nCalculate yours: ${window.location.href}`);
          alert('Results copied to clipboard!');
        } catch (clipboardError) {
          console.log('Share and clipboard failed:', error, clipboardError);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\nCalculate yours: ${window.location.href}`);
        alert('Results copied to clipboard!');
      } catch (clipboardError) {
        console.log('Clipboard failed:', clipboardError);
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
    "name": `Loan Calculator - ${currentCountryName}`,
    "description": `Calculate loan payments, amortization schedules, and total interest for mortgages, auto loans, and personal loans in ${currentCountryName}. Free online loan calculator with detailed payment breakdown.`,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript.",
    "featureList": [
      "Loan Payment Calculation",
      "Amortization Schedule Generation", 
      "Interest Calculation",
      "Multiple Loan Types (Mortgage, Auto, Personal, Student)",
      "Extra Payment Analysis",
      "Payment Breakdown Visualization",
      "Export Functionality",
      "Multi-Currency Support"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0"
    },
    "provider": {
      "@type": "Organization",
      "name": "LoanCalculator"
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
        title={`Free Loan Calculator ${currentCountryName} 2024 - Mortgage & Personal Loan Payment Calculator`}
        description={`Calculate loan payments and amortization schedules for mortgages, auto loans, and personal loans in ${currentCountryName}. Free online calculator with detailed payment breakdown, interest analysis, and export features.`}
        keywords={`loan calculator ${currentCountryName}, mortgage calculator ${currentCountryName}, auto loan calculator ${currentCountryName}, personal loan calculator ${currentCountryName}, loan payment calculator ${currentCountryName}, amortization calculator ${currentCountryName}, interest calculator ${currentCountryName}, loan amortization schedule ${currentCountryName}, monthly payment calculator ${currentCountryName}, free loan calculator, online loan calculator`}
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
                <CreditCard className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  Loan Calculator
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Calculate loan payments, analyze amortization schedules, and compare loan options for mortgages, 
                auto loans, and personal financing in {currentCountryName}.
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

        {/* Loan Type Selection */}
        <section className="py-8 -mt-8 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {LOAN_TYPES.map((type, index) => {
                const Icon = type.icon;
                return (
                  <motion.button
                    key={type.value}
                    variants={fadeInY(0.1 + index * 0.05, 0.4)}
                    initial="initial"
                    animate="animate"
                    onClick={() => setFormData(prev => ({ ...prev, loanType: type.value }))}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 text-center group ${
                      formData.loanType === type.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                        : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${
                      formData.loanType === type.value 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-400 group-hover:text-primary-500'
                    }`} />
                    <h3 className={`font-semibold text-sm ${
                      formData.loanType === type.value
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {type.label}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {type.description}
                    </p>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Main Calculator Section */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-neutral-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Calculator className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
                    Loan Details
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="loanAmount" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Loan Amount ({currentCurrencySymbol})
                      </label>
                      <input
                        id="loanAmount"
                        type="number"
                        name="loanAmount"
                        value={formData.loanAmount}
                        onChange={handleInputChange}
                        placeholder="250000"
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="downPayment" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Down Payment ({currentCurrencySymbol})
                      </label>
                      <input
                        id="downPayment"
                        type="number"
                        name="downPayment"
                        value={formData.downPayment}
                        onChange={handleInputChange}
                        placeholder="50000"
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="interestRate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Interest Rate (%)
                        </label>
                        <input
                          id="interestRate"
                          type="number"
                          name="interestRate"
                          value={formData.interestRate}
                          onChange={handleInputChange}
                          placeholder="4.5"
                          step="0.01"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label htmlFor="loanTerm" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Loan Term (Years)
                        </label>
                        <input
                          id="loanTerm"
                          type="number"
                          name="loanTerm"
                          value={formData.loanTerm}
                          onChange={handleInputChange}
                          placeholder="30"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="extraPayment" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Extra Monthly Payment ({currentCurrencySymbol})
                      </label>
                      <input
                        id="extraPayment"
                        type="number"
                        name="extraPayment"
                        value={formData.extraPayment}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                      />
                    </div>

                    {formData.loanType === 'mortgage' && (
                      <div className="space-y-4 border-t dark:border-neutral-600 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Costs</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="propertyTax" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Annual Property Tax
                            </label>
                            <input
                              id="propertyTax"
                              type="number"
                              name="propertyTax"
                              value={formData.propertyTax}
                              onChange={handleInputChange}
                              placeholder="3000"
                              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label htmlFor="insurance" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Annual Insurance
                            </label>
                            <input
                              id="insurance"
                              type="number"
                              name="insurance"
                              value={formData.insurance}
                              onChange={handleInputChange}
                              placeholder="1200"
                              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="pmi" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Monthly PMI ({currentCurrencySymbol})
                          </label>
                          <input
                            id="pmi"
                            type="number"
                            name="pmi"
                            value={formData.pmi}
                            onChange={handleInputChange}
                            placeholder="0"
                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {results && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
                    >
                      <button
                        onClick={exportResults}
                        aria-label="Export loan calculation results"
                        className="flex-1 inline-flex justify-center items-center px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Export
                      </button>
                      <button
                        onClick={shareResults}
                        aria-label="Share loan calculation results"
                        className="flex-1 inline-flex justify-center items-center px-4 py-3 border-2 border-transparent shadow-sm text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 transition-all duration-200"
                      >
                        <Share2 className="w-5 h-5 mr-2" />
                        Share
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-2"
              >
                {isCalculating ? (
                  <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 dark:border-primary-400 mb-6"></div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Calculating Your Loan</h3>
                    <p className="text-gray-500 dark:text-gray-400">Generating amortization schedule and payment breakdown...</p>
                  </div>
                ) : results ? (
                  <div className="space-y-6">
                    <LoanBreakdown results={results} />
                    <LoanChart results={results} />
                  </div>
                ) : (
                  <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                    <CreditCard className="w-20 h-20 mb-6 text-gray-300 dark:text-neutral-600" />
                    <h3 className="text-2xl font-semibold mb-2">Ready to Calculate</h3>
                    <p className="text-lg mb-4">Enter your loan information to see payment breakdown</p>
                    <p className="text-sm">Results will include monthly payments, total interest, and amortization schedule</p>
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
                Advanced Loan Calculation Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Professional-grade loan calculator with comprehensive analysis tools for informed financial decisions.
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
                Explore More Loan Calculators
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Specialized calculators for different types of loans and financial scenarios.
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
                Complete Loan Calculation Guide for {currentCountryName}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Master loan calculations and make informed borrowing decisions with our comprehensive guide to understanding 
                loan payments, interest calculations, and amortization schedules in {currentCountryName}.
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
                  <Calculator className="w-8 h-8 text-primary-600 dark:text-primary-400 mr-3" />
                  Understanding Loan Calculations and Amortization
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Loan calculations involve complex mathematical formulas that determine your monthly payment, total interest paid, 
                  and how each payment is split between principal and interest. Understanding these calculations helps you make 
                  informed decisions about loan terms, down payments, and extra payment strategies.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The standard loan payment formula considers your loan amount (principal), interest rate, and loan term to calculate 
                  a fixed monthly payment. In {currentCountryName}, interest rates vary based on loan type, credit score, down payment, 
                  and current market conditions. Our calculator uses these inputs to generate accurate payment estimates and complete 
                  amortization schedules.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Amortization schedules show how your loan balance decreases over time, with early payments consisting mostly of 
                  interest and later payments applying more toward principal. This front-loaded interest structure means that extra 
                  payments made early in the loan term can result in significant interest savings over the life of the loan.
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
                    <Home className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                    Mortgage Loan Calculations
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Mortgage calculations in {currentCountryName} include principal and interest payments plus additional costs like 
                    property taxes, homeowners insurance, and private mortgage insurance (PMI). These additional costs significantly 
                    impact your total monthly housing payment.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Down payment amount affects your loan-to-value ratio, which influences interest rates and PMI requirements. 
                    Most conventional loans require PMI when down payment is less than 20% of the home's purchase price.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Car className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                    Auto Loan Considerations
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Auto loans typically have shorter terms than mortgages, usually ranging from 3-7 years. Shorter terms mean 
                    higher monthly payments but less total interest paid. Vehicle depreciation should be considered alongside 
                    loan terms to avoid being underwater on the loan.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Interest rates for auto loans in {currentCountryName} vary based on new vs. used vehicles, loan term, and 
                    borrower creditworthiness. New car loans typically offer lower rates than used car financing.
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
                  <TrendingUp className="w-8 h-8 text-amber-600 dark:text-amber-400 mr-3" />
                  Interest Rate Types and Impact on Payments
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Fixed Interest Rates</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Fixed rates remain constant throughout the loan term, providing predictable monthly payments. This stability 
                      makes budgeting easier but may result in higher initial rates compared to adjustable options.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Variable Interest Rates</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Variable rates can change based on market conditions, potentially lowering payments when rates decrease 
                      but increasing risk when rates rise. Initial rates are often lower than fixed alternatives.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Rate Impact on Costs</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Even small rate differences compound significantly over long loan terms. A 0.5% rate difference on a 
                      30-year mortgage can result in thousands of dollars in additional or saved interest payments.
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
                  <Target className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
                  Strategies for Loan Optimization
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Extra Payment Strategies</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Making additional principal payments can dramatically reduce total interest costs and shorten loan terms. 
                      Even small extra payments applied consistently can save thousands of dollars and years off your loan. 
                      Consider making one extra payment per year, bi-weekly payments, or adding a fixed amount to monthly payments.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Refinancing Opportunities</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Refinancing can lower monthly payments or reduce total interest costs when rates drop or credit improves. 
                      Consider refinancing costs against potential savings to determine if refinancing makes financial sense. 
                      In {currentCountryName}, typical refinancing costs include application fees, appraisal costs, and closing expenses.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Down Payment Optimization</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Larger down payments reduce loan amounts, eliminate PMI requirements, and often qualify for better interest rates. 
                      However, consider opportunity costs of using large cash amounts versus investing those funds elsewhere. 
                      Balance loan costs against investment potential and liquidity needs.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInY(0.5, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Shield className="w-8 h-8 text-red-600 dark:text-red-400 mr-3" />
                  Understanding Loan Costs and Fees
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Total Cost of Borrowing</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      The true cost of a loan extends beyond monthly payments to include origination fees, closing costs, insurance 
                      requirements, and total interest paid over the loan term. Annual Percentage Rate (APR) provides a more 
                      comprehensive cost comparison by including most loan fees in the calculation.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Hidden Fees and Costs</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Common loan fees in {currentCountryName} include application fees, origination fees, underwriting fees, 
                      appraisal costs, and title insurance. Some lenders offer "no-fee" loans but often compensate with higher 
                      interest rates. Always compare total costs, not just interest rates or monthly payments.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Prepayment Penalties</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Some loans include prepayment penalties that charge fees for paying off loans early or making large extra 
                      payments. These penalties can offset benefits of refinancing or extra payments. Always review loan terms 
                      for prepayment restrictions before committing to a loan agreement.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInY(0.6, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-gray-100 dark:bg-neutral-700 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How accurate are loan calculator results?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Our loan calculator provides highly accurate estimates based on standard amortization formulas used by financial 
                      institutions. Results match bank calculations for principal and interest payments. However, actual loan terms 
                      may include additional fees, insurance requirements, or rate adjustments not reflected in basic calculations.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What's the difference between APR and interest rate?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Interest rate is the cost of borrowing the principal amount, while APR (Annual Percentage Rate) includes the 
                      interest rate plus additional loan costs like origination fees, points, and other charges. APR provides a 
                      more accurate comparison tool when evaluating different loan offers.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How do extra payments affect my loan?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Extra payments applied to principal reduce the loan balance faster, resulting in less interest charged over 
                      the remaining term. This can significantly shorten the loan term and reduce total interest costs. Our calculator 
                      shows exactly how much you can save with different extra payment amounts.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Should I choose a shorter or longer loan term?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Shorter terms mean higher monthly payments but less total interest paid and faster equity building. Longer 
                      terms reduce monthly payments but increase total interest costs. Choose based on your monthly budget, long-term 
                      financial goals, and other investment opportunities for the payment difference.
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

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="py-12 bg-gray-100 dark:bg-neutral-800"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-neutral-700 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-neutral-600">
              <div className="flex items-start space-x-4">
                <Info className="w-8 h-8 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Important Information About Loan Calculations
                  </h3>
                  <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none">
                    <p className="mb-3">
                      This loan calculator provides estimates based on standard amortization formulas and typical loan structures 
                      in {currentCountryName}. Results are for informational purposes and should not replace professional financial advice.
                    </p>
                    <p className="mb-3">
                      Actual loan terms may vary based on creditworthiness, market conditions, lender policies, and specific loan 
                      products. Interest rates, fees, and approval requirements change frequently and vary between financial institutions.
                    </p>
                    <p className="mb-3">
                      Additional costs such as closing fees, insurance requirements, taxes, and other charges are not included in 
                      basic payment calculations. Consult with qualified loan officers and financial advisors for comprehensive 
                      loan analysis and personalized recommendations.
                    </p>
                    <p className="font-semibold text-amber-600 dark:text-amber-400">
                      Always compare multiple loan offers and read all loan documents carefully before making borrowing decisions. 
                      This calculator should supplement, not replace, professional guidance for significant financial commitments.
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

export default LoanCalculator;