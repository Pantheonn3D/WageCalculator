// src/pages/FinancialGuides.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, DollarSign, PiggyBank, CreditCard, TrendingUp,
  Shield, Home, Briefcase, GraduationCap, ChevronRight, Mail, XCircle,
  Star, Users, Award, CheckCircle, ArrowRight, Target, BarChart3,
  Calculator, Clock, Globe, Zap, Filter, Grid3x3, List
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/seo/SEOHead';

// Import all guide articles (these should now have a 'slug' property)
import { salaryBenefitsGuide } from './guides/salaryBenefitsGuide.js';
import { budgetingGuide } from './guides/budgetingGuide.js';
import { debtManagementGuide } from './guides/debtManagementGuide.js';
import { investingBasicsGuide } from './guides/investingBasicsGuide.js';
import { insuranceGuide } from './guides/insuranceGuide.js';
import { homeBuyingGuide } from './guides/homeBuyingGuide.js';
import { taxPlanningGuide } from './guides/taxPlanningGuide.js';
import { retirementPlanningGuide } from './guides/retirementPlanningGuide.js';
import { studentLoansGuide } from './guides/studentLoansGuide.js';
import { emergencyFundGuide } from './guides/emergencyFundGuide.js';
import { creditScoreGuide } from './guides/creditScoreGuide.js';
import { realEstateInvestingGuide } from './guides/realEstateInvestingGuide.js';

// Combine all guide articles - THIS IS EXPORTED for GuideDetailPage.jsx
export const guideArticles = [
  salaryBenefitsGuide,
  budgetingGuide,
  debtManagementGuide,
  investingBasicsGuide,
  insuranceGuide,
  homeBuyingGuide,
  taxPlanningGuide,
  retirementPlanningGuide,
  studentLoansGuide,
  emergencyFundGuide,
  creditScoreGuide,
  realEstateInvestingGuide
];

// Featured benefits for the hero section
const FEATURED_BENEFITS = [
  "Expert financial guidance",
  "Comprehensive coverage", 
  "Practical actionable tips",
  "Regular updates"
];

// Related tools for cross-promotion
const RELATED_TOOLS = [
  { title: 'Salary Calculator', href: '/salary-calculator', icon: Calculator, description: 'Calculate your take-home pay' },
  { title: 'Budget Planner', href: '/budget-calculator', icon: Target, description: 'Plan your monthly budget' },
  { title: 'Investment Calculator', href: '/investment-calculator', icon: TrendingUp, description: 'Calculate investment returns' },
  { title: 'Retirement Calculator', href: '/retirement-calculator', icon: Briefcase, description: 'Plan for retirement' }
];

// Hub features
const HUB_FEATURES = [
  { icon: Zap, title: 'Expert Insights', description: 'Professional financial advice from certified experts' },
  { icon: Globe, title: 'Comprehensive Coverage', description: 'All aspects of personal finance in one place' },
  { icon: CheckCircle, title: 'Actionable Tips', description: 'Practical steps you can implement immediately' },
  { icon: Clock, title: 'Always Updated', description: 'Latest financial trends and regulatory changes' }
];

// Metadata for icons and colors - associate with guide ID
const guideIconsAndColors = {
  1: { icon: DollarSign, color: 'bg-blue-100 text-blue-700', gradient: 'from-blue-500 to-blue-600' },
  2: { icon: PiggyBank, color: 'bg-green-100 text-green-700', gradient: 'from-green-500 to-green-600' },
  3: { icon: CreditCard, color: 'bg-red-100 text-red-700', gradient: 'from-red-500 to-red-600' },
  4: { icon: TrendingUp, color: 'bg-purple-100 text-purple-700', gradient: 'from-purple-500 to-purple-600' },
  5: { icon: Shield, color: 'bg-indigo-100 text-indigo-700', gradient: 'from-indigo-500 to-indigo-600' },
  6: { icon: Home, color: 'bg-yellow-100 text-yellow-700', gradient: 'from-yellow-500 to-yellow-600' },
  7: { icon: BarChart3, color: 'bg-orange-100 text-orange-700', gradient: 'from-orange-500 to-orange-600' },
  8: { icon: Briefcase, color: 'bg-teal-100 text-teal-700', gradient: 'from-teal-500 to-teal-600' },
  9: { icon: GraduationCap, color: 'bg-pink-100 text-pink-700', gradient: 'from-pink-500 to-pink-600' },
  10: { icon: Shield, color: 'bg-emerald-100 text-emerald-700', gradient: 'from-emerald-500 to-emerald-600' },
  11: { icon: CreditCard, color: 'bg-rose-100 text-rose-700', gradient: 'from-rose-500 to-rose-600' },
  12: { icon: Home, color: 'bg-sky-100 text-sky-700', gradient: 'from-sky-500 to-sky-600' }
};

// Derive guides for display
const guidesForDisplay = guideArticles.map(article => ({
  id: article.id,
  slug: article.slug,
  title: article.title,
  description: article.description,
  category: article.category,
  readTime: article.readTime,
  keywords: article.keywords,
  difficulty: article.difficulty || 'Beginner',
  popularity: article.popularity || Math.floor(Math.random() * 1000) + 500,
  icon: guideIconsAndColors[article.id]?.icon || BookOpen,
  color: guideIconsAndColors[article.id]?.color || 'bg-gray-100 text-gray-700',
  gradient: guideIconsAndColors[article.id]?.gradient || 'from-gray-500 to-gray-600',
}));

// Categories data
const categories = [
  { id: 'all', name: 'All Guides', count: guidesForDisplay.length },
  { id: 'income', name: 'Income & Salary', count: guidesForDisplay.filter(g => g.category === 'income').length },
  { id: 'planning', name: 'Financial Planning', count: guidesForDisplay.filter(g => g.category === 'planning').length },
  { id: 'debt', name: 'Debt Management', count: guidesForDisplay.filter(g => g.category === 'debt').length },
  { id: 'investing', name: 'Investing', count: guidesForDisplay.filter(g => g.category === 'investing').length },
  { id: 'protection', name: 'Insurance', count: guidesForDisplay.filter(g => g.category === 'protection').length },
  { id: 'housing', name: 'Housing', count: guidesForDisplay.filter(g => g.category === 'housing').length },
  { id: 'taxes', name: 'Taxes', count: guidesForDisplay.filter(g => g.category === 'taxes').length },
  { id: 'retirement', name: 'Retirement', count: guidesForDisplay.filter(g => g.category === 'retirement').length },
  { id: 'credit', name: 'Credit', count: guidesForDisplay.filter(g => g.category === 'credit').length }
];

// Sort options
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'title', label: 'A-Z' },
  { value: 'readTime', label: 'Quick Reads' }
];

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const FinancialGuides = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredAndSortedGuides = useMemo(() => {
    let filtered = guidesForDisplay.filter(guide => {
      const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
      const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
      const matchesSearch =
        guide.title.toLowerCase().includes(lowerSearchTerm) ||
        guide.description.toLowerCase().includes(lowerSearchTerm) ||
        (guide.keywords && guide.keywords.toLowerCase().includes(lowerSearchTerm));
      return matchesCategory && matchesSearch;
    });

    // Sort guides
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.popularity - a.popularity;
        case 'newest':
          return b.id - a.id; // Assuming higher ID means newer
        case 'title':
          return a.title.localeCompare(b.title);
        case 'readTime':
          return parseInt(a.readTime) - parseInt(b.readTime);
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, debouncedSearchTerm, sortBy]);

  // Animation variants
  const fadeInY = (delay = 0, duration = 0.5) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration, delay, ease: "circOut" } },
  });

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Financial Guides and Resources | WageCalculator",
    "description": "Comprehensive financial education hub with expert guides on personal finance, budgeting, investing, retirement planning, debt management, and wealth building strategies.",
    "url": "https://yourwebsite.com/financial-guides",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": guidesForDisplay.map((guide, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "headline": guide.title,
          "description": guide.description,
          "url": `https://yourwebsite.com/financial-guides/${guide.slug}`,
        }
      }))
    }
  };

  return (
    <>
      <SEOHead
        title="Financial Guides & Personal Finance Education Hub | WageCalculator 2024"
        description="Master your finances with our comprehensive library of expert financial guides. Learn budgeting, investing, retirement planning, debt management, and wealth building strategies. Free financial education for everyone."
        keywords="financial guides, personal finance education, money management tips, financial literacy, budgeting guides, investing for beginners, retirement planning, debt management strategies, financial planning, wealth building"
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
                <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  Financial Knowledge Hub
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Master your financial future with expert guides, practical tips, and actionable strategies. 
                Your complete resource for financial literacy and wealth building.
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

              {/* Stats */}
              <motion.div
                variants={fadeInY(0.6, 0.6)}
                initial="initial"
                animate="animate"
                className="flex justify-center space-x-8 text-center"
              >
                <div>
                  <div className="text-3xl font-bold text-yellow-300">{guidesForDisplay.length}+</div>
                  <div className="text-blue-100 text-sm">Expert Guides</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-300">50K+</div>
                  <div className="text-blue-100 text-sm">Readers Monthly</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-300">4.9★</div>
                  <div className="text-blue-100 text-sm">User Rating</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 md:py-12 -mt-8 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInY(0, 0.6)}
              initial="initial"
              animate="animate"
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-neutral-700"
            >
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-2xl mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    aria-label="Search financial guides"
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-neutral-600 rounded-xl text-lg leading-5 bg-white dark:bg-neutral-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white transition-all duration-200"
                    placeholder="Search guides by topic, keyword, or financial goal..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <XCircle className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-600'
                      }`}
                    >
                      {category.name}
                      <span className="ml-2 text-xs opacity-75">({category.count})</span>
                    </button>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>

                  <div className="flex border border-gray-300 dark:border-neutral-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-neutral-700 text-gray-600 dark:text-gray-400'}`}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-neutral-700 text-gray-600 dark:text-gray-400'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredAndSortedGuides.length} of {guidesForDisplay.length} guides
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              {filteredAndSortedGuides.length > 0 ? (
                <motion.div
                  key={selectedCategory + debouncedSearchTerm + sortBy + viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  variants={staggerChildren}
                  className={
                    viewMode === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                      : "space-y-6"
                  }
                >
                  {filteredAndSortedGuides.map((guide, index) => {
                    const IconComponent = guide.icon;
                    const categoryName = categories.find(c => c.id === guide.category)?.name || guide.category;
                    
                    if (viewMode === 'list') {
                      return (
                        <motion.div
                          key={guide.id}
                          variants={fadeInY(0, 0.4)}
                          className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-neutral-700"
                        >
                          <Link to={`/financial-guides/${guide.slug}`} className="block p-6 group">
                            <div className="flex items-start space-x-6">
                              <div className={`p-4 rounded-xl bg-gradient-to-br ${guide.gradient} text-white shadow-lg flex-shrink-0`}>
                                <IconComponent className="w-8 h-8" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-3">
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {guide.title}
                                  </h3>
                                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 ml-4">
                                    <Clock className="w-4 h-4" />
                                    <span>{guide.readTime}</span>
                                  </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                  {guide.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${guide.color.replace('bg-', 'bg-opacity-20 ').replace('text-', 'text-')}`}>
                                      {categoryName}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                                      {guide.difficulty}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold group-hover:text-primary-700 dark:group-hover:text-primary-300">
                                    Read Guide
                                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={guide.id}
                        variants={fadeInY(0, 0.4)}
                        className="group"
                      >
                        <Link to={`/financial-guides/${guide.slug}`} className="block h-full">
                          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6 h-full hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-2 border border-gray-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-500">
                            <div className="flex items-center justify-between mb-6">
                              <div className={`p-4 rounded-xl bg-gradient-to-br ${guide.gradient} text-white shadow-lg`}>
                                <IconComponent className="w-8 h-8" />
                              </div>
                              <div className="text-right">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {guide.readTime}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Users className="w-4 h-4 mr-1" />
                                  {guide.popularity}
                                </div>
                              </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-3">
                              {guide.title}
                            </h3>
                            
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow mb-6">
                              {guide.description}
                            </p>
                            
                            <div className="mt-auto">
                              <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${guide.color.replace('bg-', 'bg-opacity-20 ').replace('text-', 'text-')}`}>
                                  {categoryName}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                                  {guide.difficulty}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-700">
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                                <span className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold inline-flex items-center group-hover:text-primary-700 dark:group-hover:text-primary-300">
                                  Read Guide
                                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  variants={fadeInY(0, 0.5)}
                  initial="initial"
                  animate="animate"
                  className="text-center py-16 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700"
                >
                  <Search className="w-20 h-20 text-gray-300 dark:text-neutral-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 mb-4">No Guides Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    We couldn't find any guides matching your criteria. Try different keywords or browse all categories.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                      className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Clear All Filters
                    </button>
                    <Link
                      to="/all-calculators"
                      className="px-6 py-3 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      Try Our Calculators
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                Why Our Financial Guides Excel
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Comprehensive, expert-backed financial education designed to empower your financial journey.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {HUB_FEATURES.map((feature, index) => {
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
                Complement Your Learning
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Apply what you learn with our suite of financial calculators and planning tools.
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
                      className="group block p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-500 h-full transform hover:-translate-y-1"
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

        {/* Comprehensive SEO Content Section */}
        <section className="py-20 md:py-24 bg-white dark:bg-neutral-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInY(0, 0.7)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Your Complete Financial Education Resource
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Discover everything you need to know about personal finance, from basic budgeting to advanced investment strategies. 
                Our expert-curated guides provide actionable insights for every stage of your financial journey.
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
                  <BookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400 mr-3" />
                  Comprehensive Financial Literacy Hub
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  In today's complex financial landscape, having access to reliable, expert-backed financial education is more important than ever. 
                  Our comprehensive financial guides cover every aspect of personal finance, from fundamental concepts like budgeting and saving 
                  to advanced topics such as investment portfolio management and retirement planning strategies.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Whether you're just starting your financial journey or looking to optimize your existing wealth-building strategies, 
                  our guides provide practical, actionable advice that you can implement immediately. Each guide is carefully researched 
                  and written by financial experts with years of experience in their respective fields.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Our mission is to democratize financial education and make complex financial concepts accessible to everyone, regardless 
                  of their background or current financial situation. We believe that financial literacy is the foundation of financial 
                  independence and long-term wealth building.
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
                    Personal Finance Fundamentals
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Master the basics of personal finance with our comprehensive guides on budgeting, saving strategies, and debt management. 
                    Learn how to create emergency funds, optimize your spending habits, and build a solid financial foundation.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Our budgeting guides teach you various methods including the 50/30/20 rule, zero-based budgeting, and envelope systems. 
                    Discover how to track expenses effectively, identify spending patterns, and make informed financial decisions that align 
                    with your goals and values.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                    Investment & Wealth Building
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Explore comprehensive investment strategies that cover everything from beginner-friendly index funds to advanced portfolio 
                    diversification techniques. Learn about different asset classes, risk management, and long-term wealth building strategies.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Our investment guides demystify complex topics like compound interest, dollar-cost averaging, and market volatility. 
                    Understand how to evaluate investment opportunities, build diversified portfolios, and maintain a long-term perspective 
                    despite market fluctuations.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInY(0.3, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
                  Risk Management & Protection Strategies
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Insurance Planning</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Understand different types of insurance coverage including life, health, disability, and property insurance. 
                      Learn how to assess your insurance needs and choose appropriate coverage levels.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Emergency Preparedness</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Build robust emergency funds and contingency plans to protect against unexpected financial challenges. 
                      Learn how to calculate appropriate emergency fund sizes based on your lifestyle and risk factors.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Estate Planning</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Discover the importance of wills, trusts, and beneficiary designations in protecting your wealth and 
                      ensuring your financial legacy is preserved according to your wishes.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInY(0.4, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="grid md:grid-cols-2 gap-8 mb-12"
              >
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Home className="w-6 h-6 text-amber-600 dark:text-amber-400 mr-2" />
                    Real Estate & Housing Finance
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Navigate the complex world of real estate with confidence. Our guides cover everything from first-time home buying 
                    to real estate investment strategies, mortgage optimization, and property management.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Learn about different mortgage types, down payment strategies, closing costs, and ongoing homeownership expenses. 
                    Understand how real estate fits into your overall investment portfolio and wealth-building strategy.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <CreditCard className="w-6 h-6 text-red-600 dark:text-red-400 mr-2" />
                    Credit & Debt Management
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Master credit management and debt elimination strategies that can save you thousands of dollars in interest payments. 
                    Learn how credit scores work, how to improve them, and how to use credit strategically.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Discover proven debt payoff methods like the debt snowball and avalanche strategies. Understand how to negotiate 
                    with creditors, consolidate debt effectively, and prevent future debt accumulation.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInY(0.5, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Briefcase className="w-8 h-8 text-teal-600 dark:text-teal-400 mr-3" />
                  Retirement & Long-term Planning
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Retirement Savings Strategies</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Plan for a comfortable retirement with comprehensive guides on 401(k)s, IRAs, Roth conversions, and pension planning. 
                      Learn how to calculate retirement needs, maximize employer matching, and optimize tax-advantaged accounts for long-term growth.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Social Security Optimization</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Understand Social Security benefits, claiming strategies, and how different factors affect your monthly payments. 
                      Learn about spousal benefits, survivor benefits, and optimal timing for claiming Social Security to maximize lifetime benefits.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Healthcare in Retirement</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Plan for healthcare costs in retirement including Medicare planning, long-term care insurance, and Health Savings Account (HSA) 
                      strategies. Understand how healthcare expenses can impact your retirement budget and plan accordingly.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInY(0.6, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <BarChart3 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
                  Tax Planning & Optimization
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tax-Efficient Investing</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                      Learn how to minimize tax liability through strategic investment choices, tax-loss harvesting, and asset location strategies. 
                      Understand the difference between tax-deferred and tax-free accounts.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Business Tax Strategies</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                      Explore tax strategies for self-employed individuals and small business owners, including deductions, retirement plans, 
                      and business structure optimization.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInY(0.7, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-gray-100 dark:bg-neutral-700 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How to Use Our Financial Guides Effectively</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Start with Your Goals</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Before diving into our guides, take time to identify your specific financial goals and current situation. Whether you're 
                      looking to get out of debt, save for a home, or plan for retirement, having clear objectives will help you choose the 
                      most relevant guides and implement their recommendations effectively.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Follow the Progressive Learning Path</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Our guides are organized to support progressive learning. Start with fundamental concepts like budgeting and emergency 
                      funds before moving to more advanced topics like investment strategies and tax optimization. Each guide builds upon 
                      previous knowledge to create a comprehensive understanding of personal finance.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Apply What You Learn</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Knowledge without action is worthless. Each guide includes practical steps and actionable recommendations that you can 
                      implement immediately. Use our financial calculators to model different scenarios and see how the strategies discussed 
                      in the guides apply to your specific situation.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Stay Updated and Review Regularly</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Financial markets, tax laws, and best practices evolve constantly. We regularly update our guides to reflect current 
                      information and emerging trends. Review the guides periodically and adjust your strategies as your financial situation 
                      and goals change over time.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 gradient-bg text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              variants={fadeInY(0, 0.8)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Mail className="w-16 h-16 text-yellow-300 mx-auto mb-8" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Stay Ahead of Your Financial Game
              </h2>
              <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
                Get exclusive financial insights, new guide notifications, and expert tips delivered to your inbox. 
                Join over 50,000 readers building wealth through financial education.
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); alert('Newsletter subscription coming soon!'); }} className="max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    name="email"
                    aria-label="Email address for newsletter"
                    placeholder="Enter your email address"
                    required
                    className="flex-grow px-6 py-4 rounded-xl text-lg focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-800 shadow-lg"
                  />
                  <button
                    type="submit"
                    className="bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    Subscribe Free
                  </button>
                </div>
              </form>
              
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-blue-200">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Unsubscribe anytime</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>No spam, ever</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50 dark:bg-neutral-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              variants={fadeInY(0, 0.8)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Transform Your Financial Future?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
                Take the first step towards financial independence. Explore our guides, use our calculators, 
                and start building the wealth you deserve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/all-calculators"
                  className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-300"
                >
                  Try Our Calculators
                </Link>
                <Link
                  to="/budgeting-guide"
                  className="bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 flex items-center group focus:outline-none focus:ring-4 focus:ring-primary-300"
                >
                  Start with Budgeting
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FinancialGuides;