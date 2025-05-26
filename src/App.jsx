// app.jsx

import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // Removed BrowserRouter as Router, assuming it's in index.js or main.jsx
import { motion, AnimatePresence } from 'framer-motion';
import ReactGA from 'react-ga4';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import RouteChangeTracker from './components/RouteChangeTracker';
import ScrollToTop from './utils/ScrollToTop';
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
import AllCalculators from './pages/AllCalculators';
import { RegionProvider } from './context/RegionContext';

// Import Legal Pages
import CookiePolicyPage from './pages/legal/CookiePolicyPage';
import DisclaimerPage from './pages/legal/DisclaimerPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsOfServicePage from './pages/legal/TermsOfServicePage';

// --- GA CONFIGURATION ---
let gaMeasurementId;
const hardcodedGaId = "G-3B9E8XGDPP";
const placeholderGaId = "G-XXXXXXXXXX";

if (typeof import.meta !== 'undefined' && import.meta.env) {
  gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
}

if (!gaMeasurementId) {
  gaMeasurementId = hardcodedGaId;
}

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
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
        <Route path="/all-calculators" element={<AllCalculators />} />
        <Route path="/currency-converter" element={<CurrencyConverter />} />
        <Route path="/comparison-tool" element={<ComparisonTool />} />
        <Route path="/financial-guides" element={<FinancialGuides />} />
        {/* 
          ***********************************
          *** THIS IS THE IMPORTANT CHANGE ***
          ***********************************
        */}
        <Route path="/financial-guides/:guideSlug" element={<GuideDetailPage />} />
        {/* 
          ***********************************
          ***********************************
        */}
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [gaInitialized, setGaInitialized] = useState(false);

  useEffect(() => {
    if (gaMeasurementId && gaMeasurementId !== placeholderGaId && !gaMeasurementId.startsWith("G-XXX")) {
      try {
        ReactGA.initialize(gaMeasurementId, {
          // testMode: (typeof import.meta !== 'undefined' && import.meta.env.DEV)
        });
        console.log(`GA Initialized with Measurement ID: ${gaMeasurementId}`);
        setGaInitialized(true);
      } catch (error) {
        console.error("GA Initialization failed:", error);
        setGaInitialized(false);
      }
    } else {
      if (!gaMeasurementId || gaMeasurementId === placeholderGaId || (gaMeasurementId && gaMeasurementId.startsWith("G-XXX"))) {
        console.warn(`GA Measurement ID is either not defined, a placeholder, or invalid ('${gaMeasurementId}'). Analytics will not be initialized.`);
      }
      setGaInitialized(false);
    }
  }, []);

  return (
    // BrowserRouter (or Router) should wrap this App component,
    // typically in your main.jsx or index.js file.
    // If it's not there, you would need to add <Router> here.
    // Example: import { BrowserRouter as Router } from 'react-router-dom';
    // and then wrap <RegionProvider> with <Router>.
    // But usually, it's done at the root of the application.
    <RegionProvider>
      {gaInitialized && <RouteChangeTracker />}
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AppRoutes /> {/* This component contains your Routes */}
        </main>
        <Footer />
      </div>
    </RegionProvider>
  );
}

export default App;