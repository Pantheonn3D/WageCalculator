import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Download, Share2, Info } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { useRegion } from '../context/RegionContext';
import { calculateTax, getEffectiveTaxRate, getMarginalTaxRate } from '../utils/taxCalculations';
import SalaryBreakdown from '../components/calculators/SalaryBreakdown';
import SalaryChart from '../components/calculators/SalaryChart';

const SalaryCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion();

  // Memoize the default value getter to prevent unnecessary re-renders
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
    workHours: getCountrySpecificDefault(selectedCountry, 'workHours', 40),
    vacationDays: getCountrySpecificDefault(selectedCountry, 'vacationDays', 10),
    publicHolidays: getCountrySpecificDefault(selectedCountry, 'holidays', 10),
    deductions: '',
    bonus: '',
    overtimeAmount: '',
  });
  
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Update form defaults when selectedCountry changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      workHours: getCountrySpecificDefault(selectedCountry, 'workHours', 40),
      vacationDays: getCountrySpecificDefault(selectedCountry, 'vacationDays', 10),
      publicHolidays: getCountrySpecificDefault(selectedCountry, 'holidays', 10),
    }));
    setResults(null);
  }, [selectedCountry, getCountrySpecificDefault]);

  const performCalculation = useCallback(() => {
    if (!formData.salary || isNaN(parseFloat(formData.salary)) || !selectedCountry || !countries[selectedCountry]) {
      return;
    }
    
    setIsCalculating(true);

    try {
      const salaryInput = parseFloat(formData.salary) || 0;
      const workHoursPerWeek = parseFloat(formData.workHours) || getCountrySpecificDefault(selectedCountry, 'workHours', 40);
      const vacationDaysAnnual = parseFloat(formData.vacationDays) || getCountrySpecificDefault(selectedCountry, 'vacationDays', 10);
      const publicHolidaysAnnual = parseFloat(formData.publicHolidays) || getCountrySpecificDefault(selectedCountry, 'holidays', 10);
      const voluntaryDeductionsAnnual = parseFloat(formData.deductions) || 0;
      const bonusAnnual = parseFloat(formData.bonus) || 0;
      const overtimePayAnnual = parseFloat(formData.overtimeAmount) || 0;

      // Convert input salary to annual amount
      let annualSalaryFromInput = salaryInput;
      if (formData.payPeriod === 'monthly') {
        annualSalaryFromInput = salaryInput * 12;
      } else if (formData.payPeriod === 'weekly') {
        annualSalaryFromInput = salaryInput * 52;
      } else if (formData.payPeriod === 'hourly') {
        const validWorkHours = workHoursPerWeek > 0 ? workHoursPerWeek : 40;
        annualSalaryFromInput = salaryInput * validWorkHours * 52;
      }

      // More accurate working days calculation
      const totalDaysInYear = 365.25; // Account for leap years
      const weekendsInYear = 52 * 2; // More precise than Math.floor calculation
      const totalWeekdaysInYear = totalDaysInYear - weekendsInYear;
      
      // Assume some holidays and vacation might fall on weekends (roughly 25%)
      const holidaysOnWeekdays = publicHolidaysAnnual * 0.75;
      const vacationOnWeekdays = vacationDaysAnnual * 0.75;
      
      const netWorkingDaysAnnual = Math.max(0, totalWeekdaysInYear - holidaysOnWeekdays - vacationOnWeekdays);
      
      // Calculate working hours per year
      const workingDaysPerWeek = 5; // Standard assumption
      const dailyHours = workHoursPerWeek > 0 ? workHoursPerWeek / workingDaysPerWeek : 8;
      const workingHoursPerYear = Math.max(1, netWorkingDaysAnnual * dailyHours); // Ensure minimum 1 to avoid division by zero

      const grossAnnualIncome = annualSalaryFromInput + bonusAnnual + overtimePayAnnual;
      
      // Calculate taxes using your existing function
      const taxInfo = calculateTax(grossAnnualIncome, selectedCountry);
      const totalMandatoryDeductions = taxInfo.totalTax;
      const netAnnualIncome = grossAnnualIncome - totalMandatoryDeductions - voluntaryDeductionsAnnual;

      // Calculate effective and marginal tax rates
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
            federalTax: taxInfo.federalTax,
            stateTax: taxInfo.stateTax,
            socialSecurity: taxInfo.socialSecurity,
            medicare: taxInfo.medicare,
            other: taxInfo.other,
          }
        },
        deductions: {
          mandatory: totalMandatoryDeductions,
          voluntary: voluntaryDeductionsAnnual,
          total: totalMandatoryDeductions + voluntaryDeductionsAnnual,
        },
        workInfo: {
          workingDaysPerYear: Math.round(netWorkingDaysAnnual * 100) / 100, // Round to 2 decimal places
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

  // Debounced calculation effect
  useEffect(() => {
    if (formData.salary && !isNaN(parseFloat(formData.salary))) {
      const timer = setTimeout(() => {
        performCalculation();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.salary, formData.payPeriod, formData.bonus, formData.deductions, formData.overtimeAmount, selectedCountry, performCalculation]);

  // Initial calculation when country changes
  useEffect(() => {
    if (formData.salary && !isNaN(parseFloat(formData.salary)) && countries[selectedCountry]) {
      performCalculation();
    }
  }, [selectedCountry, countries, performCalculation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const exportResults = () => {
    if (!results || !selectedCountry || !countries[selectedCountry]) return;

    const countryData = countries[selectedCountry];
    const dataToExport = {
      calculationInput: {
        country: countryData.name,
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

    const shareText = `Salary Calculation Results for ${countries[selectedCountry].name}\nGross Annual: ${formatCurrency(results.gross.annual, countries[selectedCountry].currency)}\nNet Annual: ${formatCurrency(results.net.annual, countries[selectedCountry].currency)}\nEffective Tax Rate: ${results.workInfo.effectiveTaxRate.toFixed(1)}%\nMarginal Tax Rate: ${results.workInfo.marginalTaxRate.toFixed(1)}%`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Salary Calculation Results for ${countries[selectedCountry].name}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share failed:', error);
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(`${shareText}\n\nSee full calculation at: ${window.location.href}`);
          alert('Results copied to clipboard!');
        } catch (clipboardError) {
          alert('Sharing failed. You can manually copy the link or export the results.');
        }
      }
    } else {
      // Fallback for browsers without Web Share API
      try {
        await navigator.clipboard.writeText(`${shareText}\n\nSee full calculation at: ${window.location.href}`);
        alert('Results copied to clipboard!');
      } catch (clipboardError) {
        alert('Unable to copy to clipboard. Please manually copy the URL.');
      }
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `Salary Calculator - ${countries[selectedCountry]?.name || 'Global'}`,
    description: `Calculate your net salary after taxes and deductions in ${countries[selectedCountry]?.name || 'your selected region'}. This tool helps you understand your take-home pay by considering relevant income taxes and social contributions.`,
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
        "name": "Your Website Name"
    }
  };

  const currentCountryName = (countries && selectedCountry && countries[selectedCountry]) ? countries[selectedCountry].name : 'your region';

  return (
    <>
      <SEOHead
        title={`Salary Calculator for ${currentCountryName}`}
        description={`Calculate your net salary after taxes and deductions in ${currentCountryName}. Convert between annual, monthly, weekly, and hourly wages.`}
        keywords={`salary calculator ${currentCountryName}, wage calculator ${currentCountryName}, net salary ${currentCountryName}, gross salary ${currentCountryName}, tax calculator ${currentCountryName}`}
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
              <Calculator className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Salary Calculator
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Calculate your net salary after taxes and deductions for {currentCountryName}.
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
              <div className="bg-white shadow-xl rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-3">
                  Enter Salary Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                      Salary Amount ({countries[selectedCountry]?.currency || ''})
                    </label>
                    <input
                      id="salary"
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="e.g., 50000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="payPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                      Pay Period
                    </label>
                    <select
                      id="payPeriod"
                      name="payPeriod"
                      value={formData.payPeriod}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="annual">Annual</option>
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="hourly">Hourly</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="workHours" className="block text-sm font-medium text-gray-700 mb-1">
                      Work Hours per Week
                    </label>
                    <input
                      id="workHours"
                      type="number"
                      name="workHours"
                      value={formData.workHours}
                      onChange={handleInputChange}
                      min="1"
                      max="168"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="vacationDays" className="block text-sm font-medium text-gray-700 mb-1">
                      Vacation Days per Year
                    </label>
                    <input
                      id="vacationDays"
                      type="number"
                      name="vacationDays"
                      value={formData.vacationDays}
                      onChange={handleInputChange}
                      min="0"
                      max="365"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="publicHolidays" className="block text-sm font-medium text-gray-700 mb-1">
                      Public Holidays per Year
                    </label>
                    <input
                      id="publicHolidays"
                      type="number"
                      name="publicHolidays"
                      value={formData.publicHolidays}
                      onChange={handleInputChange}
                      min="0"
                      max="365"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="bonus" className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Bonus (Optional)
                    </label>
                    <input
                      id="bonus"
                      type="number"
                      name="bonus"
                      value={formData.bonus}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="overtimeAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Overtime Pay (Optional)
                    </label>
                    <input
                      id="overtimeAmount"
                      type="number"
                      name="overtimeAmount"
                      value={formData.overtimeAmount}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="deductions" className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Voluntary Deductions (Annual)
                    </label>
                    <input
                      id="deductions"
                      type="number"
                      name="deductions"
                      value={formData.deductions}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                {results && (
                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={exportResults}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Download className="w-5 h-5 mr-2 -ml-1" />
                      Export JSON
                    </button>
                    <button
                      onClick={shareResults}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2"
            >
              {isCalculating ? (
                <div className="bg-white shadow-xl rounded-lg p-6 flex items-center justify-center" style={{minHeight: '300px'}}>
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
                  <p className="ml-4 text-gray-700">Calculating...</p>
                </div>
              ) : results ? (
                <div className="space-y-6">
                  <SalaryBreakdown results={results} countryCurrency={countries[selectedCountry]?.currency} />
                  <SalaryChart results={results} countryCurrency={countries[selectedCountry]?.currency} />
                </div>
              ) : (
                <div className="bg-white shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-gray-500" style={{minHeight: '300px'}}>
                  <Calculator className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="text-lg">Enter your salary information to see the breakdown.</p>
                  <p className="text-sm mt-1">Results will appear here.</p>
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
            <div className="bg-white shadow-xl rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About This Calculator & Disclaimer
                  </h3>
                  <div className="prose prose-sm text-gray-600 max-w-none">
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
                      <li>More accurate working days calculation accounting for weekends and holidays.</li>
                      <li>Effective and marginal tax rate calculations for better understanding of your tax burden.</li>
                    </ul>
                    <p className="mt-3 font-semibold text-red-600">
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