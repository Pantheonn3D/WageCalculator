// taxCalculations.js

import { countries } from '../data/countries'; // Ensure this path is correct for your project structure

/**
 * Calculates progressive tax based on income and a set of tax brackets.
 * @param {Array<{min: number, max: number|Infinity, rate: number}>} brackets - Sorted array of tax brackets.
 * @param {number} income - The total income to be taxed.
 * @returns {number} The total calculated progressive tax.
 */
const calculateProgressiveTax = (brackets, income) => {
  if (!brackets || !Array.isArray(brackets) || brackets.length === 0) {
    return 0;
  }

  let totalTax = 0;
  let incomeRemainingToTax = income; // This represents the portion of income that hasn't had this specific tax applied yet.
  let previousBracketMax = 0;

  // Ensure brackets are sorted by 'min' for safety, though they should be in data.
  const sortedBrackets = [...brackets].sort((a, b) => a.min - b.min);

  for (const bracket of sortedBrackets) {
    if (income <= previousBracketMax) { // If income was fully taxed by previous brackets
      break;
    }

    // Determine the taxable amount strictly within this bracket
    // Lower bound for this bracket's calculation is the higher of actual bracket.min or end of previous bracket.
    const currentBracketMin = Math.max(bracket.min, previousBracketMax);
    const currentBracketMax = (bracket.max === Infinity) ? Infinity : bracket.max;

    if (income > currentBracketMin) {
        const taxableInThisBracket = Math.min(income, currentBracketMax) - currentBracketMin;
        if (taxableInThisBracket > 0) {
            totalTax += taxableInThisBracket * bracket.rate;
        }
    }
    
    previousBracketMax = currentBracketMax;
    if (previousBracketMax === Infinity) break; // No more brackets after an infinite one
  }
  return totalTax;
};

/**
 * Calculates various taxes based on income and country-specific rules.
 * @param {number} income - Annual gross income.
 * @param {string} countryCode - The 2-letter country code.
 * @returns {object} An object containing different tax components and total tax.
 */
export const calculateTax = (income, countryCode) => {
  const country = countries[countryCode];

  // Default tax object
  let taxes = {
    totalTax: 0,
    federalTax: 0,
    stateTax: 0, // Or provincial
    socialSecurity: 0,
    medicare: 0, // Or equivalent health contributions
    other: 0, // For miscellaneous country-specific taxes like church tax, CPF, etc.
  };

  if (!country || !country.taxRates) {
    console.warn(`No tax rate data found for country: ${countryCode}`);
    return taxes; // Return default zeroed taxes
  }

  // Ensure income is a number
  const numericIncome = parseFloat(income);
  if (isNaN(numericIncome) || numericIncome < 0) {
    return taxes; // Return default if income is invalid
  }

  // Country-specific calculations
  switch (countryCode) {
    case 'US':
      taxes.federalTax = calculateProgressiveTax(country.taxRates.federal, numericIncome);
      // State tax: could be flat, progressive, or none.
      // This example assumes it's a flat rate if 'state' is a number, or a function if complex.
      if (typeof country.taxRates.state === 'number') {
        taxes.stateTax = numericIncome * country.taxRates.state;
      } else if (typeof country.taxRates.state === 'function') {
        taxes.stateTax = country.taxRates.state(numericIncome); // For complex state tax logic
      } else if (Array.isArray(country.taxRates.state)) { // Assuming progressive state tax brackets
        taxes.stateTax = calculateProgressiveTax(country.taxRates.state, numericIncome);
      }

      // Social Security: capped
      const ssCapUS = country.taxCaps?.socialSecurityCap || 168600; // 2024 cap, make this data-driven
      taxes.socialSecurity = Math.min(numericIncome, ssCapUS) * (country.taxRates.social || 0);
      
      // Medicare: no cap on income, but additional rate for high earners
      taxes.medicare = numericIncome * (country.taxRates.medicare || 0);
      if (country.taxRates.medicareHighIncome && numericIncome > (country.taxCaps?.medicareHighIncomeThreshold || 200000)) {
        taxes.medicare += (numericIncome - (country.taxCaps?.medicareHighIncomeThreshold || 200000)) * country.taxRates.medicareHighIncome;
      }
      break;

    case 'CA': // Canada
      taxes.federalTax = calculateProgressiveTax(country.taxRates.federal, numericIncome);
      // Provincial tax - assuming it can be progressive brackets
      if (Array.isArray(country.taxRates.provincial)) {
        taxes.provincialTax = calculateProgressiveTax(country.taxRates.provincial, numericIncome);
        taxes.stateTax = taxes.provincialTax; // Keep stateTax for consistency if used elsewhere
      } else if (typeof country.taxRates.provincial === 'number') {
        taxes.provincialTax = numericIncome * country.taxRates.provincial;
        taxes.stateTax = taxes.provincialTax;
      }

      // CPP (Canada Pension Plan): capped
      const cppCap = country.taxCaps?.cppMaxEarnings || 68500; // 2024, data-driven
      const cppExemption = country.taxCaps?.cppBasicExemption || 3500;
      const cppContributionBase = Math.max(0, Math.min(numericIncome, cppCap) - cppExemption);
      taxes.socialSecurity = cppContributionBase * (country.taxRates.cpp || 0);

      // EI (Employment Insurance): capped
      const eiCap = country.taxCaps?.eiMaxInsurableEarnings || 63200; // 2024, data-driven
      taxes.medicare = Math.min(numericIncome, eiCap) * (country.taxRates.ei || 0); // Storing EI under 'medicare' for structural similarity
      break;

    // ... (Add other country cases here, reviewing each carefully)
    // Example for a country with flat social security and 'other' tax as a rate
    // case 'XX':
    //   taxes.federalTax = calculateProgressiveTax(country.taxRates.income, numericIncome);
    //   taxes.socialSecurity = numericIncome * (country.taxRates.social || 0);
    //   if (country.taxRates.otherIsRate) { // You would add this flag to your country data
    //     taxes.other = numericIncome * (country.taxRates.other || 0);
    //   } else {
    //     taxes.other = country.taxRates.other || 0; // Assumed flat amount
    //   }
    //   break;

    default:
      // Generic fallback if specific country logic isn't defined but basic rates exist
      if (country.taxRates.income && Array.isArray(country.taxRates.income)) {
        taxes.federalTax = calculateProgressiveTax(country.taxRates.income, numericIncome);
      } else if (typeof country.taxRates.income === 'number') { // Fallback for flat national income tax
        taxes.federalTax = numericIncome * country.taxRates.income;
      }

      if (typeof country.taxRates.state === 'number') {
         taxes.stateTax = numericIncome * country.taxRates.state;
      } else if (Array.isArray(country.taxRates.state)) {
         taxes.stateTax = calculateProgressiveTax(country.taxRates.state, numericIncome);
      }

      // Social Security - assuming flat rate if not complex structure
      if (typeof country.taxRates.social === 'number') {
        taxes.socialSecurity = numericIncome * (country.taxRates.social || 0);
      }
      // Medicare/Health - assuming flat rate
      if (typeof country.taxRates.medicare === 'number') {
        taxes.medicare = numericIncome * (country.taxRates.medicare || 0);
      }

      // Other taxes
      if (country.taxRates.other !== undefined) {
        // Add a flag in your country data to distinguish rate vs. flat amount, e.g., `otherTaxType: 'rate' | 'flat'`
        if (country.taxRates.otherTaxType === 'rate' && typeof country.taxRates.other === 'number') {
          taxes.other = numericIncome * country.taxRates.other;
        } else if (typeof country.taxRates.other === 'number') { // Assumes flat amount by default if type is number and not explicitly a rate
          taxes.other = country.taxRates.other;
        }
      }
      break;
  }

  // Sum up all calculated tax components
  taxes.totalTax =
    (taxes.federalTax || 0) +
    (taxes.stateTax || 0) +
    (taxes.socialSecurity || 0) +
    (taxes.medicare || 0) +
    (taxes.other || 0);

  return taxes;
};

/**
 * Calculates the effective tax rate.
 * @param {number} income - Annual gross income.
 * @param {string} countryCode - The 2-letter country code.
 * @returns {number} The effective tax rate as a decimal (e.g., 0.22 for 22%).
 */
export const getEffectiveTaxRate = (income, countryCode) => {
  const numericIncome = parseFloat(income);
  if (isNaN(numericIncome) || numericIncome <= 0) {
    return 0;
  }
  const taxInfo = calculateTax(numericIncome, countryCode);
  return (taxInfo.totalTax || 0) / numericIncome; // Returns a decimal
};

/**
 * Calculates the marginal income tax rate (highest bracket rate for federal/national income tax).
 * @param {number} income - Annual gross income.
 * @param {string} countryCode - The 2-letter country code.
 * @returns {number} The marginal tax rate as a decimal (e.g., 0.30 for 30%).
 */
export const getMarginalTaxRate = (income, countryCode) => {
  const numericIncome = parseFloat(income);
  if (isNaN(numericIncome) || numericIncome < 0) { // Can be 0 for marginal rate at 0 income
    return 0;
  }

  const country = countries[countryCode];
  if (!country || !country.taxRates) {
    return 0;
  }

  let incomeTaxMarginalRate = 0;
  // Use the primary income tax brackets (federal for US/CA, national/income for others)
  const incomeBrackets = country.taxRates.federal || country.taxRates.income;

  if (incomeBrackets && Array.isArray(incomeBrackets)) {
    const sortedBrackets = [...incomeBrackets].sort((a, b) => a.min - b.min);
    for (const bracket of sortedBrackets) {
      // Income falls into this bracket if it's >= min and < max (or max is Infinity)
      if (numericIncome >= bracket.min) {
        if (bracket.max === Infinity || numericIncome < bracket.max) {
          incomeTaxMarginalRate = bracket.rate;
          break; // Found the bracket
        }
        // If income is exactly on bracket.max, it's usually considered in the next bracket's rate
        // or for the very last bracket, it's this rate.
        // The logic above handles: if income is 50k, max is 50k, it will NOT take this bracket's rate,
        // it will look for the next bracket where min is 50k. If this is the last bracket, then it's this rate.
        // A simpler assignment:
        // incomeTaxMarginalRate = bracket.rate; // This would assign the rate of the highest bracket the income touches.
      }
    }
    // If income is higher than all defined bracket mins, but last bracket was not Infinity,
    // it might mean it's in the highest defined bracket.
    // This specific logic might need to be tailored to how your brackets are defined (inclusive/exclusive max).
    // The current loop should correctly find the rate for bracket where: bracket.min <= income < bracket.max

  } else if (typeof incomeBrackets === 'number') { // Fallback if income tax is a flat rate
    incomeTaxMarginalRate = incomeBrackets;
  }
  
  // Note: This simplified marginal rate only considers the main income tax.
  // A true "marginal effective rate" would include impacts of social security, phase-outs, etc. on the next dollar.
  // For now, returning the main income tax bracket rate is common.
  return incomeTaxMarginalRate; // Returns a decimal
};