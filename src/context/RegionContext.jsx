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
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    // Detect user's location
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code && countries[data.country_code]) {
          setSelectedCountry(data.country_code);
          setSelectedCurrency(countries[data.country_code].currency);
        }
      } catch (error) {
        console.log('Could not detect location, using default');
      }
    };

    detectLocation();
  }, []);

  useEffect(() => {
    // Fetch exchange rates
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/USD`
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.log('Could not fetch exchange rates');
      }
    };

    fetchExchangeRates();
  }, []);

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    if (!exchangeRates[toCurrency] || !exchangeRates[fromCurrency])
      return amount;

    const usdAmount =
      fromCurrency === 'USD' ? amount : amount / exchangeRates[fromCurrency];
    return toCurrency === 'USD'
      ? usdAmount
      : usdAmount * exchangeRates[toCurrency];
  };

  const formatCurrency = (amount, currency = selectedCurrency) => {
    const currencyInfo = currencies[currency];
    if (!currencyInfo) return amount.toString();

    return new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currencyInfo.decimals,
      maximumFractionDigits: currencyInfo.decimals,
    }).format(amount);
  };

  const value = {
    selectedCountry,
    setSelectedCountry,
    selectedCurrency,
    setSelectedCurrency,
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
