import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Mail,
  MapPin,
  Globe,
  DollarSign,
  TrendingUp,
  BarChart3,
  PiggyBank,
  CreditCard,
  ArrowRightLeft,
  Scale,
  BookOpen,
} from 'lucide-react'; // Ensuring all relevant icons are imported

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Consolidating links into a more manageable structure
  const sections = [
    {
      title: 'Calculators',
      links: [
        { name: 'Salary Calculator', href: '/salary-calculator', icon: DollarSign },
        { name: 'Hourly Calculator', href: '/hourly-calculator', icon: TrendingUp },
        { name: 'Tax Calculator', href: '/tax-calculator', icon: BarChart3 },
        { name: 'Savings Calculator', href: '/savings-calculator', icon: PiggyBank },
        { name: 'Loan Calculator', href: '/loan-calculator', icon: CreditCard },
        // { name: 'Retirement Calculator', href: '/retirement-calculator' }, // Add if available
      ],
    },
    {
      title: 'Tools & Resources',
      links: [
        { name: 'Currency Converter', href: '/currency-converter', icon: ArrowRightLeft },
        { name: 'Comparison Tool', href: '/comparison-tool', icon: Scale },
        { name: 'Financial Guides', href: '/financial-guides', icon: BookOpen },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Disclaimer', href: '/disclaimer' },
      ],
    },
  ];

  // Reusable Link Component for consistent styling
  const FooterLink = ({ href, children, icon: Icon }) => (
    <Link
      to={href}
      className="group flex items-center space-x-2 text-gray-400 hover:text-primary-300 transition-colors duration-200 text-sm"
    >
      {Icon && <Icon className="w-4 h-4 text-gray-500 group-hover:text-primary-400 transition-colors" />}
      <span className="group-hover:underline">{children}</span>
    </Link>
  );


  return (
    <footer className="bg-gray-900 text-gray-300 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 xl:gap-12 items-start">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4 pr-4 mb-8 lg:mb-0">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-md group-hover:bg-primary-700 transition-colors">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-primary-300 transition-colors">
                WageCalculator
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Your comprehensive financial calculator suite. Calculate salaries,
              taxes, savings, and more with accurate, up-to-date formulas for
              countries worldwide.
            </p>
            <div className="flex items-center space-x-2 text-sm text-primary-400 pt-1">
              <Globe className="w-4 h-4" />
              <span>Global calculations, localized for you.</span>
            </div>
          </div>

          {/* Link Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-md font-semibold text-white mb-5 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <FooterLink href={link.href} icon={link.icon}>
                      {link.name}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div>
             <h3 className="text-md font-semibold text-white mb-5 uppercase tracking-wider">
                Support
              </h3>
            <div className="space-y-4">
              <a
                href="mailto:pantheon3d.contact@gmail.com"
                className="flex items-start space-x-3 group"
              >
                <Mail className="w-5 h-5 text-primary-400 group-hover:text-primary-300 transition-colors mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400 group-hover:text-primary-300 transition-colors group-hover:underline">
                  pantheon3d.contact@gmail.com
                </span>
              </a>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" />
                <span className="text-sm">Global Service – Online Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} WageCalculator. All rights reserved.
            </p>
            <div className="text-xs text-gray-500 text-center md:text-right max-w-md leading-relaxed">
              <p>Financial calculations are estimates and for informational purposes only. Consult a qualified professional for personalized financial advice.</p>
              <p className="mt-1">Currency rates are updated periodically. Tax information is based on current legislation but may vary.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;