import React, { createContext, useContext, useState, useEffect } from 'react';
import { countries } from '../data/countries';
import { currencies } from '../data/currencies';

const RegionContext = createContext();

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};

export const RegionProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedCurrency, setSelectedCurrency] = useState(
    countries[selectedCountry]?.currency || 'USD'
  );
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // For local development, you might need a CORS proxy if ipapi.co blocks localhost
        // Example: const proxyUrl = 'YOUR_CORS_PROXY_URL_HERE/';
        // const response = await fetch(`${proxyUrl}https://ipapi.co/json/`);
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Failed to fetch location');
        const data = await response.json();
        if (data.country_code && countries[data.country_code]) {
          setSelectedCountry(data.country_code);
        }
      } catch (error) {
        console.log('Could not detect location, using default:', error);
      }
    };
    detectLocation();
  }, []);

  useEffect(() => {
    const countryData = countries[selectedCountry];
    if (countryData && countryData.currency && currencies[countryData.currency]) {
      setSelectedCurrency(countryData.currency);
    } else {
      console.warn(
        `Currency for country ${selectedCountry} not found or not fully defined. Falling back or using previous.`
      );
      if (!currencies[selectedCurrency]) {
         setSelectedCurrency('USD');
      }
    }
  }, [selectedCountry]);

useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/USD` // Consider using a more robust API or your own backend for rates
        );
        if (!response.ok) throw new Error('Failed to fetch exchange rates');
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) { // <<<--- ADDED { HERE
        console.log('Could not fetch exchange rates:', error);
      } // <<<--- ADDED } HERE
    };
    fetchExchangeRates();
  }, []);

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      console.warn('Exchange rate missing for conversion', fromCurrency, toCurrency);
      return amount; // Or handle more gracefully, maybe return null or throw error
    }

    const amountInUSD =
      fromCurrency === 'USD' ? amount : amount / exchangeRates[fromCurrency];
    
    if (toCurrency === 'USD') {
      return amountInUSD;
    }
    return amountInUSD * exchangeRates[toCurrency];
  };

  const formatCurrency = (amount, currencyCodeOverride, options = {}) => {
    const currencyToUse = currencyCodeOverride || selectedCurrency;

    if (typeof amount !== 'number' || isNaN(amount)) {
      return options.defaultValue || ''; // Return empty string or a default placeholder
    }

    const currencyInfo = currencies[currencyToUse];

    let defaultMinDecimals = 2;
    let defaultMaxDecimals = 2;

    if (currencyInfo && currencyInfo.decimals !== undefined) {
      defaultMinDecimals = currencyInfo.decimals;
      defaultMaxDecimals = currencyInfo.decimals;
    } else if (!currencyInfo) {
      // Fallback if currency info is completely missing
      console.warn(`Currency info not found for ${currencyToUse}. Using default formatting.`);
      // No specific currency info, so a basic number format might be better or just toFixed
    }

    let minDecimals = defaultMinDecimals;
    let maxDecimals = defaultMaxDecimals;

    // Option: Smart decimals based on magnitude
    if (options.smartDecimals) {
      if (options.notation === 'compact') { // Compact notation often handles decimals well itself or via significantDigits
        // For compact, let significantDigits control precision primarily
        minDecimals = 0; // Usually compact handles this
        maxDecimals = 2; // Max for compact if not using significantDigits
      } else if (Math.abs(amount) >= 1000000) {
        minDecimals = 0;
        maxDecimals = 0;
      } else if (Math.abs(amount) >= 1000) {
        minDecimals = Number.isInteger(amount) ? 0 : defaultMinDecimals;
        maxDecimals = defaultMaxDecimals;
      } else {
        minDecimals = defaultMinDecimals;
        maxDecimals = defaultMaxDecimals;
      }
    }

    // Option: Force specific number of decimals (overrides smartDecimals for min/max)
    if (options.forceDecimals !== undefined) {
      minDecimals = options.forceDecimals;
      maxDecimals = options.forceDecimals;
    }
    
    // Ensure minDecimals is not greater than maxDecimals after adjustments
    if (minDecimals > maxDecimals && options.notation !== 'compact') { // Compact notation uses significantDigits
        minDecimals = maxDecimals;
    }


    const numberFormatOptions = {
      style: 'currency',
      currency: currencyToUse,
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals,
    };

    if (options.notation === 'compact') {
      numberFormatOptions.notation = 'compact';
      // For compact notation, it's often better to control precision with significantDigits
      // Remove min/maxFractionDigits if using significantDigits for compact
      delete numberFormatOptions.minimumFractionDigits;
      delete numberFormatOptions.maximumFractionDigits;
      numberFormatOptions.minimumSignificantDigits = options.minimumSignificantDigits || 1;
      numberFormatOptions.maximumSignificantDigits = options.maximumSignificantDigits || (Math.abs(amount) < 1000 && Math.abs(amount) !== 0 ? 3 : 2);
    }


    if (!currencyInfo) {
      // If currency info is truly missing, we can't use style: 'currency'.
      // Fallback to a number format or a simple toFixed with the currency code.
      try {
        // Attempt to format as a number if currency is unknown to Intl
        return new Intl.NumberFormat(navigator.language, { 
            minimumFractionDigits: minDecimals, 
            maximumFractionDigits: maxDecimals,
            ...(options.notation === 'compact' && {
                notation: 'compact',
                minimumSignificantDigits: numberFormatOptions.minimumSignificantDigits,
                maximumSignificantDigits: numberFormatOptions.maximumSignificantDigits
            })
        }).format(amount) + ` ${currencyToUse}`; // Append currency code manually
      } catch (e) {
        return `${currencyToUse} ${amount.toFixed(defaultMinDecimals)}`; // Absolute fallback
      }
    }
    
    try {
      return new Intl.NumberFormat(currencyInfo.locale || navigator.language, numberFormatOptions).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error, { amount, currencyToUse, locale: currencyInfo.locale, options: numberFormatOptions });
      // Fallback if Intl.NumberFormat fails (e.g., unsupported currency code with specific locale)
      return `${currencyToUse} ${amount.toFixed(defaultMinDecimals)}`;
    }
  };

  const value = {
    selectedCountry,
    setSelectedCountry,
    selectedCurrency,
    // setSelectedCurrency, // Only expose if direct setting is needed; usually derived from selectedCountry
    exchangeRates,
    convertCurrency,
    formatCurrency,
    countries,
    currencies,
  };

  return (
    <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
  );
};