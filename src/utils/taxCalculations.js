import { countries } from '../data/countries';

export const calculateTax = (income, countryCode) => {
  const country = countries[countryCode];
  if (!country || !country.taxRates) {
    return {
      totalTax: 0,
      federalTax: 0,
      stateTax: 0,
      socialSecurity: 0,
      medicare: 0,
      other: 0,
    };
  }

  let taxes = {
    federalTax: 0,
    stateTax: 0,
    socialSecurity: 0,
    medicare: 0,
    other: 0,
  };

  // Calculate progressive tax based on brackets
  const calculateProgressiveTax = (brackets, income) => {
    let tax = 0;
    let remainingIncome = income;

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;

      const taxableInBracket = Math.min(
        remainingIncome,
        bracket.max - bracket.min
      );
      tax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
    }

    return tax;
  };

  // Country-specific calculations
  switch (countryCode) {
    case 'US':
      taxes.federalTax = calculateProgressiveTax(
        country.taxRates.federal,
        income
      );
      taxes.stateTax = income * (country.taxRates.state || 0);
      taxes.socialSecurity = Math.min(
        income * country.taxRates.social,
        160200 * country.taxRates.social
      ); // 2023 cap
      taxes.medicare = income * country.taxRates.medicare;
      break;

    case 'CA':
      taxes.federalTax = calculateProgressiveTax(
        country.taxRates.federal,
        income
      );
      taxes.stateTax = income * (country.taxRates.provincial || 0);
      taxes.socialSecurity = Math.min(
        income * country.taxRates.cpp,
        66600 * country.taxRates.cpp
      ); // 2023 cap
      taxes.medicare = Math.min(
        income * country.taxRates.ei,
        63300 * country.taxRates.ei
      ); // EI cap
      break;

    case 'GB':
      taxes.federalTax = calculateProgressiveTax(
        country.taxRates.income,
        income
      );
      taxes.socialSecurity =
        income > 12570
          ? Math.min(
              (income - 12570) * country.taxRates.ni,
              50270 * country.taxRates.ni
            )
          : 0;
      taxes.other = income * (country.taxRates.pension || 0);
      break;

    case 'AU':
      taxes.federalTax = calculateProgressiveTax(
        country.taxRates.income,
        income
      );
      taxes.medicare = income > 23226 ? income * country.taxRates.medicare : 0; // Medicare levy threshold
      taxes.other = income * (country.taxRates.super || 0);
      break;

    case 'DE':
      taxes.federalTax = calculateProgressiveTax(
        country.taxRates.income,
        income
      );
      taxes.socialSecurity = income * (country.taxRates.social || 0);
      taxes.other = income * (country.taxRates.church || 0);
      break;

    case 'FR':
      taxes.federalTax = calculateProgressiveTax(
        country.taxRates.income,
        income
      );
      taxes.socialSecurity = income * (country.taxRates.social || 0);
      taxes.other = income * (country.taxRates.csg || 0);
      break;

    case 'IN':
      taxes.federalTax = calculateProgressiveTax(
        country.taxRates.income,
        income
      );
      taxes.other = taxes.federalTax * (country.taxRates.cess || 0); // Cess on income tax
      taxes.socialSecurity = Math.min(
        income * country.taxRates.pf,
        1800000 * country.taxRates.pf
      ); // PF cap
      break;

    case 'JP':
      taxes.federalTax = calculateProgressiveTax(
        country.taxRates.income,
        income
      );
      taxes.stateTax = income * (country.taxRates.resident || 0);
      taxes.socialSecurity = income * (country.taxRates.social || 0);
      break;

    case 'SG':
      taxes.federalTax = calculateProgressiveTax(
        country.taxRates.income,
        income
      );
      taxes.socialSecurity = Math.min(
        income * country.taxRates.cpf,
        102000 * country.taxRates.cpf
      ); // CPF cap
      break;

    case 'BR':
      taxes.federalTax = calculateProgressiveTax(
        country.taxRates.income,
        income
      );
      taxes.socialSecurity = Math.min(
        income * country.taxRates.inss,
        7087.22 * 12
      ); // INSS cap
      taxes.other = income * (country.taxRates.fgts || 0);
      break;

    default:
      // Generic calculation for other countries
      if (country.taxRates.income) {
        taxes.federalTax = calculateProgressiveTax(
          country.taxRates.income,
          income
        );
      }
      if (country.taxRates.social) {
        taxes.socialSecurity = income * country.taxRates.social;
      }
      break;
  }

  taxes.totalTax =
    taxes.federalTax +
    taxes.stateTax +
    taxes.socialSecurity +
    taxes.medicare +
    taxes.other;

  return taxes;
};

export const getEffectiveTaxRate = (income, countryCode) => {
  const taxes = calculateTax(income, countryCode);
  return income > 0 ? (taxes.totalTax / income) * 100 : 0;
};

export const getMarginalTaxRate = (income, countryCode) => {
  const country = countries[countryCode];
  if (!country || !country.taxRates) return 0;

  let marginalRate = 0;

  // Find the tax bracket for the given income
  if (country.taxRates.federal) {
    for (const bracket of country.taxRates.federal) {
      if (income >= bracket.min && income <= bracket.max) {
        marginalRate = bracket.rate;
        break;
      }
    }
  } else if (country.taxRates.income) {
    for (const bracket of country.taxRates.income) {
      if (income >= bracket.min && income <= bracket.max) {
        marginalRate = bracket.rate;
        break;
      }
    }
  }

  // Add other marginal rates
  if (country.taxRates.state) marginalRate += country.taxRates.state;
  if (country.taxRates.provincial) marginalRate += country.taxRates.provincial;
  if (country.taxRates.social) marginalRate += country.taxRates.social;
  if (country.taxRates.medicare) marginalRate += country.taxRates.medicare;

  return marginalRate * 100;
};
