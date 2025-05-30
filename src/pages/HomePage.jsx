// src/pages/HomePage.jsx

import React, { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, BarChart3, PiggyBank, CreditCard,
  Globe, Shield, Zap, Award, ChevronRight, Bookmark, 
  Calculator, Clock, Target, PieChart, Users, CheckCircle, 
  ArrowRight, BookOpen, Info, Star, TrendingDown
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { useRegion } from '../context/RegionContext';

// Constants moved outside the component
const DYNAMIC_WORDS = ["Salary", "Taxes", "Budget", "Savings", "Loans", "Future"];
const LAZY_PARTICLES_DELAY_MS = 1500; 
const WORD_ANIMATION_INTERVAL_MS = 2800;
const COUNTRY_ANIMATION_INTERVAL_MS = 3000;

const LazyLoadedParticles = React.lazy(() => import('react-tsparticles'));

const STATIC_STATS = [
  { label: 'Countries Supported', value: '40+' },
  { label: 'Accurate Calculators', value: '8' }, 
  { label: 'User Satisfaction', value: '99%' },
  { label: 'Data Points Updated', value: 'Daily' },
];

const FEATURED_BENEFITS = [
  "Free forever - no hidden costs",
  "Privacy-first calculations", 
  "Real-time accurate results",
  "Multi-country support"
];

const FINANCIAL_TOPICS = [
  { icon: DollarSign, title: 'Salary Planning', description: 'Master your income calculations and tax planning' },
  { icon: PiggyBank, title: 'Savings Growth', description: 'Compound interest and wealth building strategies' },
  { icon: BarChart3, title: 'Tax Optimization', description: 'Minimize tax burden and maximize take-home pay' },
  { icon: TrendingUp, title: 'Investment Returns', description: 'Calculate and project investment growth' }
];

const CALCULATOR_CATEGORIES = [
  {
    title: 'Income Calculators',
    description: 'Calculate and convert different types of income',
    calculators: [
      { title: 'Salary Calculator', href: '/salary-calculator', icon: DollarSign, description: 'Convert annual, monthly, and hourly wages with tax insights' },
      { title: 'Hourly Calculator', href: '/hourly-calculator', icon: Clock, description: 'Estimate total earnings from hourly rates, including overtime' }
    ]
  },
  {
    title: 'Tax & Planning',
    description: 'Understand taxes and plan your financial future',
    calculators: [
      { title: 'Tax Calculator', href: '/tax-calculator', icon: BarChart3, description: 'Estimate income taxes based on current regulations' },
      { title: 'Retirement Calculator', href: '/retirement-calculator', icon: Target, description: 'Plan for retirement by projecting investment growth' }
    ]
  },
  {
    title: 'Savings & Loans',
    description: 'Grow wealth and understand debt obligations',
    calculators: [
      { title: 'Savings Calculator', href: '/savings-calculator', icon: PiggyBank, description: 'Project savings growth with compound interest scenarios' },
      { title: 'Loan Calculator', href: '/loan-calculator', icon: CreditCard, description: 'Understand monthly payments and total loan interest' }
    ]
  }
];

const POPULAR_CALCULATIONS = [
  { query: 'How much is $75,000 salary after taxes?', answer: 'Depends on location and deductions. Use our salary calculator for accurate results.' },
  { query: 'What is $25/hour annually?', answer: 'Approximately $52,000 per year (40 hours/week). Calculate precisely with our hourly calculator.' },
  { query: 'How much tax do I pay on $100,000?', answer: 'Tax rates vary by country and filing status. Get exact calculations with our tax calculator.' },
  { query: 'How much should I save for retirement?', answer: 'Generally 10-15% of income. Use our retirement calculator for personalized projections.' }
];

const HomePage = () => {
  const { selectedCountry, countries, formatCurrency: originalFormatCurrency } = useRegion();
  
  const staticCountryName = useMemo(() => countries[selectedCountry]?.name || 'your region', [countries, selectedCountry]);
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [animatedCountryName, setAnimatedCountryName] = useState(staticCountryName);
  const [currentCountryCycleIndex, setCurrentCountryCycleIndex] = useState(0);
  const [showParticles, setShowParticles] = useState(false);

  const formatCurrency = useCallback((amount, currencyCodeOverride, options = {}) => {
    if (typeof originalFormatCurrency === 'function') {
      return originalFormatCurrency(amount, currencyCodeOverride, options);
    }
    const code = currencyCodeOverride || countries[selectedCountry]?.currency || '$';
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return `${code}0.00`; 
    return `${code}${numAmount.toFixed(options.smartDecimals && numAmount % 1 === 0 ? 0 : 2)}`;
  }, [originalFormatCurrency, selectedCountry, countries]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParticles(true);
    }, LAZY_PARTICLES_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % DYNAMIC_WORDS.length);
    }, WORD_ANIMATION_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []); 

  useEffect(() => {
    const countryNameArray = countries ? Object.values(countries).map(c => c.name) : [];
    if (countryNameArray.length === 0) {
      setAnimatedCountryName(staticCountryName); 
      return;
    }

    let initialIndex = countryNameArray.indexOf(staticCountryName);
    if (initialIndex === -1 || staticCountryName === 'your region') {
      initialIndex = 0; 
    }
    
    if (initialIndex >= 0 && initialIndex < countryNameArray.length) {
        setAnimatedCountryName(countryNameArray[initialIndex]);
        setCurrentCountryCycleIndex(initialIndex);
    } else if (countryNameArray.length > 0) { 
        setAnimatedCountryName(countryNameArray[0]);
        setCurrentCountryCycleIndex(0);
    }

    const countryIntervalId = setInterval(() => {
      setCurrentCountryCycleIndex(prevIndex => {
        if (countryNameArray.length === 0) return prevIndex;
        const nextIndex = (prevIndex + 1) % countryNameArray.length;
        setAnimatedCountryName(countryNameArray[nextIndex]);
        return nextIndex;
      });
    }, COUNTRY_ANIMATION_INTERVAL_MS);

    return () => clearInterval(countryIntervalId);
  }, [countries, staticCountryName]); 

  const pageTitle = `Free Financial Calculators for ${staticCountryName} - Salary, Tax, Savings & More | WageCalculator`;
  const pageDescription = `Calculate salary, taxes, savings, and loans in ${staticCountryName}. Free, accurate financial calculators with detailed breakdowns. Get instant results for better financial planning.`;
  
  const calculators = useMemo(() => [
    { title: 'Salary Calculator', description: 'Convert annual, monthly, and hourly wages with tax insights.', icon: DollarSign, href: '/salary-calculator', color: 'bg-sky-500', exampleText: 'Gross Income:', exampleValue: formatCurrency(75000, undefined, {smartDecimals: true}) },
    { title: 'Hourly Calculator', description: 'Estimate total earnings from hourly rates, including overtime.', icon: TrendingUp, href: '/hourly-calculator', color: 'bg-emerald-500', exampleText: 'Rate:', exampleValue: `${formatCurrency(25, undefined, {smartDecimals: true})}/hr` },
    { title: 'Tax Calculator', description: 'Estimate income taxes based on current regulations.', icon: BarChart3, href: '/tax-calculator', color: 'bg-violet-500', exampleText: 'Effective Rate:', exampleValue: '~22%' },
    { title: 'Savings Calculator', description: 'Project savings growth with compound interest scenarios.', icon: PiggyBank, href: '/savings-calculator', color: 'bg-pink-500', exampleText: 'Goal:', exampleValue: formatCurrency(10000, undefined, {smartDecimals: true}) },
    { title: 'Loan Calculator', description: 'Understand monthly payments and total loan interest.', icon: CreditCard, href: '/loan-calculator', color: 'bg-amber-500', exampleText: 'Mortgage:', exampleValue: `${formatCurrency(1850, undefined, {smartDecimals: true})}/mo` },
    { title: 'Retirement Calculator', description: 'Plan for retirement by projecting investment growth.', icon: TrendingUp, href: '/retirement-calculator', color: 'bg-indigo-500', exampleText: 'Portfolio:', exampleValue: formatCurrency(500000, undefined, {smartDecimals: true}) },
  ], [formatCurrency]);

  const features = useMemo(() => [
    { icon: Globe, title: 'Global Coverage', description: `Tailored calculations for ${staticCountryName} and 40+ other countries with local tax data.` },
    { icon: Shield, title: 'Privacy First', description: 'All calculations are processed in your browser. Your financial data is never stored by us.' },
    { icon: Zap, title: 'Constantly Updated', description: 'Tax information and currency exchange rates are regularly updated for maximum accuracy.' },
    { icon: Award, title: 'Reliable & Trusted', description: 'Clear, precise, and dependable tools, recognized by professionals and individuals alike.' },
  ], [staticCountryName]);

  const fadeInY = (delay = 0, duration = 0.5) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration, delay, ease: "circOut" } },
  });
  
  const wordAnimation = {
    initial: { opacity: 0, y: 10, rotateX: -90, filter: "blur(5px)" },
    animate: { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, rotateX: 90, filter: "blur(5px)", transition: { duration: 0.25, ease: "easeIn" } },
  };

  const structuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'WageCalculator - Financial Tools',
    description: pageDescription,
    url: 'https://wagecalculator.org',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All', 
    featureList: calculators.map(calc => calc.title),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, 
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '13000' },
    provider: { '@type': 'Organization', name: 'WageCalculator', url: 'https://wagecalculator.org' }
  }), [pageDescription, calculators]);

  const particlesOptions = useMemo(() => ({
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.3, color: "#ffffff" } },
        push: { quantity: 3 },
      },
    },
    particles: {
      color: { value: "rgba(255,255,255,0.5)" },
      links: { color: "rgba(255,255,255,0.2)", distance: 150, enable: true, opacity: 0.15, width: 1 },
      collisions: { enable: false },
      move: { direction: "none", enable: true, outModes: { default: "out" }, random: true, speed: 0.3, straight: false },
      number: { density: { enable: true, area: 1000 }, value: 30 },
      opacity: { value: {min: 0.05, max: 0.4} },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 2.5 } },
    },
    detectRetina: true,
  }), []);

  const customParticlesInit = useCallback(async (engine) => {
    const { loadSlim } = await import("tsparticles-slim");
    await loadSlim(engine);
  }, []);

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={`financial calculator ${staticCountryName}, salary calculator ${staticCountryName}, tax calculator ${staticCountryName}, budget calculator ${staticCountryName}, savings calculator ${staticCountryName}, loan calculator ${staticCountryName}, wage calculator ${staticCountryName}, retirement planner ${staticCountryName}, take home pay calculator ${staticCountryName}, net pay calculator ${staticCountryName}, hourly wage calculator ${staticCountryName}, income tax calculator ${staticCountryName}, compound interest calculator ${staticCountryName}, mortgage calculator ${staticCountryName}, free financial tools ${staticCountryName}`}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        {/* Hero Section - Immediately Visible */}
        <section className="gradient-bg text-white relative overflow-hidden min-h-[55vh] md:min-h-[65vh] flex items-center justify-center py-10">
          {showParticles && (
            <Suspense fallback={<div className="absolute inset-0 z-0 bg-transparent" />}>
              <LazyLoadedParticles
                id="tsparticles"
                init={customParticlesInit}
                options={particlesOptions}
                className="absolute inset-0 z-0" 
              />
            </Suspense>
          )}
          
          <div className="max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={fadeInY(0.1, 0.8)}
              initial="initial"
              animate="animate"
              className="text-center"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-extrabold mb-6 tracking-tighter text-balance">
                Master Your{' '}
                <span
                  className="inline-block relative text-center"
                  style={{ minWidth: '5ch' }} 
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={DYNAMIC_WORDS[currentWordIndex]}
                      variants={wordAnimation}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="text-yellow-300 inline-block"
                      style={{ perspective: '400px' }}
                    >
                      {DYNAMIC_WORDS[currentWordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                {' '}in{' '}
                <span
                  className="inline-block relative text-center"
                  style={{ minWidth: '20ch' }} 
                >
                  <AnimatePresence mode="wait"> 
                    <motion.span
                      key={animatedCountryName}
                      variants={wordAnimation}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="inline-block" 
                      style={{ perspective: '400px' }}
                    >
                      {animatedCountryName}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>
              <p className="text-lg md:text-xl mb-10 text-blue-100 dark:text-blue-200 max-w-3xl mx-auto text-balance">
                Unlock financial clarity with our comprehensive suite of free calculators. Get accurate results for salary, tax, savings, loans, and retirement planning tailored for {staticCountryName}.
              </p>
              
              {/* Benefits Grid - Immediately Visible */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                {FEATURED_BENEFITS.map((benefit, index) => (
                  <div
                    key={benefit}
                    className="flex items-center space-x-2 text-sm md:text-base"
                  >
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-blue-100">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/all-calculators"
                  className="bg-white text-primary-700 px-8 py-3.5 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-primary-600 dark:hover:bg-gray-100"
                  aria-label="Explore all financial calculators"
                >
                  Explore All Calculators
                </Link>
                <Link
                  to="/financial-guides"
                  className="glass-effect text-white px-8 py-3.5 rounded-lg font-semibold text-lg hover:bg-white/25 transition-all duration-200 flex items-center group focus:outline-none focus:ring-4 focus:ring-blue-300"
                  aria-label="Read our financial guides"
                >
                  Read Our Guides
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section - Immediately Visible */}
        <section className="py-16 lg:py-16 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {STATIC_STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors group"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculators Grid Section - Immediately Visible */}
        <section className="py-20 lg:py-24 bg-gray-50 dark:bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Free Financial Calculators for {staticCountryName}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From income insights to loan planning, we have a calculator for every financial need. All tools are free, accurate, and tailored for {staticCountryName}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {calculators.map((calc, index) => {
                const Icon = calc.icon;
                return (
                  <div key={calc.title} className="h-full">
                    <Link
                      to={calc.href}
                      aria-label={`Calculate ${calc.title.toLowerCase()}`}
                      className="group flex flex-col justify-between h-full p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-neutral-800 hover:border-primary-300 dark:hover:border-primary-500 border-2 border-transparent transform hover:-translate-y-1.5"
                    >
                      <div>
                        <div className="flex items-start space-x-4 mb-4">
                          <div className={`${calc.color} p-3.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors pt-1">
                            {calc.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed min-h-[3.5rem]">
                          {calc.description}
                        </p>
                      </div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-neutral-700 pt-3 mt-auto flex justify-between items-center">
                        <div className="min-h-[1.5em]"> 
                          <span className="text-gray-400 dark:text-gray-500">{calc.exampleText}</span> {calc.exampleValue}
                        </div>
                        <span className="text-primary-600 dark:text-primary-400 group-hover:text-primary-700 font-semibold inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Calculate
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-16">
              <Link
                to="/all-calculators" 
                aria-label="View all available financial calculators"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold group inline-flex items-center text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 rounded-md px-2 py-1"
              >
                View All Calculators
                <ChevronRight className="w-5 h-5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section - Immediately Visible */}
        <section className="py-20 lg:py-24 bg-white dark:bg-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Why Choose WageCalculator for {staticCountryName}?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Empowering your financial decisions with tools built on trust, accuracy, and privacy. Designed specifically for {staticCountryName} tax laws and regulations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="text-center p-6 bg-gray-50 dark:bg-neutral-700 rounded-xl hover:shadow-lg transition-shadow group"
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Calculator Categories Section - Immediately Visible */}
        <section className="py-20 lg:py-24 bg-gray-50 dark:bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Comprehensive Financial Planning Tools
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Organize your financial planning with our categorized calculator suite. Each tool is designed to work together for complete financial analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CALCULATOR_CATEGORIES.map((category, index) => (
                <div key={category.title} className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{category.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{category.description}</p>
                  
                  <div className="space-y-4">
                    {category.calculators.map((calc) => {
                      const Icon = calc.icon;
                      return (
                        <Link
                          key={calc.title}
                          to={calc.href}
                          className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors group"
                        >
                          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                            <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {calc.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{calc.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Financial Topics Section - Immediately Visible */}
        <section className="py-20 lg:py-24 bg-white dark:bg-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Master Key Financial Topics
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Understanding these core financial concepts will help you make better decisions and achieve your financial goals in {staticCountryName}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {FINANCIAL_TOPICS.map((topic, index) => {
                const Icon = topic.icon;
                return (
                  <div key={topic.title} className="text-center p-6 bg-gray-50 dark:bg-neutral-700 rounded-2xl hover:shadow-lg transition-all duration-300 group">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100 mb-3">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Popular Calculations FAQ - Immediately Visible */}
        <section className="py-20 lg:py-24 bg-gray-50 dark:bg-neutral-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Popular Financial Questions for {staticCountryName}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                Quick answers to the most common financial calculations our users search for.
              </p>
            </div>

            <div className="space-y-6">
              {POPULAR_CALCULATIONS.map((item, index) => (
                <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-start">
                    <span className="text-primary-600 dark:text-primary-400 mr-2 mt-1">Q:</span>
                    {item.query}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 ml-6">
                    <span className="text-primary-600 dark:text-primary-400 mr-2">A:</span>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/financial-guides"
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-lg"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Read Comprehensive Financial Guides
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Comprehensive SEO Content Section - Immediately Visible */}
        <section className="py-20 md:py-24 bg-white dark:bg-neutral-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <BookOpen className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Complete Financial Planning Guide for {staticCountryName}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Master your financial future with our comprehensive guide to salary calculations, tax planning, 
                savings strategies, and investment growth tailored specifically for {staticCountryName}.
              </p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 mb-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                  Understanding Financial Calculations in {staticCountryName}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Financial planning in {staticCountryName} requires understanding local tax laws, employment regulations, 
                  and economic conditions. Our calculators are specifically designed to account for the unique financial 
                  landscape of {staticCountryName}, including current tax rates, social security contributions, and 
                  standard employment practices.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Whether you're calculating your take-home pay from a salary offer, planning for retirement, or 
                  determining loan affordability, accurate calculations form the foundation of good financial decisions. 
                  Our tools help you understand not just the numbers, but what they mean for your financial future.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Each calculator includes detailed breakdowns and explanations, helping you learn while you calculate. 
                  This educational approach ensures you understand the factors affecting your finances and can make 
                  informed decisions about your money.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                    Salary and Income Planning
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Understanding your true take-home pay is crucial for effective budgeting and financial planning. 
                    In {staticCountryName}, various deductions affect your net income, including income taxes, social 
                    security contributions, and other mandatory deductions.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Our salary calculator accounts for all these factors, providing accurate estimates that help you 
                    compare job offers, plan major purchases, and set realistic savings goals.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <PiggyBank className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
                    Savings and Investment Growth
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Building wealth requires understanding the power of compound interest and consistent saving. 
                    Our savings calculator helps you see how small, regular contributions can grow into substantial 
                    wealth over time.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    By modeling different scenarios, you can optimize your savings strategy and understand the 
                    impact of factors like contribution frequency, interest rates, and time horizon on your goals.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-8 mb-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <BarChart3 className="w-8 h-8 text-amber-600 dark:text-amber-400 mr-3" />
                  Tax Optimization Strategies for {staticCountryName}
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Understanding Tax Brackets</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Progressive tax systems mean different portions of your income are taxed at different rates. 
                      Understanding marginal vs. effective tax rates helps you make better financial decisions.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Deduction Optimization</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Maximizing legitimate deductions can significantly reduce your tax burden. This includes 
                      retirement contributions, charitable giving, and other tax-advantaged strategies.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Timing Strategies</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Strategic timing of income and deductions can help manage your tax liability across 
                      multiple years, especially important for variable income or large financial transactions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-8 mb-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Target className="w-8 h-8 text-rose-600 dark:text-rose-400 mr-3" />
                  Long-term Financial Planning
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Retirement Planning Essentials</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Retirement planning in {staticCountryName} involves understanding government benefits, employer-sponsored 
                      plans, and personal savings strategies. Starting early and contributing consistently can dramatically 
                      impact your retirement security through the power of compound interest.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Emergency Fund Strategy</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Financial experts recommend maintaining 3-6 months of expenses in an emergency fund. This provides 
                      security during job transitions, medical emergencies, or economic downturns. Our calculators help 
                      you determine the right amount and timeline for building this crucial safety net.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Debt Management and Loans</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Understanding loan terms, interest calculations, and repayment strategies helps you make informed 
                      borrowing decisions. Whether it's a mortgage, car loan, or personal loan, our calculators show 
                      you the true cost of borrowing and help you compare different options.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-neutral-700 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Financial Planning Best Practices</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Start with Clear Goals</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Define specific, measurable financial goals with realistic timelines. Whether it's saving for a home, 
                      planning for retirement, or building an emergency fund, clear goals help guide your financial decisions 
                      and keep you motivated.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Regular Review and Adjustment</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Financial planning is not a one-time activity. Regularly review your progress, update your calculations 
                      as your situation changes, and adjust your strategies based on changing laws, market conditions, and 
                      personal circumstances.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Educate Yourself Continuously</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Financial laws, tax regulations, and economic conditions change regularly. Stay informed about changes 
                      that affect your finances in {staticCountryName}. Our blog and guides provide ongoing education to help 
                      you stay current with financial best practices.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Seek Professional Advice When Needed</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      While our calculators provide valuable insights, complex financial situations may benefit from 
                      professional advice. Consider consulting with financial advisors, tax professionals, or estate 
                      planners for personalized guidance on major financial decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bookmark CTA Section - Immediately Visible */}
        <section className="py-16 lg:py-20 bg-gray-100 dark:bg-neutral-800 border-y dark:border-neutral-700">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Bookmark className="w-10 h-10 text-primary-500 dark:text-primary-400 mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              Your Go-To Financial Hub for {staticCountryName}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 md:text-lg mb-6 max-w-xl mx-auto">
              Bookmark WageCalculator for quick access to all our financial tools and guides whenever you need them. 
              We're constantly adding new features and updating information to help you stay ahead with your finances in {staticCountryName}.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              (Tip: Press <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-200 dark:bg-neutral-600 dark:text-neutral-200 border border-gray-300 dark:border-neutral-500 rounded-md">Ctrl+D</kbd> or <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-200 dark:bg-neutral-600 dark:text-neutral-200 border border-gray-300 dark:border-neutral-500 rounded-md">Cmd+D</kbd> to bookmark)
            </p>
          </div>
        </section>

        {/* CTA Section - Immediately Visible */}
        <section className="py-20 lg:py-24 gradient-bg text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Ready to Master Your Finances in {staticCountryName}?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 mb-10 max-w-3xl mx-auto">
              Get started with our free, powerful tools designed specifically for {staticCountryName}. 
              Join millions making smarter financial choices with accurate, up-to-date calculations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/salary-calculator"
                aria-label="Calculate your salary"
                className="bg-white text-primary-700 px-8 py-3.5 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-primary-600 dark:hover:bg-gray-100"
              >
                Calculate Your Salary
              </Link>
              <Link
                to="/job-comparison-tool"
                aria-label="Compare financial offers and tools"
                className="glass-effect text-white px-8 py-3.5 rounded-lg font-semibold text-lg hover:bg-white/25 transition-all duration-200 flex items-center group focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Compare Financial Offers
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Disclaimer - Immediately Visible */}
        <div className="py-12 bg-gray-100 dark:bg-neutral-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-neutral-700 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-neutral-600">
              <div className="flex items-start space-x-4">
                <Info className="w-8 h-8 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Important Financial Disclaimer
                  </h3>
                  <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none">
                    <p className="mb-3">
                      These financial calculators provide estimates based on current rates and standard calculations for {staticCountryName}. 
                      Results are for informational and planning purposes only and should not be considered as professional financial, 
                      tax, or investment advice.
                    </p>
                    <p className="mb-3">
                      Individual financial situations vary significantly based on personal circumstances, local regulations, 
                      available deductions, and other factors not fully captured by these calculators. Financial laws and rates 
                      change frequently and may vary by jurisdiction within {staticCountryName}.
                    </p>
                    <p className="font-semibold text-amber-600 dark:text-amber-400">
                      Always consult with qualified financial advisors, tax professionals, or certified public accountants for 
                      advice tailored to your specific situation. These tools should supplement, not replace, professional 
                      financial guidance for important financial decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;