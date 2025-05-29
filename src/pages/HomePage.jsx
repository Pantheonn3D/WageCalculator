// src/pages/HomePage.jsx

import React, { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, BarChart3, PiggyBank, CreditCard,
  Globe, Shield, Zap, Award, ChevronRight,
  Bookmark, // Added Bookmark icon
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

  const pageTitle = `Best finance calculators for all countries | WageCalculator`;
  const pageDescription = `Dynamically master your ${DYNAMIC_WORDS.join(', ').toLowerCase()} in ${staticCountryName}. Free financial calculators for salary, tax, savings, and loans worldwide.`;
  
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
    url: 'https://yourwebsite.com', // TODO: Replace with your actual domain
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All', 
    featureList: calculators.map(calc => calc.title),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, 
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '13000' }, // TODO: Replace with real data or remove
    provider: { '@type': 'Organization', name: 'WageCalculator', url: 'https://yourwebsite.com' } // TODO: Replace URL
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
        keywords={`${DYNAMIC_WORDS.join(', ')}, financial calculator, ${staticCountryName}, wage calculator, tax calculator, budget tool, savings planner, loan estimator, bookmark finance tools`} // Added bookmark keyword
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        {/* Hero Section */}
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
                  {/* THIS IS THE CORRECTED LINE */}
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
                Unlock financial clarity. Our free, precise calculators for salary, tax, savings, and loans are tailored for you.
              </p>
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

        {/* Stats Section */}
        <section className="py-16 lg:py-16 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {STATIC_STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInY(index * 0.1, 0.5)}
                  initial="initial"
                  whileInView="animate" 
                  viewport={{ once: true, amount: 0.3 }}
                  className="text-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors group"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculators Grid Section */}
        <section className="py-20 lg:py-24 bg-gray-50 dark:bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInY(0, 0.7)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Our Suite of Financial Tools
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                From income insights to loan planning, we have a calculator for every need.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {calculators.map((calc, index) => {
                const Icon = calc.icon;
                return (
                  <motion.div
                    key={calc.title}
                    variants={fadeInY(0.1 + index * 0.05, 0.6)} 
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.1 }}
                    className="h-full"
                  >
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
                  </motion.div>
                );
              })}
            </div>
             <motion.div
                variants={fadeInY(0.3, 0.7)} 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="text-center mt-16"
             >
                <Link
                  to="/all-calculators" 
                  aria-label="View all available financial calculators"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold group inline-flex items-center text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 rounded-md px-2 py-1"
                >
                  View All Calculators
                  <ChevronRight className="w-5 h-5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-24 bg-white dark:bg-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInY(0, 0.7)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Why Choose WageCalculator?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Empowering your financial decisions with tools built on trust, accuracy, and privacy.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={fadeInY(0.1 + index * 0.05, 0.6)}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.1 }}
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
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======== NEW: Your Financial Hub (Bookmark CTA) Section ======== */}
        <section className="py-16 lg:py-20 bg-gray-100 dark:bg-neutral-800 border-y dark:border-neutral-700">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div 
              variants={fadeInY(0.2, 0.7)} 
              initial="initial" 
              whileInView="animate" 
              viewport={{ once: true, amount: 0.3 }}
            >
              <Bookmark className="w-10 h-10 text-primary-500 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                Your Go-To Financial Hub
              </h3>
              <p className="text-gray-600 dark:text-gray-300 md:text-lg mb-6 max-w-xl mx-auto">
                Bookmark WageCalculator for quick access to all our financial tools and guides whenever you need them. We're constantly adding new features and updating information to help you stay ahead.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                (Tip: Press <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-200 dark:bg-neutral-600 dark:text-neutral-200 border border-gray-300 dark:border-neutral-500 rounded-md">Ctrl+D</kbd> or <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-200 dark:bg-neutral-600 dark:text-neutral-200 border border-gray-300 dark:border-neutral-500 rounded-md">Cmd+D</kbd> to bookmark)
              </p>
            </motion.div>
          </div>
        </section>
        {/* =============================================================== */}

        {/* CTA Section */}
        <section className="py-20 lg:py-24 gradient-bg text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              variants={fadeInY(0, 0.8)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                Ready to Master Your Finances?
              </h2>
              <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 mb-10 max-w-2xl mx-auto">
                Get started with our free, powerful tools. Join millions making smarter financial choices.
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
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;