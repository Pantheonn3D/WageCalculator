import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Download, Share2, Info } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { useLocation } from 'react-router-dom';
import { useRegion } from '../context/RegionContext';
import { calculateTax } from '../utils/taxCalculations';
import SalaryBreakdown from '../components/calculators/SalaryBreakdown';
import SalaryChart from '../components/calculators/SalaryChart';

const SalaryCalculator = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion();
  const [formData, setFormData] = useState({
    salary: '',
    payPeriod: 'annual',
    workHours: countries[selectedCountry]?.workingHours?.standard || 40,
    vacationDays: countries[selectedCountry]?.vacationDays || 10,
    publicHolidays: countries[selectedCountry]?.holidays || 10,
    deductions: '',
    bonus: '',
    overtime: '',
  });
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (formData.salary && !isNaN(parseFloat(formData.salary))) {
      calculateSalary();
    }
  }, [formData, selectedCountry]);

  const calculateSalary = async () => {
    setIsCalculating(true);

    try {
      const salary = parseFloat(formData.salary) || 0;
      const workHours = parseFloat(formData.workHours) || 40;
      const vacationDays = parseFloat(formData.vacationDays) || 10;
      const publicHolidays = parseFloat(formData.publicHolidays) || 10;
      const deductions = parseFloat(formData.deductions) || 0;
      const bonus = parseFloat(formData.bonus) || 0;
      const overtime = parseFloat(formData.overtime) || 0;

      let annualSalary = salary;
      if (formData.payPeriod === 'monthly') annualSalary = salary * 12;
      if (formData.payPeriod === 'weekly') annualSalary = salary * 52;
      if (formData.payPeriod === 'hourly')
        annualSalary = salary * workHours * 52;

      const workingDaysPerYear = 365 - (vacationDays + publicHolidays + 104); // 104 = weekends
      const workingHoursPerYear = workingDaysPerYear * (workHours / 5);

      const grossAnnual = annualSalary + bonus + overtime;
      const taxInfo = calculateTax(grossAnnual, selectedCountry);
      const netAnnual = grossAnnual - taxInfo.totalTax - deductions;

      const calculations = {
        gross: {
          annual: grossAnnual,
          monthly: grossAnnual / 12,
          weekly: grossAnnual / 52,
          daily: grossAnnual / workingDaysPerYear,
          hourly: grossAnnual / workingHoursPerYear,
        },
        net: {
          annual: netAnnual,
          monthly: netAnnual / 12,
          weekly: netAnnual / 52,
          daily: netAnnual / workingDaysPerYear,
          hourly: netAnnual / workingHoursPerYear,
        },
        taxes: taxInfo,
        deductions: {
          voluntary: deductions,
          total: taxInfo.totalTax + deductions,
        },
        workInfo: {
          workingDays: workingDaysPerYear,
          workingHours: workingHoursPerYear,
          vacationDays,
          publicHolidays,
        },
      };

      setResults(calculations);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const exportResults = () => {
    if (!results) return;

    const data = {
      country: countries[selectedCountry].name,
      currency: countries[selectedCountry].currency,
      ...formData,
      ...results,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salary-calculation.json';
    a.click();
  };

  const shareResults = async () => {
    if (!results || !navigator.share) return;

    try {
      await navigator.share({
        title: 'Salary Calculation Results',
        text: `Gross Annual: ${formatCurrency(
          results.gross.annual
        )}\nNet Annual: ${formatCurrency(results.net.annual)}`,
        url: window.location.href,
      });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Salary Calculator',
    description: 'Calculate net salary after taxes and deductions',
    applicationCategory: 'FinanceApplication',
    featureList: [
      'Salary conversion',
      'Tax calculation',
      'Net pay calculation',
    ],
  };

  return (
    <>
      <SEOHead
        title={`Salary Calculator for ${
          countries[selectedCountry]?.name || 'Global'
        }`}
        description={`Calculate your net salary after taxes and deductions in ${
          countries[selectedCountry]?.name || 'any country'
        }. Convert between annual, monthly, weekly, and hourly wages.`}
        keywords="salary calculator, wage calculator, net salary, gross salary, tax calculator"
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
              Calculate your net salary after taxes and deductions for{' '}
              {countries[selectedCountry]?.name || 'your region'}
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
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Salary Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Amount
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="Enter your salary"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pay Period
                    </label>
                    <select
                      name="payPeriod"
                      value={formData.payPeriod}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="annual">Annual</option>
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="hourly">Hourly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Hours per Week
                    </label>
                    <input
                      type="number"
                      name="workHours"
                      value={formData.workHours}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vacation Days per Year
                    </label>
                    <input
                      type="number"
                      name="vacationDays"
                      value={formData.vacationDays}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Public Holidays
                    </label>
                    <input
                      type="number"
                      name="publicHolidays"
                      value={formData.publicHolidays}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Bonus (Optional)
                    </label>
                    <input
                      type="number"
                      name="bonus"
                      value={formData.bonus}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Deductions
                    </label>
                    <input
                      type="number"
                      name="deductions"
                      value={formData.deductions}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="input-field"
                    />
                  </div>
                </div>

                {results && (
                  <div className="mt-6 flex space-x-2">
                    <button
                      onClick={exportResults}
                      className="btn-secondary flex items-center space-x-2 flex-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                    {navigator.share && (
                      <button
                        onClick={shareResults}
                        className="btn-secondary flex items-center space-x-2 flex-1"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
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
                <div className="space-y-6">
                  <SalaryBreakdown results={results} />
                  <SalaryChart results={results} />
                </div>
              ) : (
                <div className="calculator-card flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Enter your salary information to see results</p>
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
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-primary-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How This Calculator Works
                  </h3>
                  <div className="prose prose-sm text-gray-600">
                    <p>
                      This salary calculator provides accurate net pay
                      calculations for{' '}
                      {countries[selectedCountry]?.name || 'your region'}
                      by applying current tax rates and standard deductions. The
                      calculations include:
                    </p>
                    <ul className="mt-3 space-y-1">
                      <li>• Federal and state/provincial income taxes</li>
                      <li>
                        • Social security and employment insurance contributions
                      </li>
                      <li>• Medicare/health insurance premiums</li>
                      <li>• Retirement plan contributions</li>
                      <li>• Other mandatory deductions</li>
                    </ul>
                    <p className="mt-3">
                      Results are estimates based on current tax legislation.
                      Consult a tax professional for personalized advice.
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
