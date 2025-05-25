export const countries = {
  US: {
    name: 'United States',
    currency: 'USD',
    taxRates: {
      federal: [
        { min: 0, max: 11000, rate: 0.10 },
        { min: 11001, max: 44725, rate: 0.12 },
        { min: 44726, max: 95375, rate: 0.22 },
        { min: 95376, max: 182100, rate: 0.24 },
        { min: 182101, max: 231250, rate: 0.32 },
        { min: 231251, max: 578125, rate: 0.35 },
        { min: 578126, max: Infinity, rate: 0.37 },
      ],
      state: 0.045, // Changed from stateAverage
      social: 0.062, // Changed from socialSecurity
      medicare: 0.0145,
    },
    workingHours: {
      standard: 40,
      overtime: 1.5,
    },
    holidays: 11,
    vacationDays: 10,
  },
  CA: {
    name: 'Canada',
    currency: 'CAD',
    taxRates: {
      federal: [
        { min: 0, max: 53359, rate: 0.15 },
        { min: 53360, max: 106717, rate: 0.205 },
        { min: 106718, max: 165430, rate: 0.26 },
        { min: 165431, max: 235675, rate: 0.29 },
        { min: 235676, max: Infinity, rate: 0.33 },
      ],
      provincial: 0.10, // Changed from provincialAverage
      cpp: 0.0595,
      ei: 0.0166,
    },
    workingHours: {
      standard: 40,
      overtime: 1.5,
    },
    holidays: 9,
    vacationDays: 10,
  },
  MX: {
    name: 'Mexico',
    currency: 'MXN',
    taxRates: {
      income: [
        { min: 0, max: 8952.49, rate: 0.0192 },
        { min: 8952.50, max: 75984.55, rate: 0.0640 },
        { min: 75984.56, max: 133536.07, rate: 0.1088 },
        { min: 133536.08, max: 155232.83, rate: 0.1600 },
        { min: 155232.84, max: 185856.07, rate: 0.1792 },
        { min: 185856.08, max: 375960.19, rate: 0.2136 },
        { min: 375960.20, max: 592608.19, rate: 0.2352 },
        { min: 592608.20, max: 1130640.83, rate: 0.3000 },
        { min: 1130640.84, max: 1507512.07, rate: 0.3200 },
        { min: 1507512.08, max: 4522536.19, rate: 0.3400 },
        { min: 4522536.20, max: Infinity, rate: 0.3500 },
      ],
      social: 0.028, // Changed from imssEmployee
    },
    workingHours: {
      standard: 48,
      overtime: 2.0,
    },
    holidays: 9,
    vacationDays: 12,
  },
  GB: {
    name: 'United Kingdom',
    currency: 'GBP',
    taxRates: {
      income: [
        { min: 0, max: 12570, rate: 0 },
        { min: 12571, max: 50270, rate: 0.20 },
        { min: 50271, max: 125140, rate: 0.40 },
        { min: 125141, max: Infinity, rate: 0.45 },
      ],
      ni: 0.10, // Simplified from complex brackets
      pension: 0.05, // Changed from pensionAutoEnrolmentEmployee
    },
    workingHours: {
      standard: 37.5,
      overtime: 1.5,
    },
    holidays: 8,
    vacationDays: 28,
  },
  DE: {
    name: 'Germany',
    currency: 'EUR',
    taxRates: {
      income: [
        { min: 0, max: 11604, rate: 0 },
        { min: 11605, max: 17005, rate: 0.14 },
        { min: 17006, max: 66760, rate: 0.2397 },
        { min: 66761, max: 277825, rate: 0.42 },
        { min: 277826, max: Infinity, rate: 0.45 },
      ],
      social: 0.196, // Combined social security (pension + health + nursing + unemployment)
      church: 0.08, // Church tax factor
    },
    workingHours: {
      standard: 38,
      overtime: 1.25,
    },
    holidays: 9,
    vacationDays: 20,
  },
  FR: {
    name: 'France',
    currency: 'EUR',
    taxRates: {
      income: [
        { min: 0, max: 11294, rate: 0 },
        { min: 11295, max: 28797, rate: 0.11 },
        { min: 28798, max: 82341, rate: 0.30 },
        { min: 82342, max: 177106, rate: 0.41 },
        { min: 177107, max: Infinity, rate: 0.45 },
      ],
      social: 0.10, // Combined social security
      csg: 0.097, // CSG + CRDS combined
    },
    workingHours: {
      standard: 35,
      overtime: 1.25,
      overtimeHigher: 1.50,
    },
    holidays: 11,
    vacationDays: 25,
  },
  IT: {
    name: 'Italy',
    currency: 'EUR',
    taxRates: {
      income: [
        { min: 0, max: 28000, rate: 0.23 },
        { min: 28001, max: 50000, rate: 0.35 },
        { min: 50001, max: Infinity, rate: 0.43 },
      ],
      social: 0.0919, // INPS employee
      other: 0.023, // Regional + municipal tax
    },
    workingHours: {
      standard: 40,
      overtime: 1.25,
    },
    holidays: 11,
    vacationDays: 20,
  },
  ES: {
    name: 'Spain',
    currency: 'EUR',
    taxRates: {
      income: [
        { min: 0, max: 12450, rate: 0.19 },
        { min: 12451, max: 20200, rate: 0.24 },
        { min: 20201, max: 35200, rate: 0.30 },
        { min: 35201, max: 60000, rate: 0.37 },
        { min: 60001, max: 300000, rate: 0.45 },
        { min: 300001, max: Infinity, rate: 0.47 },
      ],
      social: 0.0635, // Combined social security
    },
    workingHours: {
      standard: 40,
      overtime: 1.0,
    },
    holidays: 14,
    vacationDays: 22,
  },
  NL: {
    name: 'Netherlands',
    currency: 'EUR',
    taxRates: {
      income: [
        { min: 0, max: 75518, rate: 0.3697 },
        { min: 75519, max: Infinity, rate: 0.4950 },
      ],
    },
    workingHours: {
      standard: 36,
      overtime: 1.25,
    },
    holidays: 8,
    vacationDays: 20,
  },
  CH: {
    name: 'Switzerland',
    currency: 'CHF',
    taxRates: {
      income: [
        { min: 0, max: 14800, rate: 0 },
        { min: 14801, max: 32200, rate: 0.0077 },
        { min: 32201, max: 42200, rate: 0.0088 },
        { min: 42201, max: 180700, rate: 0.11 },
        { min: 180701, max: 769600, rate: 0.11 },
        { min: 769601, max: Infinity, rate: 0.115 },
      ],
      social: 0.124, // Combined social security
      other: 0.15, // Cantonal/municipal tax average
    },
    workingHours: {
      standard: 41,
      overtime: 1.25,
    },
    holidays: 9,
    vacationDays: 20,
  },
  SE: {
    name: 'Sweden',
    currency: 'SEK',
    taxRates: {
      income: [
        { min: 0, max: 615700, rate: 0.32 },
        { min: 615701, max: Infinity, rate: 0.52 },
      ],
      social: 0.07, // Pension employee
    },
    workingHours: {
      standard: 40,
      overtime: 1.5,
    },
    holidays: 13,
    vacationDays: 25,
  },
  NO: {
    name: 'Norway',
    currency: 'NOK',
    taxRates: {
      income: [
        { min: 0, max: 208050, rate: 0.22 },
        { min: 208051, max: 292850, rate: 0.237 },
        { min: 292851, max: 670000, rate: 0.262 },
        { min: 670001, max: 937900, rate: 0.358 },
        { min: 937901, max: 1350000, rate: 0.398 },
        { min: 1350001, max: Infinity, rate: 0.40 },
      ],
      social: 0.079, // National insurance
    },
    workingHours: {
      standard: 37.5,
      overtime: 1.40,
    },
    holidays: 10,
    vacationDays: 21,
  },
  DK: {
    name: 'Denmark',
    currency: 'DKK',
    taxRates: {
      income: [
        { min: 0, max: 588900, rate: 0.40 }, // Combined municipal + AM contribution
        { min: 588901, max: 696296, rate: 0.475 },
        { min: 696297, max: 2500000, rate: 0.55 },
        { min: 2500001, max: Infinity, rate: 0.60 },
      ],
    },
    workingHours: {
      standard: 37,
      overtime: 1.5,
    },
    holidays: 11,
    vacationDays: 25,
  },
  FI: {
    name: 'Finland',
    currency: 'EUR',
    taxRates: {
      income: [
        { min: 0, max: 19900, rate: 0.074 }, // Municipal tax only
        { min: 19901, max: 29700, rate: 0.0741 },
        { min: 29701, max: 49000, rate: 0.134 },
        { min: 49001, max: 85800, rate: 0.2465 },
        { min: 85801, max: Infinity, rate: 0.3865 },
      ],
      social: 0.0845, // Combined social security
    },
    workingHours: {
      standard: 37.5,
      overtime: 1.5,
    },
    holidays: 11,
    vacationDays: 24,
  },
  IE: {
    name: 'Ireland',
    currency: 'EUR',
    taxRates: {
      income: [
        { min: 0, max: 42000, rate: 0.20 },
        { min: 42001, max: Infinity, rate: 0.40 },
      ],
      social: 0.04, // PRSI
      other: 0.08, // USC average
    },
    workingHours: {
      standard: 39,
      overtime: 1.0,
    },
    holidays: 10,
    vacationDays: 20,
  },
  BE: {
    name: 'Belgium',
    currency: 'EUR',
    taxRates: {
      income: [
        { min: 0, max: 15200, rate: 0.25 },
        { min: 15201, max: 26830, rate: 0.40 },
        { min: 26831, max: 46440, rate: 0.45 },
        { min: 46441, max: Infinity, rate: 0.50 },
      ],
      social: 0.1307,
      other: 0.07, // Communal tax
    },
    workingHours: {
      standard: 38,
      overtime: 1.5,
    },
    holidays: 10,
    vacationDays: 20,
  },
  AT: {
    name: 'Austria',
    currency: 'EUR',
    taxRates: {
      income: [
        { min: 0, max: 12816, rate: 0 },
        { min: 12817, max: 20818, rate: 0.20 },
        { min: 20819, max: 34513, rate: 0.30 },
        { min: 34514, max: 66612, rate: 0.40 },
        { min: 66613, max: 99266, rate: 0.48 },
        { min: 99267, max: 1000000, rate: 0.50 },
        { min: 1000001, max: Infinity, rate: 0.55 },
      ],
      social: 0.1812,
    },
    workingHours: {
      standard: 38.5,
      overtime: 1.5,
    },
    holidays: 13,
    vacationDays: 25,
  },
  PT: {
    name: 'Portugal',
    currency: 'EUR',
    taxRates: {
      income: [
        { min: 0, max: 7703, rate: 0.1325 },
        { min: 7704, max: 11623, rate: 0.18 },
        { min: 11624, max: 16472, rate: 0.23 },
        { min: 16473, max: 21321, rate: 0.26 },
        { min: 21322, max: 27146, rate: 0.3275 },
        { min: 27147, max: 39791, rate: 0.37 },
        { min: 39792, max: 51997, rate: 0.435 },
        { min: 51998, max: 81199, rate: 0.45 },
        { min: 81200, max: Infinity, rate: 0.48 },
      ],
      social: 0.11,
    },
    workingHours: {
      standard: 40,
      overtime: 1.25,
    },
    holidays: 13,
    vacationDays: 22,
  },
  GR: {
    name: 'Greece',
    currency: 'EUR',
    taxRates: {
      income: [
        { min: 0, max: 10000, rate: 0.09 },
        { min: 10001, max: 20000, rate: 0.22 },
        { min: 20001, max: 30000, rate: 0.28 },
        { min: 30001, max: 40000, rate: 0.36 },
        { min: 40001, max: Infinity, rate: 0.44 },
      ],
      social: 0.1412,
    },
    workingHours: {
      standard: 40,
      overtime: 1.20,
    },
    holidays: 12,
    vacationDays: 20,
  },
  PL: {
    name: 'Poland',
    currency: 'PLN',
    taxRates: {
      income: [
        { min: 0, max: 120000, rate: 0.12 },
        { min: 120001, max: Infinity, rate: 0.32 },
      ],
      social: 0.2271, // Combined ZUS
      other: 0.09, // Health insurance
    },
    workingHours: {
      standard: 40,
      overtime: 1.5,
    },
    holidays: 13,
    vacationDays: 20,
  },
  CZ: {
    name: 'Czech Republic',
    currency: 'CZK',
    taxRates: {
      income: [
        { min: 0, max: 1582800, rate: 0.15 },
        { min: 1582801, max: Infinity, rate: 0.23 },
      ],
      social: 0.116, // Combined social + health
    },
    workingHours: {
      standard: 40,
      overtime: 1.25,
    },
    holidays: 13,
    vacationDays: 20,
  },
  HU: {
    name: 'Hungary',
    currency: 'HUF',
    taxRates: {
      income: [
        { min: 0, max: Infinity, rate: 0.15 },
      ],
      social: 0.185,
    },
    workingHours: {
      standard: 40,
      overtime: 1.5,
    },
    holidays: 11,
    vacationDays: 20,
  },
  AU: {
    name: 'Australia',
    currency: 'AUD',
    taxRates: {
      income: [
        { min: 0, max: 18200, rate: 0 },
        { min: 18201, max: 45000, rate: 0.19 },
        { min: 45001, max: 120000, rate: 0.325 },
        { min: 120001, max: 180000, rate: 0.37 },
        { min: 180001, max: Infinity, rate: 0.45 },
      ],
      medicare: 0.02,
      super: 0.105, // Superannuation
    },
    workingHours: {
      standard: 38,
      overtime: 1.5,
    },
    holidays: 10,
    vacationDays: 20,
  },
  NZ: {
    name: 'New Zealand',
    currency: 'NZD',
    taxRates: {
      income: [
        { min: 0, max: 14000, rate: 0.105 },
        { min: 14001, max: 48000, rate: 0.175 },
        { min: 48001, max: 70000, rate: 0.30 },
        { min: 70001, max: 180000, rate: 0.33 },
        { min: 180001, max: Infinity, rate: 0.39 },
      ],
      other: 0.0460, // ACC + KiwiSaver combined
    },
    workingHours: {
      standard: 40,
      overtime: 1.5,
    },
    holidays: 12,
    vacationDays: 20,
  },
  JP: {
    name: 'Japan',
    currency: 'JPY',
    taxRates: {
      income: [
        { min: 0, max: 1949999, rate: 0.05 },
        { min: 1950000, max: 3299999, rate: 0.10 },
        { min: 3300000, max: 6949999, rate: 0.20 },
        { min: 6950000, max: 8999999, rate: 0.23 },
        { min: 9000000, max: 17999999, rate: 0.33 },
        { min: 18000000, max: 39999999, rate: 0.40 },
        { min: 40000000, max: Infinity, rate: 0.45 },
      ],
      resident: 0.10, // Local tax
      social: 0.1515, // Combined social insurance
    },
    workingHours: {
      standard: 40,
      overtime: 1.25,
    },
    holidays: 16,
    vacationDays: 10,
  },
  CN: {
    name: 'China (Mainland)',
    currency: 'CNY',
    taxRates: {
      income: [
        { min: 0, max: 36000, rate: 0.03 },
        { min: 36001, max: 144000, rate: 0.10 },
        { min: 144001, max: 300000, rate: 0.20 },
        { min: 300001, max: 420000, rate: 0.25 },
        { min: 420001, max: 660000, rate: 0.30 },
        { min: 660001, max: 960000, rate: 0.35 },
        { min: 960001, max: Infinity, rate: 0.45 },
      ],
      social: 0.105, // Combined social security
      other: 0.08, // Housing fund
    },
    workingHours: {
      standard: 40,
      overtime: 1.5,
      overtimeRestDay: 2.0,
      overtimeHoliday: 3.0,
    },
    holidays: 7,
    vacationDays: 5,
  },
  IN: {
    name: 'India',
    currency: 'INR',
    taxRates: {
      income: [
        { min: 0, max: 300000, rate: 0 },
        { min: 300001, max: 600000, rate: 0.05 },
        { min: 600001, max: 900000, rate: 0.10 },
        { min: 900001, max: 1200000, rate: 0.15 },
        { min: 1200001, max: 1500000, rate: 0.20 },
        { min: 1500001, max: Infinity, rate: 0.30 },
      ],
      cess: 0.04, // Health and education cess
      pf: 0.12, // EPF
    },
    workingHours: {
      standard: 48,
      overtime: 2.0,
    },
    holidays: 10,
    vacationDays: 15,
  },
  SG: {
    name: 'Singapore',
    currency: 'SGD',
    taxRates: {
      income: [
        { min: 0, max: 20000, rate: 0 },
        { min: 20001, max: 30000, rate: 0.02 },
        { min: 30001, max: 40000, rate: 0.035 },
        { min: 40001, max: 80000, rate: 0.07 },
        { min: 80001, max: 120000, rate: 0.115 },
        { min: 120001, max: 160000, rate: 0.15 },
        { min: 160001, max: 200000, rate: 0.18 },
        { min: 200001, max: 240000, rate: 0.19 },
        { min: 240001, max: 280000, rate: 0.195 },
        { min: 280001, max: 320000, rate: 0.20 },
        { min: 320001, max: 500000, rate: 0.22 },
        { min: 500001, max: 1000000, rate: 0.23 },
        { min: 1000001, max: Infinity, rate: 0.24 },
      ],
      cpf: 0.20,
    },
    workingHours: {
      standard: 44,
      overtime: 1.5,
    },
    holidays: 11,
    vacationDays: 7,
  },
  KR: {
    name: 'South Korea',
    currency: 'KRW',
    taxRates: {
      income: [
        { min: 0, max: 14000000, rate: 0.06 },
        { min: 14000001, max: 50000000, rate: 0.15 },
        { min: 50000001, max: 88000000, rate: 0.24 },
        { min: 88000001, max: 150000000, rate: 0.35 },
        { min: 150000001, max: 300000000, rate: 0.38 },
        { min: 300000001, max: 500000000, rate: 0.40 },
        { min: 500000001, max: 1000000000, rate: 0.42 },
        { min: 1000000001, max: Infinity, rate: 0.45 },
      ],
      resident: 0.10, // Local income tax
      social: 0.089, // Combined social security
    },
    workingHours: {
      standard: 40,
      overtime: 1.5,
    },
    holidays: 11,
    vacationDays: 15,
  },
  HK: {
    name: 'Hong Kong',
    currency: 'HKD',
    taxRates: {
      income: [
        { min: 0, max: 50000, rate: 0.02 },
        { min: 50001, max: 100000, rate: 0.06 },
        { min: 100001, max: 150000, rate: 0.10 },
        { min: 150001, max: 200000, rate: 0.14 },
        { min: 200001, max: Infinity, rate: 0.17 },
      ],
      social: 0.05, // MPF
    },
    workingHours: {
      standard: 44,
      overtime: 1.0,
    },
    holidays: 17,
    vacationDays: 7,
  },
  AE: {
    name: 'United Arab Emirates',
    currency: 'AED',
    taxRates: {
      income: [{ min: 0, max: Infinity, rate: 0 }],
      social: 0.05, // For nationals only
    },
    workingHours: {
      standard: 48,
      overtime: 1.25,
    },
    holidays: 10,
    vacationDays: 30,
  },
  SA: {
    name: 'Saudi Arabia',
    currency: 'SAR',
    taxRates: {
      income: [{ min: 0, max: Infinity, rate: 0 }],
      social: 0.0975, // GOSI combined
    },
    workingHours: {
      standard: 48,
      overtime: 1.5,
    },
    holidays: 10,
    vacationDays: 21,
  },
  TR: {
    name: 'Turkey',
    currency: 'TRY',
    taxRates: {
      income: [
        { min: 0, max: 110000, rate: 0.15 },
        { min: 110001, max: 230000, rate: 0.20 },
        { min: 230001, max: 870000, rate: 0.27 },
        { min: 870001, max: 3000000, rate: 0.35 },
        { min: 3000001, max: Infinity, rate: 0.40 },
      ],
      social: 0.15, // Combined SGK
      other: 0.00759, // Stamp duty
    },
    workingHours: {
      standard: 45,
      overtime: 1.5,
    },
    holidays: 15,
    vacationDays: 14,
  },
  BR: {
    name: 'Brazil',
    currency: 'BRL',
    taxRates: {
      income: [
        { min: 0, max: 25344, rate: 0 },
        { min: 25344.01, max: 33919.80, rate: 0.075 },
        { min: 33919.81, max: 45012.60, rate: 0.15 },
        { min: 45012.61, max: 55976.16, rate: 0.225 },
        { min: 55976.17, max: Infinity, rate: 0.275 },
      ],
      inss: 0.075,
      fgts: 0.08,
    },
    workingHours: {
      standard: 44,
      overtime: 1.5,
    },
    holidays: 9,
    vacationDays: 30,
  },
  AR: {
    name: 'Argentina',
    currency: 'ARS',
    taxRates: {
      income: [
        { min: 0, max: 2340000, rate: 0 },
        { min: 2340001, max: 4680000, rate: 0.05 },
        { min: 4680001, max: 100000000, rate: 0.15 },
        { min: 100000001, max: Infinity, rate: 0.35 },
      ],
      social: 0.17, // Combined social security
    },
    workingHours: {
      standard: 48,
      overtime: 1.5,
    },
    holidays: 16,
    vacationDays: 14,
  },
  CL: {
    name: 'Chile',
    currency: 'CLP',
    taxRates: {
      income: [
        { min: 0, max: 10200000, rate: 0 },
        { min: 10200001, max: 22800000, rate: 0.04 },
        { min: 22800001, max: 38000000, rate: 0.08 },
        { min: 38000001, max: 53000000, rate: 0.135 },
        { min: 53000001, max: 76000000, rate: 0.23 },
        { min: 76000001, max: 182000000, rate: 0.304 },
        { min: 182000001, max: Infinity, rate: 0.40 },
      ],
      social: 0.176, // Combined social security
    },
    workingHours: {
      standard: 40,
      overtime: 1.5,
    },
    holidays: 16,
    vacationDays: 15,
  },
  CO: {
    name: 'Colombia',
    currency: 'COP',
    taxRates: {
      income: [
        { min: 0, max: 41420000, rate: 0 },
        { min: 41420001, max: 64800000, rate: 0.19 },
        { min: 64800001, max: 153000000, rate: 0.28 },
        { min: 153000001, max: 290000000, rate: 0.33 },
        { min: 290000001, max: 480000000, rate: 0.35 },
        { min: 480000001, max: Infinity, rate: 0.39 },
      ],
      social: 0.09, // Combined social security
    },
    workingHours: {
      standard: 42,
      overtime: 1.25,
    },
    holidays: 18,
    vacationDays: 15,
  },
  PE: {
    name: 'Peru',
    currency: 'PEN',
    taxRates: {
      income: [
        { min: 0, max: 25750, rate: 0.08 },
        { min: 25751, max: 103000, rate: 0.14 },
        { min: 103001, max: 180250, rate: 0.17 },
        { min: 180251, max: 231750, rate: 0.20 },
        { min: 231751, max: Infinity, rate: 0.30 },
      ],
      social: 0.13, // ONP
    },
    workingHours: {
      standard: 48,
      overtime: 1.25,
    },
    holidays: 14,
    vacationDays: 30,
  },
  ZA: {
    name: 'South Africa',
    currency: 'ZAR',
    taxRates: {
      income: [
        { min: 0, max: 237100, rate: 0.18 },
        { min: 237101, max: 370500, rate: 0.26 },
        { min: 370501, max: 512800, rate: 0.31 },
        { min: 512801, max: 673000, rate: 0.36 },
        { min: 673001, max: 857900, rate: 0.39 },
        { min: 857901, max: 1817000, rate: 0.41 },
        { min: 1817001, max: Infinity, rate: 0.45 },
      ],
      social: 0.01, // UIF
    },
    workingHours: {
      standard: 45,
      overtime: 1.5,
    },
    holidays: 12,
    vacationDays: 15,
  },
  NG: {
    name: 'Nigeria',
    currency: 'NGN',
    taxRates: {
      income: [
        { min: 0, max: 300000, rate: 0.07 },
        { min: 300001, max: 600000, rate: 0.11 },
        { min: 600001, max: 1100000, rate: 0.15 },
        { min: 1100001, max: 1600000, rate: 0.19 },
        { min: 1600001, max: 3200000, rate: 0.21 },
        { min: 3200001, max: Infinity, rate: 0.24 },
      ],
      social: 0.105, // PRA + NHF
    },
    workingHours: {
      standard: 40,
      overtime: 1.0,
    },
    holidays: 11,
    vacationDays: 6,
  },
  EG: {
    name: 'Egypt',
    currency: 'EGP',
    taxRates: {
      income: [
        { min: 0, max: 30000, rate: 0 },
        { min: 30001, max: 45000, rate: 0.10 },
        { min: 45001, max: 60000, rate: 0.15 },
        { min: 60001, max: 200000, rate: 0.20 },
        { min: 200001, max: 400000, rate: 0.225 },
        { min: 400001, max: Infinity, rate: 0.25 },
      ],
      social: 0.11,
    },
    workingHours: {
      standard: 48,
      overtime: 1.35,
    },
    holidays: 13,
    vacationDays: 21,
  },
  KE: {
    name: 'Kenya',
    currency: 'KES',
    taxRates: {
      income: [
        { min: 0, max: 288000, rate: 0.10 },
        { min: 288001, max: 388000, rate: 0.25 },
        { min: 388001, max: 6000000, rate: 0.30 },
        { min: 6000001, max: 9600000, rate: 0.325 },
        { min: 9600001, max: Infinity, rate: 0.35 },
      ],
      social: 0.075, // NSSF + Housing levy
      other: 500, // NHIF (monthly flat rate)
    },
    workingHours: {
      standard: 45,
      overtime: 1.5,
    },
    holidays: 13,
    vacationDays: 21,
  },
};