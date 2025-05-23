import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Search, DollarSign, PiggyBank, CreditCard, TrendingUp, Shield, Home, Briefcase, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/seo/SEOHead'

const guides = [
  {
    id: 1,
    title: 'Understanding Your Salary and Benefits Package',
    description: 'Learn how to evaluate job offers, understand your pay structure, and maximize employee benefits.',
    category: 'income',
    icon: DollarSign,
    color: 'bg-blue-100 text-blue-700',
    readTime: '8 min read'
  },
  {
    id: 2,
    title: 'Creating a Personal Budget That Works',
    description: 'Step-by-step guide to creating a realistic budget that helps you manage expenses and save money.',
    category: 'planning',
    icon: PiggyBank,
    color: 'bg-green-100 text-green-700',
    readTime: '10 min read'
  },
  {
    id: 3,
    title: 'Managing Debt: Strategies for Paying Off Loans',
    description: 'Effective strategies for tackling different types of debt, from student loans to credit cards.',
    category: 'debt',
    icon: CreditCard,
    color: 'bg-red-100 text-red-700',
    readTime: '12 min read'
  },
  {
    id: 4,
    title: 'Introduction to Investing for Beginners',
    description: 'Learn the basics of investing, different asset classes, and how to start building a portfolio.',
    category: 'investing',
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-700',
    readTime: '15 min read'
  },
  {
    id: 5,
    title: 'Understanding Insurance: What Coverage Do You Need?',
    description: 'Navigate the complex world of insurance and learn what types of coverage are essential.',
    category: 'protection',
    icon: Shield,
    color: 'bg-indigo-100 text-indigo-700',
    readTime: '9 min read'
  },
  {
    id: 6,
    title: 'Buying Your First Home: A Complete Guide',
    description: 'Everything you need to know about the home buying process, from saving for a down payment to closing.',
    category: 'housing',
    icon: Home,
    color: 'bg-yellow-100 text-yellow-700',
    readTime: '18 min read'
  },
  {
    id: 7,
    title: 'Tax Planning Strategies to Minimize Your Bill',
    description: 'Legal strategies to reduce your tax liability and keep more of your hard-earned money.',
    category: 'taxes',
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-700',
    readTime: '11 min read'
  },
  {
    id: 8,
    title: 'Planning for Retirement: Start at Any Age',
    description: 'How to plan for retirement regardless of your current age, with strategies for each life stage.',
    category: 'retirement',
    icon: Briefcase,
    color: 'bg-teal-100 text-teal-700',
    readTime: '14 min read'
  },
  {
    id: 9,
    title: 'Managing Student Loans: Repayment Options',
    description: 'Understanding different repayment plans, loan forgiveness, and strategies to pay off student debt faster.',
    category: 'debt',
    icon: GraduationCap,
    color: 'bg-pink-100 text-pink-700',
    readTime: '13 min read'
  },
  {
    id: 10,
    title: 'Building an Emergency Fund: Your Financial Safety Net',
    description: 'How to create and maintain an emergency fund to protect yourself from financial surprises.',
    category: 'planning',
    icon: Shield,
    color: 'bg-emerald-100 text-emerald-700',
    readTime: '7 min read'
  },
  {
    id: 11,
    title: 'Understanding Credit Scores and How to Improve Them',
    description: 'Learn what factors affect your credit score and actionable steps to improve it.',
    category: 'credit',
    icon: CreditCard,
    color: 'bg-rose-100 text-rose-700',
    readTime: '10 min read'
  },
  {
    id: 12,
    title: 'Investing in Real Estate: Options for Every Budget',
    description: 'Explore different ways to invest in real estate, from REITs to rental properties.',
    category: 'investing',
    icon: Home,
    color: 'bg-blue-100 text-blue-700',
    readTime: '16 min read'
  }
]

const categories = [
  { id: 'all', name: 'All Guides' },
  { id: 'income', name: 'Income & Salary' },
  { id: 'planning', name: 'Financial Planning' },
  { id: 'debt', name: 'Debt Management' },
  { id: 'investing', name: 'Investing' },
  { id: 'protection', name: 'Insurance & Protection' },
  { id: 'housing', name: 'Housing & Mortgages' },
  { id: 'taxes', name: 'Taxes' },
  { id: 'retirement', name: 'Retirement' },
  { id: 'credit', name: 'Credit' }
]

const FinancialGuides = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredGuides = guides.filter(guide => {
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          guide.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Financial Guides and Resources",
    "description": "Educational resources about personal finance, investing, retirement planning, and more",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": guides.map((guide, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "name": guide.title,
          "description": guide.description
        }
      }))
    }
  }

  return (
    <>
      <SEOHead 
        title={`Financial Guides and Resources`}
        description={`Learn about personal finance with our comprehensive guides covering budgeting, investing, retirement planning, debt management, and more.`}
        keywords="financial guides, money management, personal finance, investing guides, retirement planning, budgeting tips"
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
              <BookOpen className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Financial Guides
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive resources to help you make informed financial decisions
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Search guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide, index) => {
              const Icon = guide.icon
              return (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + (index * 0.05) }}
                >
                  <Link to={`/financial-guides/${guide.id}`} className="block h-full">
                    <div className="bg-white rounded-xl shadow-md p-6 h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className={`p-3 rounded-lg ${guide.color} flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {guide.title}
                          </h3>
                          <div className="text-xs text-gray-500">{guide.readTime}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm flex-grow">
                        {guide.description}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                          {categories.find(c => c.id === guide.category)?.name}
                        </span>
                        <span className="text-primary-600 text-sm font-medium">Read more →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {filteredGuides.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No guides found</h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 bg-gradient-to-r from-primary-600 to-blue-700 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="px-6 py-8 md:p-10 md:py-12 max-w-3xl mx-auto">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Get Financial Tips in Your Inbox</h2>
                <p className="text-blue-100 mb-6">
                  Subscribe to our newsletter for the latest guides, tips, and tools to improve your financial life.
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  />
                  <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-blue-100 mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default FinancialGuides