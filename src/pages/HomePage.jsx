import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  BarChart3,
  PiggyBank,
  CreditCard,
  Users,
  Globe,
  Shield,
  Zap,
  Award,
  Clock,
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { useRegion } from '../context/RegionContext';

const HomePage = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion();
  const countryName = countries[selectedCountry]?.name || 'your region';

  const calculators = [
    {
      title: 'Salary Calculator',
      description:
        'Convert between annual, monthly, and hourly wages with tax calculations',
      icon: DollarSign,
      href: '/salary-calculator',
      color: 'bg-blue-500',
      example: formatCurrency(75000),
    },
    {
      title: 'Hourly Calculator',
      description:
        'Calculate annual income from hourly wages including overtime',
      icon: TrendingUp,
      href: '/hourly-calculator',
      color: 'bg-green-500',
      example: formatCurrency(25) + '/hr',
    },
    {
      title: 'Tax Calculator',
      description: 'Estimate federal, state, and local taxes on your income',
      icon: BarChart3,
      href: '/tax-calculator',
      color: 'bg-purple-500',
      example: 'Federal + State',
    },
    {
      title: 'Savings Calculator',
      description:
        'Plan your savings goals with compound interest calculations',
      icon: PiggyBank,
      href: '/savings-calculator',
      color: 'bg-pink-500',
      example: '10% annually',
    },
    {
      title: 'Loan Calculator',
      description: 'Calculate monthly payments and total interest for loans',
      icon: CreditCard,
      href: '/loan-calculator',
      color: 'bg-orange-500',
      example: '4.5% APR',
    },
    {
      title: 'Retirement Calculator',
      description: 'Plan for retirement with investment growth projections',
      icon: TrendingUp,
      href: '/retirement-calculator',
      color: 'bg-indigo-500',
      example: '401(k) + IRA',
    },
  ];

  const features = [
    {
      icon: Globe,
      title: 'Global Coverage',
      description:
        'Accurate calculations for 40+ countries with local tax rates and regulations',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description:
        'All calculations happen in your browser. We never store your financial data',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description:
        'Tax rates and exchange rates updated regularly for maximum accuracy',
    },
    {
      icon: Award,
      title: 'Professional Grade',
      description:
        'Used by HR professionals, accountants, and financial advisors worldwide',
    },
  ];

  const stats = [
    { label: 'Countries Supported', value: '40+' },
    { label: 'Calculations Performed', value: '2M+' },
    { label: 'User Satisfaction', value: '99%' },
    { label: 'Years of Service', value: '5+' },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'WageCalculator',
    description:
      'Free financial calculators for salary, tax, savings, and loan calculations worldwide',
    url: 'https://wagecalculator.com',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '12847',
    },
  };

  return (
    <>
      <SEOHead
        title={`Free Financial Calculators for ${countryName}`}
        description={`Calculate salaries, taxes, savings, and loans with our comprehensive financial calculators. Accurate calculations for ${countryName} and 40+ countries worldwide.`}
        keywords="salary calculator, wage calculator, tax calculator, savings calculator, loan calculator, financial calculator"
        structuredData={structuredData}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="gradient-bg text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                Financial Calculators for {countryName}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto text-balance">
                Calculate salaries, taxes, savings, and more with our
                comprehensive suite of financial tools. Accurate, fast, and free
                for all countries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/salary-calculator"
                  className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Calculating
                </Link>
                <Link
                  to="/financial-guides"
                  className="glass-effect text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculators Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Financial Calculators
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to make informed financial decisions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {calculators.map((calc, index) => {
                const Icon = calc.icon;
                return (
                  <motion.div
                    key={calc.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={calc.href}
                      className="calculator-card group hover:scale-105 transform transition-all duration-300 block"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`${calc.color} p-3 rounded-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {calc.title}
                          </h3>
                          <p className="text-gray-600 mb-3 leading-relaxed">
                            {calc.description}
                          </p>
                          <div className="text-sm font-medium text-primary-600">
                            Example: {calc.example}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose WageCalculator?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Trusted by millions worldwide for accurate financial
                calculations
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 gradient-bg text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Take Control of Your Finances?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join millions of users who trust WageCalculator for their
                financial planning needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/salary-calculator"
                  className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Calculate Your Salary
                </Link>
                <Link
                  to="/comparison-tool"
                  className="glass-effect text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-200"
                >
                  Compare Offers
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
