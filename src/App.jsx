// app.jsx

import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactGA from 'react-ga4';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import RouteChangeTracker from './components/RouteChangeTracker';
import ScrollToTop from './utils/ScrollToTop'; // Import the new component
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
const hardcodedGaId = "G-3B9E8XGDPP"; // Your hardcoded ID as a fallback or for non-Vite envs
const placeholderGaId = "G-XXXXXXXXXX"; // A generic placeholder to check against

// Check if running in a Vite environment and access Vite-specific env var
if (typeof import.meta !== 'undefined' && import.meta.env) {
  gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  // console.log("Vite env detected, VITE_GA_MEASUREMENT_ID:", gaMeasurementId);
}

// Fallback to hardcoded ID if Vite env var is not set or not in Vite env
if (!gaMeasurementId) {
  gaMeasurementId = hardcodedGaId;
  // console.log("Falling back to hardcoded GA ID:", gaMeasurementId);
}


// AppRoutes component remains the same
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
        <Route path="/financial-guides/:guideId" element={<GuideDetailPage />} />
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
    // Ensure gaMeasurementId is a valid ID and not a placeholder or undefined
    if (gaMeasurementId && gaMeasurementId !== placeholderGaId && !gaMeasurementId.startsWith("G-XXX")) {
      try {
        ReactGA.initialize(gaMeasurementId, {
          // Example: Enable test mode in development
          // testMode: (typeof import.meta !== 'undefined' && import.meta.env.DEV) // Vite way to check for dev mode
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
  }, []); // Empty dependency array means this runs once when App mounts

  return (
    <RegionProvider>
      {gaInitialized && <RouteChangeTracker />}
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </RegionProvider>
  );
}

export default App;