import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SalaryCalculator from './pages/SalaryCalculator';
import HourlyCalculator from './pages/HourlyCalculator';
import TaxCalculator from './pages/TaxCalculator';
import SavingsCalculator from './pages/SavingsCalculator';
import LoanCalculator from './pages/LoanCalculator';
import RetirementCalculator from './pages/RetirementCalculator';
import CurrencyConverter from './pages/CurrencyConverter';
import ComparisonTool from './pages/ComparisonTool';
import FinancialGuides from './pages/FinancialGuides';
import GuideDetailPage from './pages/GuideDetailPage';
import { RegionProvider } from './context/RegionContext';

// Import Legal Pages
import CookiePolicyPage from './pages/legal/CookiePolicyPage';
import DisclaimerPage from './pages/legal/DisclaimerPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsOfServicePage from './pages/legal/TermsOfServicePage';

function App() {
  return (
    <RegionProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/salary-calculator" element={<SalaryCalculator />} />
            <Route path="/hourly-calculator" element={<HourlyCalculator />} />
            <Route path="/tax-calculator" element={<TaxCalculator />} />
            <Route path="/savings-calculator" element={<SavingsCalculator />} />
            <Route path="/loan-calculator" element={<LoanCalculator />} />
            <Route
              path="/retirement-calculator"
              element={<RetirementCalculator />}
            />
            <Route path="/currency-converter" element={<CurrencyConverter />} />
            <Route path="/comparison-tool" element={<ComparisonTool />} />
            <Route path="/financial-guides" element={<FinancialGuides />} />
            <Route path="/financial-guides/:guideId" element={<GuideDetailPage />} />

            {/* Legal Page Routes */}
            <Route path="/cookies" element={<CookiePolicyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </RegionProvider>
  );
}

export default App;