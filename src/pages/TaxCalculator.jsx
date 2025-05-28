import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Download, Share2, Info } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { useRegion } from '../context/RegionContext';
import { calculateTax, getEffectiveTaxRate, getMarginalTaxRate } from '../utils/taxCalculations';
import TaxBreakdown from '../components/calculators/TaxBreakdown';
import TaxChart from '../components/calculators/TaxChart';

// Constants
const DEFAULT_FILING_STATUS = 'single';
const DEFAULT_DEPENDENTS = '0';
const DEBOUNCE_DELAY_MS = 500;

const TaxCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion();

  // TODO: Filing status and dependent logic might need country-specific defaults or options
  // For now, using generic defaults.
  const [formData, setFormData] = useState({
    income: '',
    filingStatus: DEFAULT_FILING_STATUS,
    deductions: '', // Assumed to be itemized deductions or other post-tax adjustments
    dependents: DEFAULT_DEPENDENTS,
    additionalIncome: '0',
    retirement401k: '0', // Pre-tax deduction
    healthInsurance: '0', // Pre-tax deduction (e.g., HSA, or employer-sponsored if pre-tax)
  });

  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Effect to potentially reset/adjust form defaults when country changes (if needed)
  useEffect(() => {
    // Example: If filing statuses were country-specific
    // const countryData = countries?.[selectedCountry];
    // if (countryData?.filingStatuses) {
    //   setFormData(prev => ({ ...prev, filingStatus: countryData.filingStatuses[0]?.id || DEFAULT_FILING_STATUS }));
    // }
    setResults(null); // Clear results when country changes
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
      // This 'deductions' field needs careful handling. Is it itemized above standard? Or other post-tax?
      // For now, we pass it to calculateTax which should handle standard vs itemized logic.
      const itemizedDeductions = parseFloat(formData.deductions) || 0; 
      const retirement401k = parseFloat(formData.retirement401k) || 0;
      const healthInsurancePremiums = parseFloat(formData.healthInsurance) || 0; // Assuming these are pre-tax
      const dependents = parseInt(formData.dependents) || 0;
      const filingStatus = formData.filingStatus;

      const grossAnnualIncome = income + additionalIncome;
      
      // Pre-tax deductions handled *before* primary tax calculation or inside it
      // For simplicity, let's assume `calculateTax` can take these as specific parameters if needed,
      // or adjust `grossAnnualIncome` before passing if they are universally pre-tax.
      // Most comprehensive tax functions take gross income and then apply standard/itemized/pre-tax deductions internally.
      // Let's pass raw gross and let calculateTax handle deductions based on country rules.
      // The `itemizedDeductions` here would be what the user inputs as explicit itemized deductions.
      
      const taxCalculationParams = {
        filingStatus,
        dependents,
        itemizedDeductions, // User-specified itemized deductions
        preTaxDeductions: { // Specific pre-tax items
            retirement401k,
            healthInsurancePremiums
        }
      };
      
      // `calculateTax` needs to be adapted to use filingStatus, dependents, and deduction details
      const taxInfo = calculateTax(grossAnnualIncome, selectedCountry, taxCalculationParams);
      
      // Effective and Marginal rates should ideally be calculated on Gross Income by `getEffectiveTaxRate`
      // if it internally uses `calculateTax` which considers deductions for taxable income.
      // Or, if `calculateTax` returns taxableIncome, then pass that.
      // Let's assume `getEffectiveTaxRate` and `getMarginalTaxRate` take gross income and handle it.
      const effectiveRate = getEffectiveTaxRate(grossAnnualIncome, selectedCountry, taxCalculationParams);
      const marginalRate = getMarginalTaxRate(grossAnnualIncome, selectedCountry, taxCalculationParams);
      
      // Net income calculation depends on how `taxInfo.totalTax` is derived.
      // If `taxInfo.totalTax` is based on taxable income *after* pre-tax deductions,
      // then net income calculation needs to be clear.
      // Gross - AllTaxes - PostTaxDeductions(if any beyond what's in taxInfo)
      // Let's assume `taxInfo.taxableIncome` is available from `calculateTax`
      const taxableIncome = taxInfo.taxableIncome !== undefined ? taxInfo.taxableIncome : grossAnnualIncome - (retirement401k + healthInsurancePremiums); // Fallback if not from taxInfo
      const netIncome = grossAnnualIncome - taxInfo.totalTax - itemizedDeductions; // This might double-count if itemizedDeductions are already in taxInfo.totalTax path
                                                                            // A clearer model: Net = Gross - TotalTax (where TotalTax accounts for all deductions reducing it)

      // Revised Net Income: Gross - TotalTax. `taxInfo.totalTax` should be the final tax amount after all relevant deductions.
      const finalNetIncome = grossAnnualIncome - (taxInfo.totalTax || 0);


      const calculations = {
        income: {
          gross: grossAnnualIncome,
          taxable: taxableIncome, // This should ideally come from `calculateTax`
          net: finalNetIncome,
        },
        taxes: {
          ...taxInfo, // contains totalTax, federalTax, stateTax etc.
          effectiveRate: effectiveRate, // Already a decimal
          marginalRate: marginalRate, // Already a decimal
        },
        deductions: { // This section is for display of what user entered
          preTaxRetirement: retirement401k,
          preTaxHealth: healthInsurancePremiums,
          itemizedOrPostTax: itemizedDeductions, // Label might need to be dynamic
        },
        monthly: {
          grossIncome: grossAnnualIncome / 12,
          netIncome: finalNetIncome / 12,
          taxes: (taxInfo.totalTax || 0) / 12,
        },
        // Breakdown is now directly from taxInfo
        // breakdown: {
        //   federalTax: taxInfo.federalTax || 0,
        //   stateTax: taxInfo.stateTax || 0,
        //   socialSecurity: taxInfo.socialSecurity || 0,
        //   medicare: taxInfo.medicare || 0,
        //   otherTaxes: taxInfo.other || 0,
        // }
      };
      setResults(calculations);
    } catch (error) {
      console.error('Tax calculation error:', error);
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  }, [formData, selectedCountry, countries]); // `countries` for currency

  // Debounced calculation
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
      "Filing Status and Dependents Consideration (Country Specific)",
      "Multi-country Support",
      "Data Export (JSON)",
      "Shareable Results"
    ],
    offers: { "@type": "Offer", price: "0" },
    provider: { "@type": "Organization", name: "WageCalculator" }
  }), [currentCountryName]);

  const inputFieldClass = "w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-neutral-700 dark:text-white";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"; // Reduced mb from 2 to 1

  // Filing status options - these might become dynamic based on country
  const filingStatusOptions = useMemo(() => {
    // Example: Could load from countries[selectedCountry]?.filingStatuses
    return [
      { value: 'single', label: 'Single' },
      { value: 'married', label: 'Married Filing Jointly' },
      { value: 'married_separate', label: 'Married Filing Separately' },
      { value: 'hoh', label: 'Head of Household' },
      // Add other common statuses or make country-specific
    ];
  }, [/* selectedCountry, countries (if dynamic) */]);


  return (
    <>
      <SEOHead 
        title={`Income Tax Calculator for ${currentCountryName} - Estimate Your Taxes`}
        description={`Calculate your income tax liability in ${currentCountryName}. Includes federal, state, social security, and common deductions. Supports various filing statuses.`}
        keywords={`tax calculator ${currentCountryName}, income tax ${currentCountryName}, tax estimator ${currentCountryName}, tax deductions ${currentCountryName}, net income after tax ${currentCountryName}, filing status ${currentCountryName}`}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-12"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Receipt className="w-8 h-8 md:w-9 md:h-9 text-primary-600 dark:text-primary-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Income Tax Calculator
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Estimate your income taxes and deductions for {currentCountryName}.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-b dark:border-neutral-700 pb-3">
                  Your Tax Information
                </h2>
                <div className="space-y-4"> {/* Adjusted space-y */}
                  <div>
                    <label htmlFor="income" className={labelClass}>Annual Gross Income ({currentCurrencySymbol})</label>
                    <input id="income" type="number" name="income" value={formData.income} onChange={handleInputChange} placeholder="e.g., 75000" className={inputFieldClass} min="0"/>
                  </div>
                  <div>
                    <label htmlFor="filingStatus" className={labelClass}>Filing Status</label>
                    <select id="filingStatus" name="filingStatus" value={formData.filingStatus} onChange={handleInputChange} className={inputFieldClass}>
                      {filingStatusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="dependents" className={labelClass}>Number of Dependents</label>
                    <input id="dependents" type="number" name="dependents" value={formData.dependents} onChange={handleInputChange} className={inputFieldClass} min="0" step="1"/>
                  </div>
                  <div>
                    <label htmlFor="additionalIncome" className={labelClass}>Additional Annual Income (e.g., investments, side job)</label>
                    <input id="additionalIncome" type="number" name="additionalIncome" value={formData.additionalIncome} onChange={handleInputChange} placeholder="0" className={inputFieldClass} min="0"/>
                  </div>
                  <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 pt-2 border-t dark:border-neutral-700">Pre-Tax Deductions</h3>
                  <div>
                    <label htmlFor="retirement401k" className={labelClass}>Retirement Contributions (e.g., 401k, IRA - Annual)</label>
                    <input id="retirement401k" type="number" name="retirement401k" value={formData.retirement401k} onChange={handleInputChange} placeholder="0" className={inputFieldClass} min="0"/>
                  </div>
                  <div>
                    <label htmlFor="healthInsurance" className={labelClass}>Health Insurance Premiums (Pre-Tax, Annual)</label>
                    <input id="healthInsurance" type="number" name="healthInsurance" value={formData.healthInsurance} onChange={handleInputChange} placeholder="0" className={inputFieldClass} min="0"/>
                  </div>
                   <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 pt-2 border-t dark:border-neutral-700">Itemized/Other Deductions</h3>
                  <div>
                    <label htmlFor="deductions" className={labelClass}>Other Itemized Deductions (Annual, if exceeding standard)</label>
                    <input id="deductions" type="number" name="deductions" value={formData.deductions} onChange={handleInputChange} placeholder="0" className={inputFieldClass} min="0"/>
                  </div>
                </div>

                {results && (
                  <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={exportResults}
                      aria-label="Export tax calculation results as JSON"
                      className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Download className="w-5 h-5 mr-2 -ml-1" />
                      Export JSON
                    </button>
                    <button
                      onClick={shareResults}
                      aria-label="Share tax calculation results"
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
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              {isCalculating ? (
                <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-center" style={{minHeight: '300px'}}>
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">Calculating your taxes...</p>
                </div>
              ) : results ? (
                <div className="space-y-6">
                  <TaxBreakdown results={results} countryCurrency={currentCurrencySymbol} />
                  <TaxChart results={results} countryCurrency={currentCurrencySymbol} />
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400" style={{minHeight: '300px'}}>
                  <Receipt className="w-16 h-16 mb-4 text-gray-300 dark:text-neutral-600" />
                  <p className="text-lg">Enter your income and deduction details to estimate your tax liability.</p>
                  <p className="text-sm mt-1">Results will appear here.</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 md:mt-16"
          >
            <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6 md:p-8">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Understanding Tax Calculations
                  </h3>
                  <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none">
                    <p>
                      This tax calculator provides an estimate of your income tax liability based on the tax laws for {currentCountryName} and the information you provide. It typically considers federal/national taxes, state/provincial taxes (where applicable), and common payroll taxes like social security.
                    </p>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      <li><strong>Gross Income:</strong> Your total income before any taxes or deductions.</li>
                      <li><strong>Pre-Tax Deductions:</strong> Amounts like certain retirement contributions (e.g., 401k) or health insurance premiums that can reduce your taxable income.</li>
                      <li><strong>Taxable Income:</strong> Gross income minus applicable pre-tax deductions and standard/itemized deductions. This is the income amount on which taxes are actually calculated.</li>
                      <li><strong>Total Taxes:</strong> The sum of all estimated taxes (federal, state, social security, etc.).</li>
                      <li><strong>Net Income:</strong> Your take-home pay after all taxes and deductions.</li>
                      <li><strong>Effective Tax Rate:</strong> Your total tax liability divided by your gross income, expressed as a percentage.</li>
                      <li><strong>Marginal Tax Rate:</strong> The tax rate applied to the next dollar of income you earn, typically the rate of your highest tax bracket.</li>
                    </ul>
                    <p className="mt-3 font-semibold text-red-600 dark:text-red-400">
                      Disclaimer: Tax laws are complex and vary significantly. These calculations are estimates for informational and planning purposes only and should not be considered financial or tax advice. Factors like specific tax credits, detailed itemized deductions, local taxes, and changes in legislation are not fully accounted for. Always consult with a qualified tax professional for advice tailored to your individual situation.
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

export default TaxCalculator;