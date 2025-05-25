import React, { useState, useMemo, useEffect } from 'react'; // Added useMemo, useEffect
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import { BookOpen, Search, DollarSign, PiggyBank, CreditCard, TrendingUp, Shield, Home, Briefcase, GraduationCap, ChevronRight, Mail, XCircle } from 'lucide-react'; // Added ChevronRight, Mail, XCircle
import { Link } from 'react-router-dom'; // useNavigate removed as we are not handling newsletter submission here
import SEOHead from '../components/seo/SEOHead';

// Your guides data (remains the same)
const guides = [
  { id: 1, title: 'Understanding Your Salary and Benefits Package', description: 'Learn how to evaluate job offers, understand your pay structure, and maximize employee benefits.', category: 'income', icon: DollarSign, color: 'bg-blue-100 text-blue-700', readTime: '8 min read'},
  { id: 2, title: 'Creating a Personal Budget That Works', description: 'Step-by-step guide to creating a realistic budget that helps you manage expenses and save money.', category: 'planning', icon: PiggyBank, color: 'bg-green-100 text-green-700', readTime: '10 min read'},
  { id: 3, title: 'Managing Debt: Strategies for Paying Off Loans', description: 'Effective strategies for tackling different types of debt, from student loans to credit cards.', category: 'debt', icon: CreditCard, color: 'bg-red-100 text-red-700', readTime: '12 min read'},
  { id: 4, title: 'Introduction to Investing for Beginners', description: 'Learn the basics of investing, different asset classes, and how to start building a portfolio.', category: 'investing', icon: TrendingUp, color: 'bg-purple-100 text-purple-700', readTime: '15 min read'},
  { id: 5, title: 'Understanding Insurance: What Coverage Do You Need?', description: 'Navigate the complex world of insurance and learn what types of coverage are essential.', category: 'protection', icon: Shield, color: 'bg-indigo-100 text-indigo-700', readTime: '9 min read'},
  { id: 6, title: 'Buying Your First Home: A Complete Guide', description: 'Everything you need to know about the home buying process, from saving for a down payment to closing.', category: 'housing', icon: Home, color: 'bg-yellow-100 text-yellow-700', readTime: '18 min read'},
  { id: 7, title: 'Tax Planning Strategies to Minimize Your Bill', description: 'Legal strategies to reduce your tax liability and keep more of your hard-earned money.', category: 'taxes', icon: TrendingUp, color: 'bg-orange-100 text-orange-700', readTime: '11 min read'},
  { id: 8, title: 'Planning for Retirement: Start at Any Age', description: 'How to plan for retirement regardless of your current age, with strategies for each life stage.', category: 'retirement', icon: Briefcase, color: 'bg-teal-100 text-teal-700', readTime: '14 min read'},
  { id: 9, title: 'Managing Student Loans: Repayment Options', description: 'Understanding different repayment plans, loan forgiveness, and strategies to pay off student debt faster.', category: 'debt', icon: GraduationCap, color: 'bg-pink-100 text-pink-700', readTime: '13 min read'},
  { id: 10, title: 'Building an Emergency Fund: Your Financial Safety Net', description: 'How to create and maintain an emergency fund to protect yourself from financial surprises.', category: 'planning', icon: Shield, color: 'bg-emerald-100 text-emerald-700', readTime: '7 min read'},
  { id: 11, title: 'Understanding Credit Scores and How to Improve Them', description: 'Learn what factors affect your credit score and actionable steps to improve it.', category: 'credit', icon: CreditCard, color: 'bg-rose-100 text-rose-700', readTime: '10 min read'},
  { id: 12, title: 'Investing in Real Estate: Options for Every Budget', description: 'Explore different ways to invest in real estate, from REITs to rental properties.', category: 'investing', icon: Home, color: 'bg-sky-100 text-sky-700', readTime: '16 min read'}
];

// Your categories data (remains the same)
const categories = [
  { id: 'all', name: 'All Guides' },
  { id: 'income', name: 'Income & Salary' },
  { id: 'planning', name: 'Financial Planning' },
  { id: 'debt', name: 'Debt Management' },
  { id: 'investing', name: 'Investing' },
  { id: 'protection', name: 'Insurance' },
  { id: 'housing', name: 'Housing' },
  { id: 'taxes', name: 'Taxes' },
  { id: 'retirement', name: 'Retirement' },
  { id: 'credit', name: 'Credit' }
];

// Debounce hook (if you want to keep it for better search UX, otherwise remove)
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
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce search term

  const filteredGuides = useMemo(() => guides.filter(guide => {
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesSearch = guide.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                          guide.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [selectedCategory, debouncedSearchTerm]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 } // For AnimatePresence
  };

  // Structured data (remains the same, ensure URLs are correct for your site)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Financial Guides and Resources | WageCalculator",
    "description": "In-depth articles and guides on personal finance, budgeting, investing, retirement planning, debt management, and understanding your finances.",
    "url": "https://yourwebsite.com/financial-guides", // Replace with your actual URL
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": guides.map((guide, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "headline": guide.title,
          "description": guide.description,
          "url": `https://yourwebsite.com/financial-guides/${guide.id}`, // Using ID for URL
        }
      }))
    }
  };

  return (
    <>
      <SEOHead 
        title="Financial Guides & Personal Finance Resources | WageCalculator"
        description="Explore our comprehensive library of financial guides. Learn about budgeting, saving, investing, debt management, retirement planning, and more to achieve financial literacy."
        keywords="financial guides, personal finance tips, money management advice, investing 101, retirement planning, budgeting strategies, debt reduction"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-100 py-12"> {/* Slightly lighter bg */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center bg-primary-100 text-primary-600 p-4 rounded-full mb-5 shadow-sm">
              <BookOpen className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Financial Knowledge Hub
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Empower your financial journey with our expert guides and practical advice, curated to help you succeed.
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 sticky top-[70px] md:top-20 z-30 bg-gray-100/80 backdrop-blur-md py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 shadow-sm rounded-b-lg" // Sticky bar with background
          >
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-4 md:p-5">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="relative md:col-span-3"> {/* Search takes more space */}
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    aria-label="Search financial guides"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                    placeholder="Search guides by title or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2"> {/* Category filter */}
                  <select
                    aria-label="Filter guides by category"
                    className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg transition-colors bg-white"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Guides Grid */}
          <AnimatePresence mode="wait">
            {filteredGuides.length > 0 ? (
              <motion.div
                key={selectedCategory + debouncedSearchTerm} // Ensures animation on filter change
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {filteredGuides.map((guide, index) => {
                  const Icon = guide.icon;
                  const categoryName = categories.find(c => c.id === guide.category)?.name || guide.category;
                  return (
                    <motion.div
                      key={guide.id}
                      variants={fadeInUp}
                      custom={index} // For potential staggered animation within a list
                      initial="initial"
                      animate="animate"
                      transition={{ duration: 0.4, delay: index * 0.07 }}
                      className="flex" // Ensure cards stretch to fill height if needed
                    >
                      <Link to={`/financial-guides/${guide.id}`} className="block w-full group">
                        <div className="bg-white rounded-2xl shadow-lg p-6 h-full hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1.5 border border-gray-200 hover:border-primary-300">
                          <div className="flex items-center space-x-4 mb-5">
                            <div className={`p-3.5 rounded-xl ${guide.color} flex-shrink-0 shadow-md`}>
                              <Icon className="w-6 h-6" /> {/* Slightly larger icon in card */}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors mb-0.5">
                                {guide.title}
                              </h3>
                              <div className="text-xs text-gray-500">{guide.readTime}</div>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed flex-grow mb-5">
                            {guide.description}
                          </p>
                          <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${guide.color.replace('bg-', 'bg-opacity-20 ').replace('text-', 'text-')} `}>
                               {categoryName}
                            </span>
                            <span className="text-primary-600 hover:text-primary-700 text-sm font-semibold inline-flex items-center">
                              Read Guide
                              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            </span>
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
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="text-center py-16 col-span-full" // Ensure it spans full width if in a grid
              >
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-6" /> {/* Changed icon */}
                <h3 className="text-xl font-semibold text-gray-800">No Guides Found</h3>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  We couldn't find any guides matching your criteria. Please try different keywords or browse all categories.
                </p>
                 <button 
                    onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                    className="mt-8 px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                 >
                    Clear Search & Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Newsletter Signup (remains mostly the same, visual consistency) */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.6 }} // Adjusted delay
            className="mt-20 mb-8 bg-gradient-to-r from-primary-600 to-blue-700 rounded-2xl shadow-xl overflow-hidden" // Slightly more rounded
          >
            <div className="px-6 py-10 md:p-12 lg:py-16 max-w-3xl mx-auto">
              <div className="text-center">
                <Mail className="w-12 h-12 text-white opacity-80 mx-auto mb-5" /> {/* Larger icon */}
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                  Stay Financially Savvy
                </h2>
                <p className="text-blue-100 mb-8 leading-relaxed text-lg">
                  Subscribe for exclusive financial guides, practical tips, and the latest tool updates delivered to your inbox.
                </p>
                {/* For actual form submission, you'd need a form element and handler */}
                <div className="flex flex-col sm:flex-row sm:justify-center gap-3 max-w-lg mx-auto">
                  <input
                    type="email"
                    name="email"
                    aria-label="Email address for newsletter"
                    placeholder="Enter your email address"
                    required
                    className="flex-grow px-5 py-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-800"
                  />
                  <button 
                    type="submit" // Should be inside a form for semantics
                    className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition-colors transform hover:scale-105"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-blue-200 mt-6">
                  We value your privacy. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FinancialGuides;