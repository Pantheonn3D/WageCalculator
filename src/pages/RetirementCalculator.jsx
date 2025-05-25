import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Download, Share2, Info } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { useRegion } from '../context/RegionContext';
import RetirementBreakdown from '../components/calculators/RetirementBreakdown';
import RetirementChart from '../components/calculators/RetirementChart';

// No global constants here that depend on formData

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
    // Trigger calculation if essential fields have values
    if (formData.currentAge && formData.retirementAge && formData.currentSavings && formData.salary) {
      calculateRetirement();
    } else {
      setResults(null); // Clear results if essential inputs are missing
    }
  }, [formData]); // Removed selectedCountry as a direct dependency for calculation if not used in tax part

  const calculateRetirement = async () => {
    setIsCalculating(true);
    
    try {
      const currentAge = parseInt(formData.currentAge) || 0; // Default to 0 if invalid
      const retirementAge = parseInt(formData.retirementAge) || 0; // Default to 0 if invalid
      
      // Initial validation for ages
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
      const retirementExpenses = parseFloat(formData.retirementExpenses) / 100 || 0.80; // Default to 80%
      const socialSecurity = parseFloat(formData.socialSecurity) || 0;
      // const retirementGoal = parseFloat(formData.retirementGoal) || 0; // Not used in current calculation logic for display

      let yearsToRetirement = retirementAge - currentAge;

      if (yearsToRetirement > 70) { // More reasonable cap for retirement planning
        console.warn("Years to retirement is very large ( > 70 years), results might be unrealistic or cause performance issues. Capping for stability if needed by formulas.");
        // Depending on the formula, you might still want to cap it for calculation stability,
        // or just let it run and rely on Infinity handling in the breakdown.
        // For example, if futureValueContributions becomes Infinity, then totalRetirementSavings will be.
        // If you cap yearsToRetirement here, it affects the projection.
        // yearsToRetirement = 70; // Example cap for calculation
      }
      if (yearsToRetirement <= 0) { // Handles retirementAge <= currentAge more explicitly
        console.warn("Retirement age must be greater than current age.");
        setResults({ error: "Retirement age must be greater than current age." });
        setIsCalculating(false);
        return;
      }


      const monthsToRetirement = yearsToRetirement * 12;
      const monthlyReturn = expectedReturn / 12;
      const monthlyEmployerMatch = (salary * employerMatch) / 12;

      // Future value of current savings
      let futureValueCurrentSavings = currentSavings;
      if (expectedReturn > -1) { // Avoid issues if expectedReturn is -100%
           futureValueCurrentSavings = currentSavings * Math.pow(1 + expectedReturn, yearsToRetirement);
      }


      // Future value of monthly contributions (yours + employer match)
      const totalMonthlyContribution = monthlyContribution + monthlyEmployerMatch;
      let futureValueContributions = 0;
      if (monthlyReturn !== 0 && totalMonthlyContribution > 0) {
        futureValueContributions = totalMonthlyContribution * 
          ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);
      } else if (totalMonthlyContribution > 0) { // Handles 0% return case
        futureValueContributions = totalMonthlyContribution * monthsToRetirement;
      }


      const totalRetirementSavings = futureValueCurrentSavings + futureValueContributions;

      // Calculate required income in retirement
      const currentExpenses = salary * retirementExpenses;
      const retirementExpensesInflated = currentExpenses * Math.pow(1 + inflationRate, yearsToRetirement);
      const annualRetirementIncomeNeedFromSavings = Math.max(0, retirementExpensesInflated - socialSecurity);

      // 4% withdrawal rule
      const safeWithdrawalRate = 0.04;
      const requiredSavings = annualRetirementIncomeNeedFromSavings / safeWithdrawalRate;

      // Year-by-year projection
      const yearlyProjection = [];
      let balance = currentSavings;
      let totalContributionsSoFar = currentSavings; // Start with initial savings
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
         // Safety break for extremely long projections to prevent browser freeze
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
          // Recalculate what's needed from contributions if there's a shortfall
          // FV = PV(1+r)^n + PMT[((1+r)^n - 1)/r]
          // PMT = (FV - PV(1+r)^n) * (r / ((1+r)^n - 1))
          const futureValueOfCurrentSavingsAtRetirement = currentSavings * Math.pow(1 + expectedReturn, yearsToRetirement);
          const additionalAmountNeededAtRetirement = requiredSavings - futureValueOfCurrentSavingsAtRetirement;

          if (additionalAmountNeededAtRetirement > 0) {
              if (monthlyReturn !== 0) {
                  monthlyNeeded = (additionalAmountNeededAtRetirement * monthlyReturn) /
                                  (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1);
              } else { // If 0% return, simple division
                  monthlyNeeded = additionalAmountNeededAtRetirement / monthsToRetirement;
              }
              // This 'monthlyNeeded' is the total (yours + employer).
              // To find *your* part:
              monthlyNeeded = Math.max(0, monthlyNeeded - monthlyEmployerMatch);
          }
      }


      const calculations = {
        timeline: {
          currentAge,
          retirementAge,
          yearsToRetirement,
          yearsInRetirement: Math.max(0, 85 - retirementAge) // Assume life expectancy of 85
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
          retirementExpensesAnnualTarget: retirementExpensesInflated, // Renamed for clarity
          socialSecurityAnnual: socialSecurity, // Renamed
          requiredIncomeFromSavingsAnnual: annualRetirementIncomeNeedFromSavings, // Renamed
          projectedIncomeFromSavingsAnnual: isFinite(totalRetirementSavings) ? totalRetirementSavings * safeWithdrawalRate : Infinity, // Renamed
        },
        assumptions: {
          expectedReturn: expectedReturn * 100,
          inflationRate: inflationRate * 100,
          withdrawalRate: safeWithdrawalRate * 100,
          expenseRatio: retirementExpenses * 100
        },
        yearlyProjection,
        // Milestones might need adjustment if requiredSavings is Infinity
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
    // ... (rest of exportResults - ensure it handles results.error)
    const dataToExport = { ...results };
    delete dataToExport.error; // Don't export the error object itself

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
    a.download = 'retirement-calculation.json';
    a.click();
    URL.revokeObjectURL(url); // Clean up
  };

  const shareResults = async () => {
    if (!results || results.error || !navigator.share) return;
    // ... (rest of shareResults - ensure it handles results.error)
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Retirement Calculator",
    "description": "Plan your retirement savings and calculate future nest egg",
    "applicationCategory": "FinanceApplication",
    "featureList": ["Retirement planning", "401k calculation", "Investment growth projection"]
  };

  return (
    <>
      <SEOHead 
        title={`Retirement Calculator - Plan Your Financial Future`}
        description={`Calculate your retirement savings needs and see if you're on track. Plan for 401k, IRA, and other retirement investments.`}
        keywords="retirement calculator, 401k calculator, retirement planning, pension calculator, retirement savings"
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
              <TrendingUp className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Retirement Calculator
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Plan your retirement savings and see if you're on track for your goals
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
              <div className="calculator-card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Retirement Information</h2>
                
                <div className="space-y-4">
                  {/* Inputs remain the same */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Age</label>
                    <input type="number" name="currentAge" value={formData.currentAge} onChange={handleInputChange} placeholder="30" className="input-field"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Planned Retirement Age</label>
                    <input type="number" name="retirementAge" value={formData.retirementAge} onChange={handleInputChange} placeholder="65" className="input-field"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Retirement Savings</label>
                    <input type="number" name="currentSavings" value={formData.currentSavings} onChange={handleInputChange} placeholder="10000" className="input-field"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Contribution</label>
                    <input type="number" name="monthlyContribution" value={formData.monthlyContribution} onChange={handleInputChange} placeholder="500" className="input-field"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Annual Salary</label>
                    <input type="number" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="60000" className="input-field"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employer Match (%)</label>
                    <input type="number" name="employerMatch" value={formData.employerMatch} onChange={handleInputChange} placeholder="3" className="input-field" step="0.1"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
                    <input type="number" name="expectedReturn" value={formData.expectedReturn} onChange={handleInputChange} placeholder="7" className="input-field" step="0.1"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inflation Rate (%)</label>
                    <input type="number" name="inflationRate" value={formData.inflationRate} onChange={handleInputChange} placeholder="3" className="input-field" step="0.1"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Expenses (% of current)</label>
                    <input type="number" name="retirementExpenses" value={formData.retirementExpenses} onChange={handleInputChange} placeholder="80" className="input-field"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Annual Social Security (Optional)</label>
                    <input type="number" name="socialSecurity" value={formData.socialSecurity} onChange={handleInputChange} placeholder="0" className="input-field"/>
                  </div>
                </div>

                {results && !results.error && ( // Only show if no error
                  <div className="mt-6 flex space-x-2">
                    <button onClick={exportResults} className="btn-secondary flex items-center space-x-2 flex-1">
                      <Download className="w-4 h-4" /> <span>Export</span>
                    </button>
                    {navigator.share && (
                      <button onClick={shareResults} className="btn-secondary flex items-center space-x-2 flex-1">
                        <Share2 className="w-4 h-4" /> <span>Share</span>
                      </button>
                    )}
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
                <div className="calculator-card flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : results ? (
                results.error ? (
                  <div className="calculator-card flex items-center justify-center h-64 text-red-600">
                    <div className="text-center">
                      <Info className="w-12 h-12 mx-auto mb-4" />
                      <p className="font-semibold">Calculation Error</p>
                      <p className="text-sm">{results.error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <RetirementBreakdown results={results} />
                    <RetirementChart results={results} />
                  </div>
                )
              ) : (
                <div className="calculator-card flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Enter your retirement information to see projections</p>
                  </div>
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
            <div className="calculator-card">
              {/* Information section content remains the same */}
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-primary-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Retirement Planning Guidelines</h3>
                  <div className="prose prose-sm text-gray-600">
                    <p>This calculator uses the 4% withdrawal rule and standard retirement planning assumptions to project your retirement readiness.</p>
                    <ul className="mt-3 space-y-1">
                      <li>• <strong>4% Rule:</strong> Withdraw 4% of your savings annually in retirement</li>
                      <li>• <strong>Employer Match:</strong> Always contribute enough to get the full company match</li>
                      <li>• <strong>Age Milestones:</strong> Aim for 1x salary saved by 30, 3x by 40, 10x by 67</li>
                      <li>• <strong>Inflation Impact:</strong> Your money's purchasing power decreases over time</li>
                      <li>• <strong>Diversification:</strong> Spread investments across different asset classes</li>
                    </ul>
                    <p className="mt-3">Start early, contribute consistently, and increase contributions with salary raises for best results.</p>
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

export default RetirementCalculator;