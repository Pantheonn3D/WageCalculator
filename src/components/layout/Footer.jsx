import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Mail, MapPin, Phone, Globe } from 'lucide-react';

const Footer = () => {
  const calculatorLinks = [
    { name: 'Salary Calculator', href: '/salary-calculator' },
    { name: 'Hourly Calculator', href: '/hourly-calculator' },
    { name: 'Tax Calculator', href: '/tax-calculator' },
    { name: 'Savings Calculator', href: '/savings-calculator' },
    { name: 'Loan Calculator', href: '/loan-calculator' },
    { name: 'Retirement Calculator', href: '/retirement-calculator' },
  ];

  const toolLinks = [
    { name: 'Currency Converter', href: '/currency-converter' },
    { name: 'Comparison Tool', href: '/comparison-tool' },
    { name: 'Financial Guides', href: '/financial-guides' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">WageCalculator</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your comprehensive financial calculator suite. Calculate salaries,
              taxes, savings, and more with accurate, up-to-date formulas for
              countries worldwide.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Globe className="w-4 h-4" />
              <span>Available in 40+ countries</span>
            </div>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Calculators</h3>
            <ul className="space-y-2">
              {calculatorLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tools & Resources</h3>
            <ul className="space-y-2">
              {toolLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Popular Countries</h4>
              <div className="text-xs text-gray-400 space-y-1">
                <div>United States</div>
                <div>United Kingdom</div>
                <div>Canada</div>
                <div>Australia</div>
                <div>Germany</div>
              </div>
            </div>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@wagecalculator.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Global Service</span>
              </div>
            </div>

            <h4 className="text-sm font-semibold mb-2">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-xs"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 WageCalculator. All rights reserved.
            </div>
            <div className="text-xs text-gray-500 text-center md:text-right">
              Financial calculations are estimates. Consult a professional for
              personalized advice.
              <br />
              Currency rates updated daily. Tax rates based on current
              legislation.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
