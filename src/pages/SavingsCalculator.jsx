import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, Download, Share2, Info } from 'lucide-react';
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

const COMPOUNDING_OPTIONS = [
  { value: '1', label: 'Annually' },
  { value: '2', label: 'Semi-Annually' },
  { value: '4', label: 'Quarterly' },
  { value: '12', label: 'Monthly' },
  { value: '52', label: 'Weekly' },
  { value: '365', label: 'Daily' },
];

const SavingsCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion(); // selectedCountry, countries might not be used directly here but good for consistency

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
    // Validate essential inputs for calculation to proceed
    if (isNaN(parseFloat(formData.initialAmount)) && isNaN(parseFloat(formData.monthlyContribution))) {
        setResults(null);
        setIsCalculating(false);
        return;
    }
    setIsCalculating(true);
    
    try {
      const initialAmount = parseFloat(formData.initialAmount) || 0;
      const monthlyContribution = parseFloat(formData.monthlyContribution) || 0;
      const annualReturnRate = (parseFloat(formData.annualReturn) || 0) / 100; // e.g., 0.07
      const years = parseFloat(formData.years) || 0;
      const compoundingFrequency = parseInt(formData.compoundingFrequency) || 12; // Number of times compounded per year
      const inflationRate = (parseFloat(formData.inflationRate) || 0) / 100; // e.g., 0.03
      const goalAmount = parseFloat(formData.goalAmount) || 0;

      const n = compoundingFrequency; // compounds per year
      const t = years; // years
      const totalPeriods = n * t; // total compounding periods
      const periodicRate = annualReturnRate / n; // interest rate per compounding period

      // Future Value of Initial Amount (Lump Sum)
      // FV = P * (1 + r/n)^(nt)
      const fvInitial = initialAmount * Math.pow(1 + periodicRate, totalPeriods);
      
      // Future Value of a Series (Annuity for monthly contributions)
      // Assuming contributions (PMT) are made at the end of each compounding period.
      // If contributions are monthly but compounding is, say, quarterly, this formula is an approximation
      // or needs adjustment. For simplicity, if contributions are monthly, and compounding is also monthly,
      // then periodicRate = annualReturnRate / 12 and totalPeriods = years * 12.
      // If compoundingFrequency is different, we need to be careful.
      // Let's assume for this calculator, PMT is per compounding period.
      // If PMT is monthly, but compounding is quarterly, we need to adjust.
      // For now, let's assume the "monthlyContribution" is actually "contributionPerPeriod" if n !== 12
      // OR, we always compound monthly contributions monthly, regardless of main compoundingFrequency for initial sum.
      // Most user-facing calculators simplify this: if contributions are monthly, they use monthly compounding for the annuity part.
      
      let fvContributions = 0;
      const r_monthly = annualReturnRate / 12; // Monthly rate for monthly contributions
      const totalMonths = t * 12;

      if (monthlyContribution > 0 && r_monthly > 0) {
        fvContributions = monthlyContribution * ((Math.pow(1 + r_monthly, totalMonths) - 1) / r_monthly);
      } else if (monthlyContribution > 0 && r_monthly === 0) { // No interest, just sum of contributions
        fvContributions = monthlyContribution * totalMonths;
      }

      // If the main 'compoundingFrequency' should strictly apply to everything:
      // This would mean `contributionPerPeriod = monthlyContribution * 12 / n`
      // And use `periodicRate` and `totalPeriods`. This makes the form input "Monthly Contribution" less direct.
      // So, sticking to common calculator behavior: initial sum uses `compoundingFrequency`, monthly contributions use monthly compounding.

      const totalFutureValue = fvInitial + fvContributions;
      const totalPrincipalContributions = initialAmount + (monthlyContribution * totalMonths);
      const totalInterestEarned = totalFutureValue - totalPrincipalContributions;
      
      const inflationAdjustedFutureValue = totalFutureValue / Math.pow(1 + inflationRate, t);
      
      const monthlyData = [];
      let currentBalance = initialAmount;
      let cumulativeContributions = initialAmount;
      for (let i = 0; i < totalMonths; i++) {
        currentBalance += monthlyContribution; // Contribution at start/end of month? Assume end for this simple loop.
        currentBalance *= (1 + r_monthly);    // Interest for the month
        cumulativeContributions += monthlyContribution;
        monthlyData.push({
          month: i + 1,
          year: Math.floor((i + 1) / 12),
          balance: currentBalance,
          contributions: cumulativeContributions,
          interest: currentBalance - cumulativeContributions,
        });
      }
      // One final point for month 0 (initial state)
      monthlyData.unshift({ month: 0, year: 0, balance: initialAmount, contributions: initialAmount, interest: 0 });


      let timeToGoalYears = null;
      let monthlyContributionNeeded = null;

      if (goalAmount > 0 && goalAmount > initialAmount && annualReturnRate > 0 && monthlyContribution >= 0) {
        // Time to goal (NPER formula from Excel/Sheets for FV)
        // FV = PV*(1+r)^n + PMT*[((1+r)^n - 1)/r]
        // This is hard to solve for n directly if both PV and PMT exist.
        // Iterative approach or approximation might be needed.
        // For simplicity, let's estimate based on if PMT is the primary driver or PV.
        // If we only had PMT: n = ln((FV*r/PMT) + 1) / ln(1+r)
        // If we only had PV: n = ln(FV/PV) / ln(1+r)

        // Iterative for timeToGoal
        let tempBalance = initialAmount;
        let monthsToGoal = 0;
        if (tempBalance < goalAmount) {
            for (let m = 1; m <= years * 12 * 2; m++) { // Limit iteration to avoid infinite loop (e.g., 2x planned years)
                tempBalance = tempBalance * (1 + r_monthly) + monthlyContribution;
                monthsToGoal = m;
                if (tempBalance >= goalAmount) break;
            }
            if (tempBalance >= goalAmount) {
                timeToGoalYears = monthsToGoal / 12;
            } else {
                 timeToGoalYears = Infinity; // Indicates goal not reachable in 2x planned time
            }
        } else {
            timeToGoalYears = 0; // Goal already met or exceeded by initial amount
        }


        // Monthly contribution needed (PMT formula from Excel/Sheets for FV)
        // PMT = (FV - PV*(1+r)^n) * (r / ((1+r)^n - 1))
        if (totalMonths > 0) {
            const fvOfPV = initialAmount * Math.pow(1 + r_monthly, totalMonths);
            if (Math.pow(1 + r_monthly, totalMonths) - 1 !== 0) { // Avoid division by zero
                monthlyContributionNeeded = (goalAmount - fvOfPV) * (r_monthly / (Math.pow(1 + r_monthly, totalMonths) - 1));
                if (monthlyContributionNeeded < 0) monthlyContributionNeeded = 0; // If initial amount alone meets goal
            } else if (goalAmount > fvOfPV) { // No interest compounding, linear growth
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
        inputs: { // Reflecting what was used in calculation
          initialAmount,
          monthlyContribution,
          annualReturnRate,
          years,
          compoundingFrequency,
          inflationRate,
        },
        goalAnalysis: {
          targetAmount: goalAmount,
          timeToGoalYears, // In years
          monthlyContributionNeeded, // Monthly amount
          isGoalAchieved: goalAmount > 0 ? totalFutureValue >= goalAmount : null,
        },
        monthlyData, // For charts
      };
      setResults(calculations);
    } catch (error) {
      console.error('Savings calculation error:', error);
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  }, [formData]); // Removed selectedCountry, countries, not directly used in this specific math

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
    // country and currency might not be directly relevant here but kept for consistency
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
  
  const currentCountryName = useMemo(() => // Not directly used in UI text but good for context if SEO needs it
    (countries && selectedCountry && countries[selectedCountry]) ? countries[selectedCountry].name : 'Global',
    [countries, selectedCountry]
  );
  const currentCurrencySymbol = useMemo(() => 
    (countries && selectedCountry && countries[selectedCountry]) ? countries[selectedCountry].currency : '$', // Used for input placeholder potentially
    [countries, selectedCountry]
  );

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Compound Interest Savings Calculator",
    "description": "Project your savings growth over time with compound interest. Input initial deposit, contributions, interest rate, and time period to see potential earnings and plan for financial goals.",
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
  }), [currentCountryName]); // currentCountryName if used in description

  const inputFieldClass = "w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-neutral-700 dark:text-white";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <>
      <SEOHead 
        title={`Compound Savings Calculator - Project Your Growth`}
        description={`Estimate your savings growth with our compound interest calculator. See how initial deposits, regular contributions, and interest rates impact your future value. Plan for financial goals.`}
        keywords="savings calculator, compound interest calculator, investment growth, future value calculator, financial planning tool, retirement savings, investment calculator"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-12"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <PiggyBank className="w-8 h-8 md:w-9 md:h-9 text-primary-600 dark:text-primary-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Savings Growth Calculator
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how your savings can grow with the power of compound interest.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-b dark:border-neutral-700 pb-3">
                  Enter Your Savings Plan
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="initialAmount" className={labelClass}>Initial Amount ({currentCurrencySymbol})</label>
                    <input id="initialAmount" type="number" name="initialAmount" value={formData.initialAmount} onChange={handleInputChange} placeholder="e.g., 1000" className={inputFieldClass} min="0"/>
                  </div>
                  <div>
                    <label htmlFor="monthlyContribution" className={labelClass}>Monthly Contribution ({currentCurrencySymbol})</label>
                    <input id="monthlyContribution" type="number" name="monthlyContribution" value={formData.monthlyContribution} onChange={handleInputChange} placeholder="e.g., 100" className={inputFieldClass} min="0"/>
                  </div>
                  <div>
                    <label htmlFor="annualReturn" className={labelClass}>Expected Annual Return (%)</label>
                    <input id="annualReturn" type="number" name="annualReturn" value={formData.annualReturn} onChange={handleInputChange} placeholder="e.g., 7" className={inputFieldClass} step="0.1" min="0"/>
                  </div>
                  <div>
                    <label htmlFor="years" className={labelClass}>Time Period (Years)</label>
                    <input id="years" type="number" name="years" value={formData.years} onChange={handleInputChange} placeholder="e.g., 10" className={inputFieldClass} min="1"/>
                  </div>
                  <div>
                    <label htmlFor="compoundingFrequency" className={labelClass}>Interest Compounding Frequency</label>
                    <select id="compoundingFrequency" name="compoundingFrequency" value={formData.compoundingFrequency} onChange={handleInputChange} className={inputFieldClass}>
                      {COMPOUNDING_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                   <div>
                    <label htmlFor="inflationRate" className={labelClass}>Expected Annual Inflation Rate (%)</label>
                    <input id="inflationRate" type="number" name="inflationRate" value={formData.inflationRate} onChange={handleInputChange} placeholder="e.g., 3" className={inputFieldClass} step="0.1" min="0"/>
                  </div>
                  <div>
                    <label htmlFor="goalAmount" className={labelClass}>Savings Goal Amount (Optional, {currentCurrencySymbol})</label>
                    <input id="goalAmount" type="number" name="goalAmount" value={formData.goalAmount} onChange={handleInputChange} placeholder="e.g., 50000" className={inputFieldClass} min="0"/>
                  </div>
                </div>

                {results && (
                  <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <button onClick={exportResults} aria-label="Export savings calculation results as JSON"
                      className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      <Download className="w-5 h-5 mr-2 -ml-1" /> Export JSON
                    </button>
                    <button onClick={shareResults} aria-label="Share savings calculation results"
                      className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600">
                      <Share2 className="w-5 h-5 mr-2 -ml-1" /> Share
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              {isCalculating && (!results || Object.keys(results).length === 0) ? ( // Show loading only if results are not yet available
                <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-center" style={{minHeight: '300px'}}>
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">Calculating your savings...</p>
                </div>
              ) : results ? (
                <div className="space-y-6">
                  <SavingsBreakdown results={results} countryCurrency={currentCurrencySymbol} />
                  <SavingsChart results={results} countryCurrency={currentCurrencySymbol} />
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400" style={{minHeight: '300px'}}>
                  <PiggyBank className="w-16 h-16 mb-4 text-gray-300 dark:text-neutral-600" />
                  <p className="text-lg">Enter your savings details to project future growth.</p>
                  <p className="text-sm mt-1">Results will appear here.</p>
                </div>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 md:mt-16"
          >
            <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6 md:p-8">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Understanding Compound Interest & Savings Growth
                  </h3>
                  <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none">
                    <p>
                      This calculator helps you visualize how your savings can grow over time through the power of compound interest. 
                      Compound interest means you earn returns not only on your initial principal but also on the accumulated interest from previous periods.
                    </p>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      <li><strong>Initial Amount:</strong> The starting sum of money you invest or save.</li>
                      <li><strong>Contributions:</strong> Regular amounts you add to your savings (e.g., monthly).</li>
                      <li><strong>Annual Return Rate:</strong> The expected yearly percentage growth of your investment.</li>
                      <li><strong>Compounding Frequency:</strong> How often the earned interest is calculated and added to your principal (e.g., monthly, quarterly, annually). More frequent compounding generally leads to slightly higher returns.</li>
                      <li><strong>Time Period:</strong> The number of years you plan to save or invest. The longer the period, the more significant the compounding effect.</li>
                      <li><strong>Inflation Rate:</strong> The rate at which the general level of prices for goods and services is rising, and consequently, the purchasing power of currency is falling. The "Real Value" of your savings is adjusted for this.</li>
                    </ul>
                    <p className="mt-3 font-semibold text-primary-700 dark:text-primary-500">
                      Small, consistent contributions over a long period, combined with a reasonable rate of return, can lead to substantial savings growth due to compounding.
                    </p>
                     <p className="mt-3 font-semibold text-red-600 dark:text-red-400">
                      Disclaimer: These calculations are estimates based on the inputs you provide and do not guarantee future returns. Investment values can go up or down. This tool is for informational purposes only and should not be considered financial advice. Consult a qualified financial advisor for personalized guidance.
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

export default SavingsCalculator;