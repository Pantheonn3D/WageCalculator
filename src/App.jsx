// src/App.jsx

import React, { useEffect, useState, Suspense } from 'react';
// REMOVED: BrowserRouter as Router from react-router-dom, as it's expected in main.jsx
import { Routes, Route, useLocation } from 'react-router-dom'; 
import { AnimatePresence } from 'framer-motion';
import ReactGA from 'react-ga4';

// Context
import { RegionProvider } from './context/RegionContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Core App Components & Utilities
import RouteChangeTracker from './components/RouteChangeTracker';
import ScrollToTop from './utils/ScrollToTop';

// --- Page Components (Lazy Loaded) ---
const HomePage = React.lazy(() => import('./pages/HomePage'));
const SalaryCalculator = React.lazy(() => import('./pages/SalaryCalculator'));
const HourlyCalculator = React.lazy(() => import('./pages/HourlyCalculator'));
const TaxCalculator = React.lazy(() => import('./pages/TaxCalculator'));
const SavingsCalculator = React.lazy(() => import('./pages/SavingsCalculator'));
const LoanCalculator = React.lazy(() => import('./pages/LoanCalculator'));
const RetirementCalculator = React.lazy(() => import('./pages/RetirementCalculator'));
const CurrencyConverter = React.lazy(() => import('./pages/CurrencyConverter'));
const ComparisonTool = React.lazy(() => import('./pages/ComparisonTool'));
const AllCalculators = React.lazy(() => import('./pages/AllCalculators'));
const FinancialGuides = React.lazy(() => import('./pages/FinancialGuides'));
const GuideDetailPage = React.lazy(() => import('./pages/GuideDetailPage'));

// --- Legal Page Components (Lazy Loaded) ---
const CookiePolicyPage = React.lazy(() => import('./pages/legal/CookiePolicyPage'));
const DisclaimerPage = React.lazy(() => import('./pages/legal/DisclaimerPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/legal/PrivacyPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('./pages/legal/TermsOfServicePage'));

// --- Example NotFoundPage (Lazy Loaded) ---
// const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));


// --- GA CONFIGURATION CONSTANTS ---
const HARDCODED_GA_ID = "G-3B9E8XGDPP";
const PLACEHOLDER_GA_ID = "G-XXXXXXXXXX";
const INVALID_GA_ID_PREFIX = "G-XXX";

// --- GA HELPER FUNCTIONS ---
function getEffectiveGaId() {
  let id = (typeof import.meta !== 'undefined' && import.meta.env)
    ? import.meta.env.VITE_GA_MEASUREMENT_ID
    : undefined;

  if (!id) {
    console.warn(
      `VITE_GA_MEASUREMENT_ID is not defined in environment variables. Falling back to hardcoded GA ID: ${HARDCODED_GA_ID}. For production, ensure VITE_GA_MEASUREMENT_ID is properly set.`
    );
    id = HARDCODED_GA_ID;
  }
  return id;
}

function isValidGaId(id) {
  if (!id || id === PLACEHOLDER_GA_ID || id.startsWith(INVALID_GA_ID_PREFIX)) {
    return false;
  }
  return true;
}

const effectiveGaMeasurementId = getEffectiveGaId();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/salary-calculator" element={<SalaryCalculator />} />
          <Route path="/hourly-calculator" element={<HourlyCalculator />} />
          <Route path="/tax-calculator" element={<TaxCalculator />} />
          <Route path="/savings-calculator" element={<SavingsCalculator />} />
          <Route path="/loan-calculator" element={<LoanCalculator />} />
          <Route path="/retirement-calculator" element={<RetirementCalculator />} />
          <Route path="/all-calculators" element={<AllCalculators />} />
          <Route path="/currency-converter" element={<CurrencyConverter />} />
          <Route path="/job-comparison-tool" element={<ComparisonTool />} />
          <Route path="/financial-guides" element={<FinancialGuides />} />
          <Route path="/financial-guides/:guideSlug" element={<GuideDetailPage />} />
          
          <Route path="/cookies" element={<CookiePolicyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </AnimatePresence>
    </>
  );
}

const PageLoader = () => (
  <div className="flex-grow flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-primary-500 dark:border-primary-400"></div>
  </div>
);

function App() {
  const [gaInitialized, setGaInitialized] = useState(false);

  useEffect(() => {
    if (isValidGaId(effectiveGaMeasurementId)) {
      try {
        ReactGA.initialize(effectiveGaMeasurementId, {
          testMode: (typeof import.meta !== 'undefined' && import.meta.env.DEV),
        });
        console.log(`GA Initialized with Measurement ID: ${effectiveGaMeasurementId}`);
        setGaInitialized(true);
      } catch (error) {
        console.error("GA Initialization failed:", error);
        setGaInitialized(false);
      }
    } else {
      console.warn(
        `GA Measurement ID ('${effectiveGaMeasurementId}') is invalid, a placeholder, or does not meet criteria. Analytics will not be initialized.`
      );
      setGaInitialized(false);
    }
  }, []);

  return (
    // <Router>  <--- REMOVED THIS WRAPPER
      <RegionProvider>
        {gaInitialized && <RouteChangeTracker />}
        <div className="min-h-screen flex flex-col bg-subtle-gradient-light dark:bg-subtle-gradient-dark text-neutral-800 dark:text-neutral-200 selection:bg-primary-500 selection:text-white">
          <Navbar />
          <main className="flex-grow w-full">
            <Suspense fallback={<PageLoader />}>
              <AnimatedRoutes />
            </Suspense>
          </main>
          <Footer />
        </div>
      </RegionProvider>
    // </Router> <--- REMOVED THIS WRAPPER
  );
}

export default App;