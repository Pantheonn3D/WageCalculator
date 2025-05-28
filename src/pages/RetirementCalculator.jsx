import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Download, Share2, Info, PiggyBank, Clock, 
  Target, Award, Users, CheckCircle, ArrowRight, BookOpen,
  Calculator, BarChart3, Shield, Zap, Globe, DollarSign
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { useRegion } from '../context/RegionContext';
import RetirementBreakdown from '../components/calculators/RetirementBreakdown';
import RetirementChart from '../components/calculators/RetirementChart';

const FEATURED_BENEFITS = [
  "Comprehensive retirement planning",
  "401k and IRA calculations", 
  "Inflation-adjusted projections",
  "Multi-scenario analysis"
];

const RELATED_TOOLS = [
  { title: 'Salary Calculator', href: '/salary-calculator', icon: DollarSign, description: 'Calculate your net take-home pay' },
  { title: 'Savings Calculator', href: '/savings-calculator', icon: PiggyBank, description: 'Plan your savings goals and timeline' },
  { title: '401k Calculator', href: '/401k-calculator', icon: BarChart3, description: 'Optimize your 401k contributions' },
  { title: 'Investment Calculator', href: '/investment-calculator', icon: TrendingUp, description: 'Project investment growth over time' }
];

const CALCULATION_FEATURES = [
  { icon: Zap, title: 'Real-Time Calculations', description: 'Instant results as you adjust your retirement parameters' },
  { icon: Globe, title: 'Multi-Currency Support', description: 'Calculate retirement needs in your local currency' },
  { icon: Shield, title: 'Privacy Protected', description: 'All calculations happen locally - your data stays private' },
  { icon: Award, title: 'Professional Grade', description: 'Used by financial advisors and retirement planners worldwide' }
];

const RetirementCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion();
  const [formData, setFormData] = useState({
    currentAge: '30',
    retirementAge: '65',
    currentSavings: '10000',
    monthlyContribution: '500',
    employerMatch: '3',
    salary: '60000',
    expectedReturn: '7',
    inflationRate: '3',
    retirementExpenses: '80',
    socialSecurity: '0',
    retirementGoal: ''
  });
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (formData.currentAge && formData.retirementAge && formData.currentSavings && formData.salary) {
      calculateRetirement();
    } else {
      setResults(null);
    }
  }, [formData]);

  const calculateRetirement = async () => {
    setIsCalculating(true);
    
    try {
      const currentAge = parseInt(formData.currentAge) || 0;
      const retirementAge = parseInt(formData.retirementAge) || 0;
      
      if (currentAge <= 0 || retirementAge <= 0 || retirementAge <= currentAge) {
        console.warn("Invalid age inputs. Current age must be positive and less than retirement age.");
        setResults({ error: "Invalid age inputs. Please check current and retirement age." });
        setIsCalculating(false);
        return;
      }

      const currentSavings = parseFloat(formData.currentSavings) || 0;
      const monthlyContribution = parseFloat(formData.monthlyContribution) || 0;
      const employerMatch = parseFloat(formData.employerMatch) / 100 || 0;
      const salary = parseFloat(formData.salary) || 0;
      const expectedReturn = parseFloat(formData.expectedReturn) / 100 || 0.07;
      const inflationRate = parseFloat(formData.inflationRate) / 100 || 0.03;
      const retirementExpenses = parseFloat(formData.retirementExpenses) / 100 || 0.80;
      const socialSecurity = parseFloat(formData.socialSecurity) || 0;

      let yearsToRetirement = retirementAge - currentAge;

      if (yearsToRetirement > 70) {
        console.warn("Years to retirement is very large ( > 70 years), results might be unrealistic or cause performance issues.");
      }
      if (yearsToRetirement <= 0) {
        console.warn("Retirement age must be greater than current age.");
        setResults({ error: "Retirement age must be greater than current age." });
        setIsCalculating(false);
        return;
      }

      const monthsToRetirement = yearsToRetirement * 12;
      const monthlyReturn = expectedReturn / 12;
      const monthlyEmployerMatch = (salary * employerMatch) / 12;

      let futureValueCurrentSavings = currentSavings;
      if (expectedReturn > -1) {
           futureValueCurrentSavings = currentSavings * Math.pow(1 + expectedReturn, yearsToRetirement);
      }

      const totalMonthlyContribution = monthlyContribution + monthlyEmployerMatch;
      let futureValueContributions = 0;
      if (monthlyReturn !== 0 && totalMonthlyContribution > 0) {
        futureValueContributions = totalMonthlyContribution * 
          ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);
      } else if (totalMonthlyContribution > 0) {
        futureValueContributions = totalMonthlyContribution * monthsToRetirement;
      }

      const totalRetirementSavings = futureValueCurrentSavings + futureValueContributions;

      const currentExpenses = salary * retirementExpenses;
      const retirementExpensesInflated = currentExpenses * Math.pow(1 + inflationRate, yearsToRetirement);
      const annualRetirementIncomeNeedFromSavings = Math.max(0, retirementExpensesInflated - socialSecurity);

      const safeWithdrawalRate = 0.04;
      const requiredSavings = annualRetirementIncomeNeedFromSavings / safeWithdrawalRate;

      const yearlyProjection = [];
      let balance = currentSavings;
      let totalContributionsSoFar = currentSavings;
      let age = currentAge;

      for (let year = 0; year <= yearsToRetirement; year++) {
        if (year > 0) {
          age++;
          const interestThisYear = balance * expectedReturn;
          const contributionsThisYear = totalMonthlyContribution * 12;
          balance += interestThisYear + contributionsThisYear;
          totalContributionsSoFar += contributionsThisYear;
        }

        yearlyProjection.push({
          year,
          age,
          balance,
          contributions: totalContributionsSoFar,
          growth: balance - totalContributionsSoFar,
          realValue: balance / Math.pow(1 + inflationRate, year)
        });
         
        if (year > 100 && yearlyProjection.length > 100) {
            console.warn("Projection capped at 100 years for performance.");
            break; 
        }
      }
      
      const onTrack = isFinite(totalRetirementSavings) && isFinite(requiredSavings) && totalRetirementSavings >= requiredSavings;
      const shortfall = isFinite(totalRetirementSavings) && isFinite(requiredSavings) ? Math.max(0, requiredSavings - totalRetirementSavings) : Infinity;
      const surplus = isFinite(totalRetirementSavings) && isFinite(requiredSavings) ? Math.max(0, totalRetirementSavings - requiredSavings) : 0;

      let monthlyNeeded = 0;
      if (shortfall > 0 && isFinite(shortfall)) {
          const futureValueOfCurrentSavingsAtRetirement = currentSavings * Math.pow(1 + expectedReturn, yearsToRetirement);
          const additionalAmountNeededAtRetirement = requiredSavings - futureValueOfCurrentSavingsAtRetirement;

          if (additionalAmountNeededAtRetirement > 0) {
              if (monthlyReturn !== 0) {
                  monthlyNeeded = (additionalAmountNeededAtRetirement * monthlyReturn) /
                                  (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1);
              } else {
                  monthlyNeeded = additionalAmountNeededAtRetirement / monthsToRetirement;
              }
              monthlyNeeded = Math.max(0, monthlyNeeded - monthlyEmployerMatch);
          }
      }

      const calculations = {
        timeline: {
          currentAge,
          retirementAge,
          yearsToRetirement,
          yearsInRetirement: Math.max(0, 85 - retirementAge)
        },
        savings: {
          current: currentSavings,
          projected: totalRetirementSavings,
          required: requiredSavings,
          shortfall,
          surplus,
          onTrack
        },
        contributions: {
          monthly: monthlyContribution,
          employerMatch: monthlyEmployerMatch,
          total: totalMonthlyContribution,
          monthlyNeeded: isFinite(monthlyNeeded) ? monthlyNeeded : Infinity,
        },
        income: {
          currentSalary: salary,
          retirementExpensesAnnualTarget: retirementExpensesInflated,
          socialSecurityAnnual: socialSecurity,
          requiredIncomeFromSavingsAnnual: annualRetirementIncomeNeedFromSavings,
          projectedIncomeFromSavingsAnnual: isFinite(totalRetirementSavings) ? totalRetirementSavings * safeWithdrawalRate : Infinity,
        },
        assumptions: {
          expectedReturn: expectedReturn * 100,
          inflationRate: inflationRate * 100,
          withdrawalRate: safeWithdrawalRate * 100,
          expenseRatio: retirementExpenses * 100
        },
        yearlyProjection,
        milestones: {
          halfwayPoint: {
            age: currentAge + Math.floor(yearsToRetirement / 2),
            targetSavings: isFinite(requiredSavings) ? requiredSavings * 0.3 : Infinity 
          },
          tenYearsOut: {
            age: retirementAge - 10,
            targetSavings: isFinite(requiredSavings) ? requiredSavings * 0.7 : Infinity
          }
        }
      };

      setResults(calculations);
    } catch (error) {
      console.error('Retirement calculation error:', error);
      setResults({ error: "An error occurred during calculation." });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const exportResults = () => {
    if (!results || results.error) return;
    const dataToExport = { ...results };
    delete dataToExport.error;

    const data = {
      country: countries[selectedCountry]?.name || 'N/A',
      currency: countries[selectedCountry]?.currency || 'N/A',
      ...formData,
      ...dataToExport,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `retirement-calculation-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (!results || results.error || !navigator.share) return;
    try {
      await navigator.share({
        title: 'Retirement Planning Results',
        text: `Projected Savings: ${formatCurrency(results.savings.projected, undefined, {notation: 'compact'})}\nRequired Savings: ${formatCurrency(results.savings.required, undefined, {notation: 'compact'})}`,
        url: window.location.href
      });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  const currentCountryName = countries[selectedCountry]?.name || 'your region';
  const currentCurrencySymbol = countries[selectedCountry]?.currency || '$';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `Retirement Calculator - ${currentCountryName}`,
    "description": `Plan your retirement savings and calculate your future nest egg in ${currentCountryName}. Includes 401k calculator, IRA planning, and investment growth projections.`,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript.",
    "featureList": [
      "Retirement Planning Calculator",
      "401k Contribution Calculator", 
      "Investment Growth Projection",
      "Inflation-Adjusted Calculations",
      "Social Security Integration",
      "Employer Match Calculator",
      "Retirement Goal Planning",
      "Multi-Scenario Analysis"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0"
    },
    "provider": {
      "@type": "Organization",
      "name": "WageCalculator"
    }
  };

  // Animation variants
  const fadeInY = (delay = 0, duration = 0.5) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration, delay, ease: "circOut" } },
  });

  return (
    <>
      <SEOHead 
        title={`Free Retirement Calculator 2024 - 401k & IRA Planning Tool for ${currentCountryName}`}
        description={`Plan your retirement with our free calculator. Calculate 401k, IRA, and pension savings. Get accurate projections for retirement planning in ${currentCountryName} with inflation adjustments and detailed analysis.`}
        keywords={`retirement calculator ${currentCountryName}, 401k calculator ${currentCountryName}, retirement planning ${currentCountryName}, pension calculator ${currentCountryName}, retirement savings calculator ${currentCountryName}, IRA calculator ${currentCountryName}, retirement planning tool ${currentCountryName}, free retirement calculator, retirement goal calculator, nest egg calculator, retirement income calculator`}
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
                <TrendingUp className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  Retirement Calculator
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Plan your financial future and calculate if you're on track for retirement in {currentCountryName}. 
                Get comprehensive projections for 401k, IRA, and pension planning.
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
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-neutral-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <PiggyBank className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
                    Retirement Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Age</label>
                        <input 
                          type="number" 
                          name="currentAge" 
                          value={formData.currentAge} 
                          onChange={handleInputChange} 
                          placeholder="30" 
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Retirement Age</label>
                        <input 
                          type="number" 
                          name="retirementAge" 
                          value={formData.retirementAge} 
                          onChange={handleInputChange} 
                          placeholder="65" 
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Retirement Savings ({currentCurrencySymbol})</label>
                      <input 
                        type="number" 
                        name="currentSavings" 
                        value={formData.currentSavings} 
                        onChange={handleInputChange} 
                        placeholder="10000" 
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Monthly Contribution</label>
                        <input 
                          type="number" 
                          name="monthlyContribution" 
                          value={formData.monthlyContribution} 
                          onChange={handleInputChange} 
                          placeholder="500" 
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Annual Salary</label>
                        <input 
                          type="number" 
                          name="salary" 
                          value={formData.salary} 
                          onChange={handleInputChange} 
                          placeholder="60000" 
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Employer Match (%)</label>
                        <input 
                          type="number" 
                          name="employerMatch" 
                          value={formData.employerMatch} 
                          onChange={handleInputChange} 
                          placeholder="3" 
                          step="0.1"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected Return (%)</label>
                        <input 
                          type="number" 
                          name="expectedReturn" 
                          value={formData.expectedReturn} 
                          onChange={handleInputChange} 
                          placeholder="7" 
                          step="0.1"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Inflation Rate (%)</label>
                        <input 
                          type="number" 
                          name="inflationRate" 
                          value={formData.inflationRate} 
                          onChange={handleInputChange} 
                          placeholder="3" 
                          step="0.1"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Retirement Expenses (%)</label>
                        <input 
                          type="number" 
                          name="retirementExpenses" 
                          value={formData.retirementExpenses} 
                          onChange={handleInputChange} 
                          placeholder="80"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Annual Social Security (Optional)</label>
                      <input 
                        type="number" 
                        name="socialSecurity" 
                        value={formData.socialSecurity} 
                        onChange={handleInputChange} 
                        placeholder="0"
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-200"
                      />
                    </div>
                  </div>

                  {results && !results.error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
                    >
                      <button 
                        onClick={exportResults} 
                        className="flex-1 inline-flex justify-center items-center px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Export
                      </button>
                      {navigator.share && (
                        <button 
                          onClick={shareResults} 
                          className="flex-1 inline-flex justify-center items-center px-4 py-3 border-2 border-transparent shadow-sm text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 transition-all duration-200"
                        >
                          <Share2 className="w-5 h-5 mr-2" />
                          Share
                        </button>
                      )}
                    </motion.div>
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
                  <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 dark:border-primary-400 mb-6"></div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Calculating Your Retirement Plan</h3>
                    <p className="text-gray-500 dark:text-gray-400">Processing projections and inflation adjustments...</p>
                  </div>
                ) : results ? (
                  results.error ? (
                    <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center text-red-600 border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                      <Info className="w-16 h-16 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Calculation Error</h3>
                      <p className="text-sm">{results.error}</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <RetirementBreakdown results={results} />
                      <RetirementChart results={results} />
                    </div>
                  )
                ) : (
                  <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-neutral-700" style={{minHeight: '400px'}}>
                    <TrendingUp className="w-20 h-20 mb-6 text-gray-300 dark:text-neutral-600" />
                    <h3 className="text-2xl font-semibold mb-2">Ready to Plan Your Retirement</h3>
                    <p className="text-lg mb-4">Enter your retirement information to see comprehensive projections</p>
                    <p className="text-sm">Results will include savings targets, investment growth, and retirement readiness analysis</p>
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
                Advanced Retirement Planning Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Professional-grade retirement planning tools with comprehensive analysis and projections.
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
                Complete Your Retirement Planning
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explore our comprehensive suite of financial calculators for complete retirement preparation.
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
                Complete Retirement Planning Guide for {currentCountryName}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Master your retirement planning with our comprehensive guide covering 401k optimization, IRA strategies, 
                investment allocation, and financial independence planning in {currentCountryName}.
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
                  <Target className="w-8 h-8 text-primary-600 dark:text-primary-400 mr-3" />
                  Understanding Retirement Planning Fundamentals
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Retirement planning is one of the most critical aspects of personal finance, requiring careful consideration 
                  of multiple factors including current income, desired retirement lifestyle, inflation, investment returns, 
                  and longevity. The key to successful retirement planning lies in starting early and leveraging the power 
                  of compound interest over decades.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  In {currentCountryName}, retirement planning involves understanding various account types such as 401k plans, 
                  traditional and Roth IRAs, pension plans, and Social Security benefits. Each of these vehicles has different 
                  contribution limits, tax treatments, and withdrawal rules that can significantly impact your retirement 
                  readiness and income strategies.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The 4% withdrawal rule, while not perfect, provides a useful starting point for estimating how much you need 
                  to save for retirement. This rule suggests that you can safely withdraw 4% of your retirement portfolio 
                  annually without depleting your principal over a 30-year retirement period, adjusted for inflation.
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
                    <PiggyBank className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                    401k and Employer-Sponsored Plans
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    401k plans are the cornerstone of retirement savings for most employees in {currentCountryName}. These 
                    employer-sponsored plans allow you to contribute pre-tax dollars, reducing your current taxable income 
                    while building retirement wealth.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Employer matching contributions represent free money that can significantly boost your retirement savings. 
                    Always contribute enough to receive the full employer match, as this provides an immediate 100% return 
                    on your investment. Understanding vesting schedules is also crucial for job mobility decisions.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                    Investment Strategy and Asset Allocation
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Your investment strategy should align with your time horizon, risk tolerance, and retirement goals. 
                    Younger investors can typically afford more aggressive portfolios with higher stock allocations, 
                    while those closer to retirement may prefer more conservative approaches.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Diversification across asset classes, geographic regions, and investment styles helps reduce risk while 
                    capturing market returns. Consider low-cost index funds and ETFs to minimize fees that can erode returns 
                    over decades of investing.
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
                  <Calculator className="w-8 h-8 text-amber-600 dark:text-amber-400 mr-3" />
                  Maximizing Your Retirement Savings Potential
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tax-Advantaged Strategies</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Utilize all available tax-advantaged accounts including 401k, IRA, HSA, and backdoor Roth conversions. 
                      Understanding the tax implications of different account types helps optimize your retirement income strategy.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Catch-Up Contributions</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Individuals aged 50 and older can make additional catch-up contributions to 401k and IRA accounts. 
                      These higher contribution limits can significantly accelerate retirement savings in your final working years.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Inflation Protection</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Plan for inflation's impact on your retirement purchasing power. Consider Treasury Inflation-Protected 
                      Securities (TIPS), real estate, and stocks as potential inflation hedges in your portfolio.
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
                  <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
                  Retirement Timeline and Milestones
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Age-Based Savings Targets</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Financial experts suggest having 1x your annual salary saved by age 30, 3x by age 40, 6x by age 50, 
                      8x by age 60, and 10x by age 67. These milestones provide benchmarks to track your retirement readiness 
                      and make adjustments to your savings strategy as needed.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Pre-Retirement Planning (Ages 50-65)</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      The decade before retirement is crucial for fine-tuning your strategy. Consider maximizing catch-up 
                      contributions, reducing investment risk gradually, planning for healthcare costs, and developing a 
                      withdrawal strategy that minimizes taxes while providing stable income.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Social Security Optimization</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Understanding Social Security benefits and timing strategies can significantly impact your retirement 
                      income. Delaying benefits past full retirement age can increase payments by up to 8% per year until age 70, 
                      while claiming early reduces benefits permanently.
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Retirement Planning FAQ</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How much should I save for retirement?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Most financial advisors recommend saving 10-15% of your gross income for retirement, including employer 
                      contributions. However, the exact amount depends on your desired retirement lifestyle, expected Social 
                      Security benefits, pension plans, and the age you plan to retire.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What's the difference between traditional and Roth accounts?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Traditional 401k and IRA contributions are made with pre-tax dollars, reducing current taxable income 
                      but requiring taxes on withdrawals in retirement. Roth contributions are made with after-tax dollars, 
                      but qualified withdrawals in retirement are tax-free, including investment growth.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">When can I access my retirement savings without penalties?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Generally, you can access 401k and traditional IRA funds without the 10% early withdrawal penalty 
                      starting at age 59½. Roth IRA contributions can be withdrawn anytime without penalty, while earnings 
                      require the account to be open for 5 years and the owner to be 59½ or meet other qualifying exceptions.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How do I catch up if I started saving late?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      If you're behind on retirement savings, maximize contributions to all available accounts, take advantage 
                      of catch-up contributions if you're 50+, consider working a few extra years, reduce planned retirement 
                      expenses, and potentially delay Social Security benefits to increase monthly payments.
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

        {/* Information Section - Updated */}
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
                    Retirement Planning Guidelines & Disclaimer
                  </h3>
                  <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none">
                    <p className="mb-3">
                      This retirement calculator uses the 4% withdrawal rule and standard retirement planning assumptions 
                      to project your retirement readiness. Results are estimates based on your inputs and should be 
                      considered as educational guidance rather than professional financial advice.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 my-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Assumptions Used:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• <strong>4% Rule:</strong> Withdraw 4% of savings annually in retirement</li>
                          <li>• <strong>Life Expectancy:</strong> Projections assume retirement lasting to age 85</li>
                          <li>• <strong>Investment Returns:</strong> Based on historical market averages</li>
                          <li>• <strong>Inflation Impact:</strong> Accounts for decreased purchasing power over time</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Important Considerations:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Market volatility can significantly impact actual returns</li>
                          <li>• Healthcare costs may require additional planning</li>
                          <li>• Tax law changes can affect retirement income strategies</li>
                          <li>• Individual circumstances vary significantly</li>
                        </ul>
                      </div>
                    </div>
                    
                    <p className="font-semibold text-amber-600 dark:text-amber-400">
                      Always consult with qualified financial advisors, tax professionals, or retirement planning specialists 
                      for personalized advice. This calculator should supplement, not replace, comprehensive retirement planning 
                      with professionals who understand your complete financial situation.
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

export default RetirementCalculator;