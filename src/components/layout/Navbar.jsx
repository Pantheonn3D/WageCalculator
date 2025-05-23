import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Menu,
  X,
  Globe,
  TrendingUp,
  DollarSign,
  PiggyBank,
  CreditCard,
  BarChart3,
  ArrowRightLeft,
  Scale,
  BookOpen,
} from 'lucide-react';
import { useRegion } from '../../context/RegionContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const location = useLocation();
  const { selectedCountry, setSelectedCountry, countries } = useRegion();

  const navigation = [
    { name: 'Home', href: '/', icon: Calculator },
    { name: 'Salary Calculator', href: '/salary-calculator', icon: DollarSign },
    { name: 'Hourly Calculator', href: '/hourly-calculator', icon: TrendingUp },
    { name: 'Tax Calculator', href: '/tax-calculator', icon: BarChart3 },
    {
      name: 'Savings Calculator',
      href: '/savings-calculator',
      icon: PiggyBank,
    },
    { name: 'Loan Calculator', href: '/loan-calculator', icon: CreditCard },
    {
      name: 'Currency Converter',
      href: '/currency-converter',
      icon: ArrowRightLeft,
    },
    { name: 'Comparison Tool', href: '/comparison-tool', icon: Scale },
    { name: 'Financial Guides', href: '/financial-guides', icon: BookOpen },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                WageCalculator
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.slice(0, 6).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-all duration-200"
              >
                More
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                  >
                    {navigation.slice(6).map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Region Selector */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsRegionOpen(!isRegionOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
                <span>
                  {countries[selectedCountry]?.name || 'Select Region'}
                </span>
              </button>
              <AnimatePresence>
                {isRegionOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-64 overflow-y-auto"
                  >
                    {Object.entries(countries).map(([code, country]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setSelectedCountry(code);
                          setIsRegionOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          selectedCountry === code
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700'
                        }`}
                      >
                        {country.name} ({country.currency})
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-100"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
