export const countries = {
  US: {
    name: 'United States',
    currency: 'USD',
    taxRates: {
      federal: [
        { min: 0, max: 10275, rate: 0.1 },
        { min: 10275, max: 41775, rate: 0.12 },
        { min: 41775, max: 89450, rate: 0.22 },
        { min: 89450, max: 190750, rate: 0.24 },
        { min: 190750, max: 364200, rate: 0.32 },
        { min: 364200, max: 462500, rate: 0.35 },
        { min: 462500, max: Infinity, rate: 0.37 },
      ],
      state: 0.05, // Average state tax
      social: 0.062,
      medicare: 0.0145,
    },
    workingHours: {
      standard: 40,
      overtime: 1.5,
    },
    holidays: 10,
    vacationDays: 10,
  },
  CA: {
    name: 'Canada',
    currency: 'CAD',
    taxRates: {
      federal: [
        { min: 0, max: 50197, rate: 0.15 },
        { min: 50197, max: 100392, rate: 0.205 },
        { min: 100392, max: 155625, rate: 0.26 },
        { min: 155625, max: 221708, rate: 0.29 },
        { min: 221708, max: Infinity, rate: 0.33 },
      ],
      provincial: 0.08, // Average provincial tax
      cpp: 0.0595,
      ei: 0.0163,
    },
    workingHours: {
      standard: 40,
      overtime: 1.5,
    },
    holidays: 11,
    vacationDays: 10,
  },
  GB: {
    name: 'United Kingdom',
    currency: 'GBP',
    taxRates: {
      income: [
        { min: 0, max: 12570, rate: 0 },
        { min: 12570, max: 50270, rate: 0.2 },
        { min: 50270, max: 125140, rate: 0.4 },
        { min: 125140, max: Infinity, rate: 0.45 },
      ],
      ni: 0.12,
      pension: 0.05,
    },
    workingHours: {
      standard: 37.5,
      overtime: 1.5,
    },
    holidays: 8,
    vacationDays: 20,
  },
  AU: {
    name: 'Australia',
    currency: 'AUD',
    taxRates: {
      income: [
        { min: 0, max: 18200, rate: 0 },
        { min: 18200, max: 45000, rate: 0.19 },
        { min: 45000, max: 120000, rate: 0.325 },
        { min: 120000, max: 180000, rate: 0.37 },
        { min: 180000, max: Infinity, rate: 0.45 },
      ],
      medicare: 0.02,
      super: 0.11,
    },
    workingHours: {
      standard: 38,
      overtime: 1.5,
    },
    holidays: 11,
    vacationDays: 20,
  },
  DE: {
    name: 'Germany',
    currency: 'EUR',
    taxRates: {
      income: [
        { min: 0, max: 10908, rate: 0 },
        { min: 10908, max: 62810, rate: 0.14 },
        { min: 62810, max: 277826, rate: 0.42 },
        { min: 277826, max: Infinity, rate: 0.45 },
      ],
      social: 0.195,
      church: 0.08,
    },
    workingHours: {
      standard: 40,
      overtime: 1.25,
    },
    holidays: 9,
    vacationDays: 24,
  },
  FR: {
    name: 'France',
    currency: 'EUR',
    taxRates: {
      income: [
        { min: 0, max: 10777, rate: 0 },
        { min: 10777, max: 27478, rate: 0.11 },
        { min: 27478, max: 78570, rate: 0.3 },
        { min: 78570, max: 168994, rate: 0.41 },
        { min: 168994, max: Infinity, rate: 0.45 },
      ],
      social: 0.22,
      csg: 0.098,
    },
    workingHours: {
      standard: 35,
      overtime: 1.25,
    },
    holidays: 11,
    vacationDays: 25,
  },
  IN: {
    name: 'India',
    currency: 'INR',
    taxRates: {
      income: [
        { min: 0, max: 250000, rate: 0 },
        { min: 250000, max: 500000, rate: 0.05 },
        { min: 500000, max: 1000000, rate: 0.2 },
        { min: 1000000, max: Infinity, rate: 0.3 },
      ],
      cess: 0.04,
      pf: 0.12,
    },
    workingHours: {
      standard: 48,
      overtime: 2.0,
    },
    holidays: 12,
    vacationDays: 12,
  },
  JP: {
    name: 'Japan',
    currency: 'JPY',
    taxRates: {
      income: [
        { min: 0, max: 1950000, rate: 0.05 },
        { min: 1950000, max: 3300000, rate: 0.1 },
        { min: 3300000, max: 6950000, rate: 0.2 },
        { min: 6950000, max: 9000000, rate: 0.23 },
        { min: 9000000, max: 18000000, rate: 0.33 },
        { min: 18000000, max: 40000000, rate: 0.4 },
        { min: 40000000, max: Infinity, rate: 0.45 },
      ],
      resident: 0.1,
      social: 0.15,
    },
    workingHours: {
      standard: 40,
      overtime: 1.25,
    },
    holidays: 16,
    vacationDays: 10,
  },
  SG: {
    name: 'Singapore',
    currency: 'SGD',
    taxRates: {
      income: [
        { min: 0, max: 20000, rate: 0 },
        { min: 20000, max: 30000, rate: 0.02 },
        { min: 30000, max: 40000, rate: 0.035 },
        { min: 40000, max: 80000, rate: 0.07 },
        { min: 80000, max: 120000, rate: 0.115 },
        { min: 120000, max: 160000, rate: 0.15 },
        { min: 160000, max: 200000, rate: 0.18 },
        { min: 200000, max: 240000, rate: 0.19 },
        { min: 240000, max: 280000, rate: 0.195 },
        { min: 280000, max: 320000, rate: 0.2 },
        { min: 320000, max: Infinity, rate: 0.22 },
      ],
      cpf: 0.2,
    },
    workingHours: {
      standard: 44,
      overtime: 1.5,
    },
    holidays: 11,
    vacationDays: 7,
  },
  BR: {
    name: 'Brazil',
    currency: 'BRL',
    taxRates: {
      income: [
        { min: 0, max: 22847.76, rate: 0 },
        { min: 22847.76, max: 33919.8, rate: 0.075 },
        { min: 33919.8, max: 45012.6, rate: 0.15 },
        { min: 45012.6, max: 55976.16, rate: 0.225 },
        { min: 55976.16, max: Infinity, rate: 0.275 },
      ],
      inss: 0.11,
      fgts: 0.08,
    },
    workingHours: {
      standard: 44,
      overtime: 1.5,
    },
    holidays: 12,
    vacationDays: 30,
  },
};
