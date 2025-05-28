import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Menu as MenuIcon,
  X,
  Globe,
  TrendingUp,    // Used for Hourly and potentially Retirement
  DollarSign,
  PiggyBank,
  CreditCard,
  BarChart3,
  ArrowRightLeft,
  Scale,
  BookOpen,
  ChevronDown,
  Briefcase,     // Added as an option for Retirement
} from 'lucide-react';
import { useRegion } from '../../context/RegionContext';
// import CountryFlag from 'react-country-flag';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

  const location = useLocation();
  const { selectedCountry, setSelectedCountry, countries } = useRegion();

  const moreDropdownRef = useRef(null);
  const regionDropdownRef = useRef(null);

  // --- MODIFIED navigation ARRAY ---
  const navigation = [
    { name: 'Home', href: '/', icon: Calculator, id: 'nav-home' },
    { name: 'Salary Calculator', href: '/salary-calculator', icon: DollarSign, id: 'nav-salary' },
    { name: 'Hourly Calculator', href: '/hourly-calculator', icon: TrendingUp, id: 'nav-hourly' },
    { name: 'Tax Calculator', href: '/tax-calculator', icon: BarChart3, id: 'nav-tax' },
    { name: 'Savings Calculator', href: '/savings-calculator', icon: PiggyBank, id: 'nav-savings' },
    { name: 'Loan Calculator', href: '/loan-calculator', icon: CreditCard, id: 'nav-loan' },
    // --- ADDED RETIREMENT CALCULATOR HERE ---
    // It will now be the 6th item after "Loan Calculator", 
    // so it will appear in the "More" dropdown because you slice at 5 for direct display.
    { name: 'Retirement Calculator', href: '/retirement-calculator', icon: Briefcase, id: 'nav-retirement' }, // Using Briefcase here
    // --- END ADDITION ---
    { name: 'Currency Converter', href: '/currency-converter', icon: ArrowRightLeft, id: 'nav-currency' },
    { name: 'Comparison Tool', href: '/job-comparison-tool', icon: Scale, id: 'nav-comparison' },
    { name: 'Financial Guides', href: '/financial-guides', icon: BookOpen, id: 'nav-guides' },
  ];
  // --- END MODIFIED navigation ARRAY ---


  const isActive = (href) => location.pathname === href;

  const handleHomepageLinkClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      if (isMoreDropdownOpen) {
        setIsMoreDropdownOpen(false);
      }
      if (isRegionDropdownOpen) {
        setIsRegionDropdownOpen(false);
      }
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setIsMoreDropdownOpen(false);
      }
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
        setIsRegionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const NavItem = ({ item, active, isMobile = false, inMoreDropdown = false }) => { // Added inMoreDropdown
    const Icon = item.icon;
    const handleClick = () => {
      if (item.href === '/') {
        handleHomepageLinkClick({ preventDefault: () => {} });
      }
      if (isMobile) {
        setIsMobileMenuOpen(false);
      }
      // Only close "More" if the item was actually clicked from within the "More" dropdown
      if (inMoreDropdown) { 
        setIsMoreDropdownOpen(false);
      }
    };

    const baseClasses = "flex items-center space-x-2 rounded-lg transition-all duration-200";
    const sizeClasses = isMobile ? "text-base px-3 py-2" : (inMoreDropdown ? "px-4 py-2.5 text-sm" : "px-3 py-2 text-sm");
    const activeClasses = active 
      ? (inMoreDropdown ? "bg-primary-50 text-primary-700" : "bg-primary-100 text-primary-700 font-semibold")
      : (inMoreDropdown ? "text-gray-700 hover:bg-gray-100 hover:text-primary-600" : "text-gray-600 hover:text-primary-600 hover:bg-gray-100 font-medium");
    const iconSizeClass = isMobile ? "w-5 h-5" : "w-4 h-4";
    const iconColorClass = inMoreDropdown && !active ? "text-gray-500" : "";


    return (
      <Link
        to={item.href}
        onClick={handleClick}
        className={`${baseClasses} ${sizeClasses} ${activeClasses}`}
      >
        <Icon className={`${iconSizeClass} ${iconColorClass}`} />
        <span>{item.name}</span>
      </Link>
    );
  };

  const VISIBLE_DESKTOP_NAV_ITEMS = 5; // Define how many items are visible before "More"

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              onClick={handleHomepageLinkClick}
            >
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center shadow group-hover:bg-primary-700 transition-colors">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                WageCalculator
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.slice(0, VISIBLE_DESKTOP_NAV_ITEMS).map((item) => (
              <NavItem key={item.id} item={item} active={isActive(item.href)} />
            ))}

            {navigation.length > VISIBLE_DESKTOP_NAV_ITEMS && (
              <div className="relative" ref={moreDropdownRef}>
                <button
                  id="more-options-button"
                  aria-haspopup="true"
                  aria-expanded={isMoreDropdownOpen}
                  aria-controls="more-options-menu"
                  onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-all duration-200 flex items-center"
                >
                  More
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isMoreDropdownOpen && (
                    <motion.div
                      id="more-options-menu"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10" // Increased width slightly for longer names
                    >
                      {/* MODIFIED: Use NavItem for consistency */}
                      {navigation.slice(VISIBLE_DESKTOP_NAV_ITEMS).map((item) => (
                         <NavItem key={item.id} item={item} active={isActive(item.href)} inMoreDropdown={true} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right side: Region Selector & Mobile Menu Button */}
          <div className="flex items-center">
            <div className="relative mr-2" ref={regionDropdownRef}>
              <button
                id="region-selector-button"
                aria-haspopup="true"
                aria-expanded={isRegionDropdownOpen}
                aria-controls="region-selector-menu"
                onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {countries[selectedCountry]?.name || 'Region'}
                </span>
                <span className="sm:hidden">
                  {selectedCountry || 'Region'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isRegionDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isRegionDropdownOpen && (
                  <motion.div
                    id="region-selector-menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-1 max-h-72 overflow-y-auto z-10"
                  >
                    {Object.entries(countries).map(([code, country]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setSelectedCountry(code);
                          setIsRegionDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center space-x-2 transition-colors
                          ${selectedCountry === code
                            ? 'bg-primary-50 text-primary-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                          }`}
                      >
                        <span>{country.name}</span>
                        <span className="text-xs text-gray-500">({country.currency})</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="lg:hidden">
              <button
                id="mobile-menu-button"
                aria-label="Open main menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-gray-200 shadow-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                 <NavItem key={item.id} item={item} active={isActive(item.href)} isMobile={true} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;