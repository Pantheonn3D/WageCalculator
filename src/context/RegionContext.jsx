// src/context/RegionContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { countries } from '../data/countries'; // Adjust path if needed
import { currencies } from '../data/currencies'; // Adjust path if needed

const RegionContext = createContext();

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};

export const RegionProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState('US'); // Default country
  const [selectedCurrency, setSelectedCurrency] = useState(
    countries[selectedCountry]?.currency || 'USD'
  );
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoadingLocation, setIsLoadingLocation] = useState(true); // For location detection

  useEffect(() => {
    const detectLocation = async () => {
      setIsLoadingLocation(true);
      try {
        // Note: ipapi.co might be rate-limited or have CORS issues for client-side calls.
        // Consider a server-side proxy or a more robust solution for production.
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error(`Failed to fetch location: ${response.status}`);
        const data = await response.json();
        if (data.country_code && countries[data.country_code]) {
          setSelectedCountry(data.country_code);
        } else {
          console.warn(`Detected country_code '${data.country_code}' not found in our list, using default.`);
        }
      } catch (error) {
        console.warn('Could not detect location, using default:', error);
        // Fallback to default 'US' is already set in useState
      } finally {
        setIsLoadingLocation(false);
      }
    };
    detectLocation();
  }, []); // Run once on mount

  useEffect(() => {
    const countryData = countries[selectedCountry];
    if (countryData && countryData.currency && currencies[countryData.currency]) {
      setSelectedCurrency(countryData.currency);
    } else {
      console.warn(
        `Currency for country ${selectedCountry} ('${countryData?.currency}') not found or not fully defined. Falling back to USD.`
      );
      setSelectedCurrency('USD'); // Fallback currency
    }
  }, [selectedCountry]); // Update currency when country changes

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        // Using a free, simple API for demonstration. For production, use a reliable, keyed API.
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        if (!response.ok) throw new Error('Failed to fetch exchange rates');
        const data = await response.json();
        if (data && data.rates) {
          setExchangeRates(data.rates);
        } else {
          throw new Error('Exchange rate data is invalid');
        }
      } catch (error) { // Fixed the missing curly braces here
        console.error('Could not fetch exchange rates:', error); // Changed to console.error
        // Potentially set a flag or default rates if fetching fails
      }
    };
    fetchExchangeRates();
  }, []); // Run once on mount

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      console.warn('Exchange rate missing for conversion:', fromCurrency, 'to', toCurrency);
      return amount; // Or handle more gracefully
    }
    const amountInUSD = fromCurrency === 'USD' ? amount : amount / exchangeRates[fromCurrency];
    return toCurrency === 'USD' ? amountInUSD : amountInUSD * exchangeRates[toCurrency];
  };

  const formatCurrency = (amount, currencyCodeOverride, options = {}) => {
    const currencyToUse = currencyCodeOverride || selectedCurrency || 'USD'; // Ensure fallback
  
    if (typeof amount !== 'number' || isNaN(amount)) {
      return options.defaultValue !== undefined ? options.defaultValue : ''; 
    }
  
    const currencyInfo = currencies[currencyToUse];
  
    let defaultMinDecimals = currencyInfo?.decimals !== undefined ? currencyInfo.decimals : 2;
    let defaultMaxDecimals = currencyInfo?.decimals !== undefined ? currencyInfo.decimals : 2;
  
    let minDecimals = defaultMinDecimals;
    let maxDecimals = defaultMaxDecimals;
  
    if (options.smartDecimals) {
      if (options.notation === 'compact') {
        minDecimals = 0; 
        maxDecimals = 2;
      } else if (Number.isInteger(amount) && Math.abs(amount) >= 1000) { // Show no decimals for large integers
        minDecimals = 0;
        maxDecimals = 0;
      } else if (Math.abs(amount) >= 1000) { // For large non-integers, use default decimals unless overridden
        minDecimals = defaultMinDecimals; 
        maxDecimals = defaultMaxDecimals;
      } else { // For smaller numbers, use default decimals
        minDecimals = defaultMinDecimals;
        maxDecimals = defaultMaxDecimals;
      }
    }
  
    if (options.forceDecimals !== undefined) {
      minDecimals = options.forceDecimals;
      maxDecimals = options.forceDecimals;
    }
    
    if (minDecimals > maxDecimals && options.notation !== 'compact') {
        minDecimals = maxDecimals;
    }
  
    const numberFormatOptions = {
      style: 'currency',
      currency: currencyToUse,
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals,
      currencyDisplay: currencyInfo?.currencyDisplay || 'symbol', // Use symbol by default
    };
  
    if (options.notation === 'compact') {
      numberFormatOptions.notation = 'compact';
      delete numberFormatOptions.minimumFractionDigits;
      delete numberFormatOptions.maximumFractionDigits;
      numberFormatOptions.minimumSignificantDigits = options.minimumSignificantDigits || 1;
      // Adjust max significant digits for better compact display
      numberFormatOptions.maximumSignificantDigits = options.maximumSignificantDigits || (Math.abs(amount) >= 1000 ? 2 : 3);
    }

    const locale = currencyInfo?.locale || navigator.language || 'en-US'; // Fallback locale
  
    try {
      return new Intl.NumberFormat(locale, numberFormatOptions).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error, { amount, currencyToUse, locale, options: numberFormatOptions });
      // Fallback for unsupported currency code or locale issues
      const symbol = currencyInfo?.symbol || currencyToUse;
      const formattedAmount = amount.toFixed(defaultMinDecimals);
      return currencyInfo?.symbolPosition === 'after' ? `${formattedAmount}${symbol}` : `${symbol}${formattedAmount}`;
    }
  };

  const value = {
    selectedCountry,
    setSelectedCountry,
    selectedCurrency,
    exchangeRates,
    convertCurrency,
    formatCurrency,
    countries,
    currencies,
    isLoadingLocation,
  };

  return (
    <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
  );
};