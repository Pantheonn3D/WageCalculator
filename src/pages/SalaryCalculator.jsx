import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Download, Share2, Info } from 'lucide-react';
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
const WEEKDAY_OCCURRENCE_FACTOR_FOR_HOLIDAYS = 0.75; // Approx. percentage of holidays falling on weekdays

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
    setResults(null); // Clear results when country changes, debounced effect will recalc if salary exists
  }, [selectedCountry, getCountrySpecificDefault]);

  const performCalculation = useCallback(() => {
    if (!formData.salary || isNaN(parseFloat(formData.salary)) || !selectedCountry || !countries[selectedCountry]) {
      setResults(null); // Clear results if input becomes invalid
      return;
    }
    
    setIsCalculating(true);

    try {
      const salaryInput = parseFloat(formData.salary) || 0;
      // Use form values first, then country defaults, then hardcoded defaults
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
      const weekendsInYear = (totalDaysInYear / 7) * 2; // More dynamic average
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
          ...taxInfo, // Includes totalTax and detailed breakdown if available from calculateTax
          breakdown: { // Ensure these are explicitly mapped or are part of taxInfo
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
  }, [formData, selectedCountry, countries, getCountrySpecificDefault]); // `countries` is needed for currency, `getCountrySpecificDefault` for fallbacks

  useEffect(() => {
    if (formData.salary && !isNaN(parseFloat(formData.salary))) {
      const timer = setTimeout(() => {
        performCalculation();
      }, DEBOUNCE_DELAY_MS);
      return () => clearTimeout(timer);
    } else if (results !== null) { // Clear results if salary becomes invalid
        setResults(null);
    }
    // Explicitly list primitive dependencies from formData for finer control if needed,
    // but performCalculation already depends on the whole formData object.
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
        countryCode: selectedCountry, // Added country code
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
    const shareUrl = window.location.href; // Or a specific results URL if you implement that

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
    provider: { // TODO: Replace "Your Awesome Company" with your actual provider name
        "@type": "Organization",
        "name": "Your Awesome Company" 
    }
  }), [currentCountryName]);


  return (
    <>
      <SEOHead
        title={`Salary Calculator for ${currentCountryName} - After Tax Income`}
        description={`Estimate your take-home pay in ${currentCountryName} after taxes. Convert annual, monthly, weekly, or hourly wages to net salary. Includes tax breakdown.`}
        keywords={`salary calculator ${currentCountryName}, net pay ${currentCountryName}, take home pay ${currentCountryName}, after tax salary ${currentCountryName}, income tax calculator ${currentCountryName}, wage calculator ${currentCountryName}`}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-12"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Calculator className="w-8 h-8 md:w-9 md:h-9 text-primary-600 dark:text-primary-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Salary Calculator
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Estimate your net salary after taxes and deductions for {currentCountryName}.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }} // Adjusted delay
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-b dark:border-neutral-700 pb-3">
                  Enter Salary Details
                </h2>

                <div className="space-y-5"> {/* Increased spacing slightly */}
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Salary Amount ({currentCurrencySymbol})
                    </label>
                    <input
                      id="salary"
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="e.g., 50000"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-neutral-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="payPeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pay Period
                    </label>
                    <select
                      id="payPeriod"
                      name="payPeriod"
                      value={formData.payPeriod}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-neutral-700 dark:text-white"
                    >
                      <option key="annual" value="annual">Annual</option>
                      <option key="monthly" value="monthly">Monthly</option>
                      <option key="weekly" value="weekly">Weekly</option>
                      <option key="hourly" value="hourly">Hourly</option>
                    </select>
                  </div>

                  {/* Other input fields follow the same pattern with dark mode styles */}
                  {/* Work Hours */}
                  <div>
                    <label htmlFor="workHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Work Hours per Week
                    </label>
                    <input id="workHours" type="number" name="workHours" value={formData.workHours} onChange={handleInputChange} min="1" max="168" className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-neutral-700 dark:text-white" />
                  </div>

                  {/* Vacation Days */}
                  <div>
                    <label htmlFor="vacationDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Vacation Days per Year
                    </label>
                    <input id="vacationDays" type="number" name="vacationDays" value={formData.vacationDays} onChange={handleInputChange} min="0" max="365" className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-neutral-700 dark:text-white" />
                  </div>

                  {/* Public Holidays */}
                  <div>
                    <label htmlFor="publicHolidays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Public Holidays per Year
                    </label>
                    <input id="publicHolidays" type="number" name="publicHolidays" value={formData.publicHolidays} onChange={handleInputChange} min="0" max="365" className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-neutral-700 dark:text-white" />
                  </div>
                  
                  {/* Bonus */}
                   <div>
                    <label htmlFor="bonus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Annual Bonus (Optional)
                    </label>
                    <input id="bonus" type="number" name="bonus" value={formData.bonus} onChange={handleInputChange} placeholder="0" min="0" className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-neutral-700 dark:text-white" />
                  </div>

                  {/* Overtime Amount */}
                  <div>
                    <label htmlFor="overtimeAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Annual Overtime Pay (Optional)
                    </label>
                    <input id="overtimeAmount" type="number" name="overtimeAmount" value={formData.overtimeAmount} onChange={handleInputChange} placeholder="0" min="0" className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-neutral-700 dark:text-white" />
                  </div>

                  {/* Deductions */}
                  <div>
                    <label htmlFor="deductions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Additional Voluntary Deductions (Annual)
                    </label>
                    <input id="deductions" type="number" name="deductions" value={formData.deductions} onChange={handleInputChange} placeholder="0" min="0" className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-neutral-700 dark:text-white" />
                  </div>
                </div>

                {results && (
                  <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"> {/* Adjusted for better stacking on mobile */}
                    <button
                      onClick={exportResults}
                      aria-label="Export salary calculation results as JSON file"
                      className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Download className="w-5 h-5 mr-2 -ml-1" />
                      Export JSON
                    </button>
                    <button
                      onClick={shareResults}
                      aria-label="Share salary calculation results"
                      className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
                    >
                      <Share2 className="w-5 h-5 mr-2 -ml-1" />
                      Share
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }} // Adjusted delay
              className="lg:col-span-2"
            >
              {isCalculating ? (
                <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-center" style={{minHeight: '300px'}}>
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
                  <p className="ml-4 mt-4 text-gray-700 dark:text-gray-300">Calculating your salary...</p>
                </div>
              ) : results ? (
                <div className="space-y-6">
                  <SalaryBreakdown results={results} countryCurrency={currentCurrencySymbol} />
                  <SalaryChart results={results} countryCurrency={currentCurrencySymbol} />
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400" style={{minHeight: '300px'}}>
                  <Calculator className="w-16 h-16 mb-4 text-gray-300 dark:text-neutral-600" />
                  <p className="text-lg">Enter your salary information to see the breakdown.</p>
                  <p className="text-sm mt-1">Results will appear here once calculated.</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }} // Adjusted delay
            className="mt-12 md:mt-16"
          >
            <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6 md:p-8">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    About This Calculator & Disclaimer
                  </h3>
                  <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none">
                    <p>
                      This salary calculator estimates your net (take-home) pay for{' '}
                      {currentCountryName} by considering common income taxes and mandatory social contributions based on the data in our system.
                    </p>
                    <p className="mt-2">
                      <strong>The calculations include:</strong>
                    </p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>Gross salary conversion between annual, monthly, weekly, and hourly rates.</li>
                      <li>Estimation of major income taxes (e.g., federal, state/provincial if applicable).</li>
                      <li>Estimation of key social security contributions (e.g., pension, health, unemployment).</li>
                      <li>Working days and hours calculation accounting for weekends, holidays, and vacation.</li>
                      <li>Effective and marginal tax rate calculations for a better understanding of your tax burden.</li>
                    </ul>
                    <p className="mt-3 font-semibold text-red-600 dark:text-red-400">
                      Disclaimer: The figures provided are estimates based on generalized tax data and do not account for all possible deductions, credits, specific regional variations, marital status, dependents, or other personal financial circumstances. Tax laws are complex and change frequently. This tool is for informational purposes only and should not be considered financial or tax advice. Always consult with a qualified financial advisor or tax professional for personalized advice relevant to your specific situation.
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

export default SalaryCalculator;