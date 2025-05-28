// src/pages/AllCalculators.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calculator as PageIcon, // Main icon for the page
  DollarSign,
  Clock, // Used in HourlyCalculator
  Receipt, // Used in TaxCalculator
  PiggyBank,
  CreditCard,
  ArrowRightLeft, // Used in CurrencyConverter
  Scale, // Used in ComparisonTool
  TrendingUp, // Used for Retirement, could be different if you have a specific icon
  ChevronRight, // For card links
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead'; // Assuming path

// --- Data for All Calculators ---
const allCalculatorsData = [
  {
    id: 'salary',
    title: 'Salary Calculator',
    description: 'Convert annual, monthly, and hourly wages with tax insights.',
    icon: DollarSign, // From SalaryCalculator.jsx (Calculator icon was for page title there)
    href: '/salary-calculator',
    color: 'bg-sky-500',
  },
  {
    id: 'hourly',
    title: 'Hourly Wage Calculator',
    description: 'Calculate your annual salary from hourly wage, including overtime.',
    icon: Clock, // From HourlyCalculator.jsx
    href: '/hourly-calculator',
    color: 'bg-emerald-500',
  },
  {
    id: 'tax',
    title: 'Tax Calculator',
    description: 'Calculate income taxes and deductions for your region.',
    icon: Receipt, // From TaxCalculator.jsx
    href: '/tax-calculator',
    color: 'bg-violet-500',
  },
  {
    id: 'savings',
    title: 'Savings Calculator',
    description: 'Calculate compound interest and plan your savings goals.',
    icon: PiggyBank, // From SavingsCalculator.jsx
    href: '/savings-calculator',
    color: 'bg-pink-500',
  },
  {
    id: 'loan',
    title: 'Loan Calculator',
    description: 'Calculate loan payments, interest, and amortization schedules.',
    icon: CreditCard, // From LoanCalculator.jsx
    href: '/loan-calculator',
    color: 'bg-amber-500',
  },
    {
    id: 'retirement', // <<--- NEWLY ADDED
    title: 'Retirement Calculator',
    description: 'Plan your retirement savings and see if you\'re on track for your goals.',
    icon: TrendingUp, // Using TrendingUp as in its own page title
    href: '/retirement-calculator',
    color: 'bg-indigo-500',
  },
  {
    id: 'currency',
    title: 'Currency Converter',
    description: 'Convert between currencies with up-to-date exchange rates.',
    icon: ArrowRightLeft, // From CurrencyConverter.jsx
    href: '/currency-converter',
    color: 'bg-rose-500',
  },
  {
    id: 'comparison',
    title: 'Job Offer Comparison',
    description: 'Compare multiple job offers and find the best option.',
    icon: Scale, // From ComparisonTool.jsx
    href: '/job-comparison-tool',
    color: 'bg-cyan-500',
  },
  // Assuming Retirement Calculator is also a page you have or plan to have:
  // {
  //   id: 'retirement',
  //   title: 'Retirement Calculator',
  //   description: 'Plan for retirement by projecting investment growth and needs.',
  //   icon: TrendingUp, // Or a more specific retirement icon like Briefcase
  //   href: '/retirement-calculator',
  //   color: 'bg-indigo-500',
  // },
];
// --- End Data ---


const AllCalculators = () => {
  // Motion variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "All Financial Calculators | WageCalculator",
    "description": "Browse our complete suite of free online financial calculators for salary, tax, savings, loans, hourly wages, retirement, currency conversion, and job offer comparison.",
    "url": "https://yourwebsite.com/all-calculators", // Replace with your actual URL
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": allCalculatorsData.map((calc, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "WebApplication",
          "name": calc.title,
          "description": calc.description,
          "applicationCategory": "FinanceApplication",
          "url": `https://yourwebsite.com${calc.href}`,
          "operatingSystem": "All",
          "offers": { "@type": "Offer", "price": "0" }
        }
      }))
    }
  };

  return (
    <>
      <SEOHead
        title="All Financial Calculators - Salary, Tax, Savings, Loan & More"
        description="Access a comprehensive collection of free financial calculators. Plan your finances effectively with tools for income, taxes, savings, loans, investment planning, currency exchange, and offer comparison."
        keywords="all calculators, financial tools, salary calculator, tax estimator, savings planner, loan amortization, retirement planning, hourly wage calculator, currency converter, job offer comparison"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center justify-center bg-primary-100 text-primary-600 p-4 rounded-full mb-5 shadow-sm">
              <PageIcon className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Our Full Suite of Calculators
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore every tool we offer to help you manage your finances, plan for the future, and make informed decisions.
            </p>
          </motion.div>

          {/* Calculators Grid */}
          {allCalculatorsData.length > 0 ? (
            <motion.div
              initial="initial"
              animate="animate"
              variants={{
                animate: {
                  transition: {
                    staggerChildren: 0.07,
                  },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {allCalculatorsData.map((calc) => {
                const Icon = calc.icon;
                return (
                  <motion.div
                    key={calc.id || calc.title}
                    variants={fadeInUp}
                    className="flex" 
                  >
                    <Link
                      to={calc.href}
                      className="group flex flex-col justify-between h-full w-full bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 border border-gray-200 hover:border-primary-300"
                    >
                      <div>
                        <div className="flex items-start space-x-4 mb-5">
                          <div className={`${calc.color || 'bg-primary-600'} p-3.5 rounded-xl shadow-md text-white flex-shrink-0`}>
                            <Icon className="w-7 h-7" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary-600 transition-colors pt-1">
                            {calc.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed min-h-[3.5rem]"> {/* Added min-h for description consistency */}
                          {calc.description}
                        </p>
                      </div>
                      <div className="mt-auto pt-4 border-t border-gray-100 text-right">
                        <span className="text-primary-600 hover:text-primary-700 text-sm font-semibold inline-flex items-center">
                          Open Calculator
                          <ChevronRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-center py-16"
            >
              <PageIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-800">No Calculators Available</h3>
              <p className="mt-2 text-gray-600">
                We're working on adding more tools. Please check back soon!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllCalculators;