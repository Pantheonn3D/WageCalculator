// src/pages/HourlyCalculator.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Download, Share2, Info } from 'lucide-react';
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
    // Guard clause: Ensure essential data is present before proceeding
    if (!formData.hourlyRate || isNaN(parseFloat(formData.hourlyRate)) || !selectedCountry || !countries || !countries[selectedCountry]) {
      setResults(null); // Clear results if inputs are invalid or country data is missing
      setIsCalculating(false); // Ensure loading state is turned off
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
      // This is the PAY specifically from overtime hours, not the total pay for those hours
      const overtimePremiumPayAnnual = totalOvertimeHoursAnnual * hourlyRate * (overtimeRateMultiplier - 1); 
      // Total pay for overtime hours would be: totalOvertimeHoursAnnual * hourlyRate * overtimeRateMultiplier
      // Let's adjust to what was likely intended in the original code for `grossAnnual`
      const totalOvertimePayAnnual = totalOvertimeHoursAnnual * hourlyRate * overtimeRateMultiplier;


      const grossAnnualIncome = standardPayAnnual + totalOvertimePayAnnual + annualBonus;
      
      const taxInfo = calculateTax(grossAnnualIncome, selectedCountry);
      const totalMandatoryDeductions = taxInfo.totalTax || 0;
      const netAnnualIncome = grossAnnualIncome - totalMandatoryDeductions - annualVoluntaryDeductions;

      const effectiveTaxRate = getEffectiveTaxRate(grossAnnualIncome, selectedCountry);
      const marginalTaxRate = getMarginalTaxRate(grossAnnualIncome, selectedCountry);

      // ***** ADJUSTING THIS STRUCTURE TO MATCH THE ERROR MESSAGE'S IMPLICATION *****
      const calculations = {
        hourly: { // Changed from 'rates' to 'hourly'
          regular: hourlyRate, // This is what HourlyBreakdown likely expects
          overtime: hourlyRate * overtimeRateMultiplier, // This for overtime rate
          effectiveGross: totalWorkedHoursAnnual > 0 ? grossAnnualIncome / totalWorkedHoursAnnual : 0,
          effectiveNet: totalWorkedHoursAnnual > 0 ? netAnnualIncome / totalWorkedHoursAnnual : 0,
        },
        gross: {
          annual: grossAnnualIncome,
          monthly: grossAnnualIncome / 12,
          weekly: weeksPerYear > 0 ? grossAnnualIncome / weeksPerYear : 0,
          standardPayAnnual: standardPayAnnual,
          overtimePayAnnual: totalOvertimePayAnnual, // Using total overtime pay
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
    // Only attempt calculation if hourlyRate is a valid number and countries data is available
    if (formData.hourlyRate && !isNaN(parseFloat(formData.hourlyRate)) && countries && countries[selectedCountry]) {
      const timer = setTimeout(performCalculation, DEBOUNCE_DELAY_MS);
      return () => clearTimeout(timer);
    } else if (results !== null) { // If inputs become invalid, clear results
      setResults(null);
    }
  }, [formData, selectedCountry, countries, performCalculation, results]); // Added countries and selectedCountry

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const exportResults = () => {
    if (!results || !selectedCountry || !countries || !countries[selectedCountry]) return; // Added countries check
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
    if (!results || !selectedCountry || !countries || !countries[selectedCountry]) return; // Added countries check
    const countryData = countries[selectedCountry];
    // Ensure results.hourly.regular exists before trying to format it
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
    provider: { "@type": "Organization", name: "WageCalculator" } // Updated provider name
  }), [currentCountryName]);

  const inputFieldClass = "w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-neutral-700 dark:text-white";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <>
      <SEOHead 
        title={`Hourly Wage Calculator for ${currentCountryName} - Earnings & Net Pay`}
        description={`Convert hourly rate to annual salary in ${currentCountryName}. Includes overtime, vacation, and after-tax net income estimates.`}
        keywords={`hourly wage calculator ${currentCountryName}, hourly to salary ${currentCountryName}, overtime pay ${currentCountryName}, net hourly pay ${currentCountryName}, income after tax hourly ${currentCountryName}`}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ... rest of the JSX is assumed to be similar to SalaryCalculator in terms of structure and styling ... */}
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-12"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Clock className="w-8 h-8 md:w-9 md:h-9 text-primary-600 dark:text-primary-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Hourly Wage Calculator
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Estimate your earnings from an hourly wage for {currentCountryName}.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-b dark:border-neutral-700 pb-3">Hourly Information</h2>
                <div className="space-y-5">
                  {/* Input fields with updated classes and labels */}
                  <div>
                    <label htmlFor="hourlyRate" className={labelClass}>Hourly Rate ({currentCurrencySymbol})</label>
                    <input id="hourlyRate" type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange} placeholder="e.g., 25" className={inputFieldClass} step="0.01" min="0"/>
                  </div>
                  <div>
                    <label htmlFor="hoursPerWeek" className={labelClass}>Standard Hours per Week</label>
                    <input id="hoursPerWeek" type="number" name="hoursPerWeek" value={formData.hoursPerWeek} onChange={handleInputChange} className={inputFieldClass} min="1" max="168"/>
                  </div>
                  <div>
                    <label htmlFor="weeksPerYear" className={labelClass}>Total Weeks per Year</label>
                    <input id="weeksPerYear" type="number" name="weeksPerYear" value={formData.weeksPerYear} onChange={handleInputChange} className={inputFieldClass} min="1" max="52"/>
                  </div>
                  <div>
                    <label htmlFor="vacationWeeks" className={labelClass}>Paid Vacation Weeks per Year</label>
                    <input id="vacationWeeks" type="number" name="vacationWeeks" value={formData.vacationWeeks} onChange={handleInputChange} className={inputFieldClass} min="0"/>
                  </div>
                  <div>
                    <label htmlFor="overtimeHours" className={labelClass}>Overtime Hours per Week</label>
                    <input id="overtimeHours" type="number" name="overtimeHours" value={formData.overtimeHours} onChange={handleInputChange} placeholder="0" className={inputFieldClass} step="0.5" min="0"/>
                  </div>
                  <div>
                    <label htmlFor="overtimeRate" className={labelClass}>Overtime Rate Multiplier (e.g., 1.5 for time and a half)</label>
                    <input id="overtimeRate" type="number" name="overtimeRate" value={formData.overtimeRate} onChange={handleInputChange} className={inputFieldClass} step="0.1" min="1"/>
                  </div>
                  <div>
                    <label htmlFor="bonus" className={labelClass}>Annual Bonus (Optional)</label>
                    <input id="bonus" type="number" name="bonus" value={formData.bonus} onChange={handleInputChange} placeholder="0" className={inputFieldClass} min="0"/>
                  </div>
                  <div>
                    <label htmlFor="deductions" className={labelClass}>Additional Voluntary Deductions (Annual)</label>
                    <input id="deductions" type="number" name="deductions" value={formData.deductions} onChange={handleInputChange} placeholder="0" className={inputFieldClass} min="0"/>
                  </div>
                </div>

                {results && (
                  <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={exportResults}
                      aria-label="Export hourly calculation results as JSON"
                      className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Download className="w-5 h-5 mr-2 -ml-1" />
                      Export JSON
                    </button>
                    <button
                      onClick={shareResults}
                      aria-label="Share hourly calculation results"
                      className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
                    >
                      <Share2 className="w-5 h-5 mr-2 -ml-1" />
                      Share
                    </button>
                  </div>
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
                <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-center" style={{minHeight: '300px'}}>
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">Calculating hourly earnings...</p>
                </div>
              ) : results ? (
                <div className="space-y-6">
                  <HourlyBreakdown results={results} countryCurrency={currentCurrencySymbol}/>
                  <HourlyChart results={results} countryCurrency={currentCurrencySymbol}/>
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400" style={{minHeight: '300px'}}>
                  <Clock className="w-16 h-16 mb-4 text-gray-300 dark:text-neutral-600" />
                  <p className="text-lg">Enter your hourly wage details to see your earnings breakdown.</p>
                  <p className="text-sm mt-1">Results will appear here once calculated.</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 md:mt-16"
          >
            <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6 md:p-8">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Understanding Hourly Wage Calculations
                  </h3>
                  <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none">
                    <p>
                      This calculator converts your hourly wage into annual, monthly, and weekly earnings, 
                      considering standard hours, overtime, paid vacation, and estimated taxes for {currentCountryName}.
                    </p>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      <li>Standard pay is based on your hourly rate and standard hours per week.</li>
                      <li>Overtime pay is calculated using your overtime hours and the specified overtime rate multiplier.</li>
                      <li>Paid vacation weeks are factored in to determine actual working weeks.</li>
                      <li>Taxes are estimated on your gross annual income (including overtime and bonuses).</li>
                      <li>Results show gross earnings and an estimated net take-home pay after mandatory deductions.</li>
                    </ul>
                     <p className="mt-3 font-semibold text-red-600 dark:text-red-400">
                      Disclaimer: These calculations are estimates for informational purposes. Actual net pay may vary based on specific tax situations, local regulations, and additional benefits or deductions not included here. Always consult with a financial advisor or HR department for precise figures.
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

export default HourlyCalculator;