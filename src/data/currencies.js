export const currencies = {
  USD: { symbol: '$', name: 'US Dollar', locale: 'en-US', decimals: 2 },
  EUR: { symbol: '€', name: 'Euro', locale: 'de-DE', decimals: 2 }, // Common Euro locale, actual formatting varies
  GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB', decimals: 2 },
  JPY: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', decimals: 0 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA', decimals: 2 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', decimals: 2 },
  CHF: { symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH', decimals: 2 }, // Or fr-CH, it-CH
  CNY: { symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN', decimals: 2 },
  INR: { symbol: '₹', name: 'Indian Rupee', locale: 'en-IN', decimals: 2 },
  KRW: { symbol: '₩', name: 'South Korean Won', locale: 'ko-KR', decimals: 0 },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG', decimals: 2 },
  BRL: { symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR', decimals: 2 },
  MXN: { symbol: '$', name: 'Mexican Peso', locale: 'es-MX', decimals: 2 }, // Symbol can be ambiguous
  NOK: { symbol: 'kr', name: 'Norwegian Krone', locale: 'nb-NO', decimals: 2 },
  SEK: { symbol: 'kr', name: 'Swedish Krona', locale: 'sv-SE', decimals: 2 },
  DKK: { symbol: 'kr', name: 'Danish Krone', locale: 'da-DK', decimals: 2 },
  PLN: { symbol: 'zł', name: 'Polish Zloty', locale: 'pl-PL', decimals: 2 },
  CZK: { symbol: 'Kč', name: 'Czech Koruna', locale: 'cs-CZ', decimals: 2 },
  HUF: { symbol: 'Ft', name: 'Hungarian Forint', locale: 'hu-HU', decimals: 0 },
  RUB: { symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU', decimals: 2 },
  ZAR: { symbol: 'R', name: 'South African Rand', locale: 'en-ZA', decimals: 2 },
  TRY: { symbol: '₺', name: 'Turkish Lira', locale: 'tr-TR', decimals: 2 },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ', decimals: 2 },
  THB: { symbol: '฿', name: 'Thai Baht', locale: 'th-TH', decimals: 2 },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', locale: 'ms-MY', decimals: 2 },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', locale: 'id-ID', decimals: 0 },
  PHP: { symbol: '₱', name: 'Philippine Peso', locale: 'en-PH', decimals: 2 },
  VND: { symbol: '₫', name: 'Vietnamese Dong', locale: 'vi-VN', decimals: 0 },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE', decimals: 2 },
  SAR: { symbol: '﷼', name: 'Saudi Riyal', locale: 'ar-SA', decimals: 2 },
  ILS: { symbol: '₪', name: 'Israeli Shekel', locale: 'he-IL', decimals: 2 },
  EGP: { symbol: 'E£', name: 'Egyptian Pound', locale: 'ar-EG', decimals: 2 }, // Updated symbol for clarity
  QAR: { symbol: '﷼', name: 'Qatari Riyal', locale: 'ar-QA', decimals: 2 },
  KWD: { symbol: 'د.ك', name: 'Kuwaiti Dinar', locale: 'ar-KW', decimals: 3 },
  BHD: { symbol: '.د.ب', name: 'Bahraini Dinar', locale: 'ar-BH', decimals: 3 },
  OMR: { symbol: '﷼', name: 'Omani Rial', locale: 'ar-OM', decimals: 3 },
  JOD: { symbol: 'د.ا', name: 'Jordanian Dinar', locale: 'ar-JO', decimals: 3 },
  LBP: { symbol: 'ل.ل', name: 'Lebanese Pound', locale: 'ar-LB', decimals: 2 }, // Updated symbol for clarity
  PKR: { symbol: '₨', name: 'Pakistani Rupee', locale: 'ur-PK', decimals: 2 },
  LKR: { symbol: 'රු', name: 'Sri Lankan Rupee', locale: 'si-LK', decimals: 2 }, // Updated symbol
  BDT: { symbol: '৳', name: 'Bangladeshi Taka', locale: 'bn-BD', decimals: 2 },
  NPR: { symbol: 'रू', name: 'Nepalese Rupee', locale: 'ne-NP', decimals: 2 }, // Updated symbol
  AFN: { symbol: '؋', name: 'Afghan Afghani', locale: 'fa-AF', decimals: 2 },
  MMK: { symbol: 'K', name: 'Myanmar Kyat', locale: 'my-MM', decimals: 2 },
  KHR: { symbol: '៛', name: 'Cambodian Riel', locale: 'km-KH', decimals: 2 },
  LAK: { symbol: '₭', name: 'Lao Kip', locale: 'lo-LA', decimals: 2 },
  BND: { symbol: 'B$', name: 'Brunei Dollar', locale: 'ms-BN', decimals: 2 },
  TWD: { symbol: 'NT$', name: 'New Taiwan Dollar', locale: 'zh-TW', decimals: 2 }, // Updated name
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'zh-HK', decimals: 2 },
  MOP: { symbol: 'MOP$', name: 'Macanese Pataca', locale: 'zh-MO', decimals: 2 },

  // Newly added based on countries.js
  ARS: { symbol: '$', name: 'Argentine Peso', locale: 'es-AR', decimals: 2 }, // Symbol can be ARS$
  CLP: { symbol: '$', name: 'Chilean Peso', locale: 'es-CL', decimals: 0 },   // Symbol can be CLP$
  COP: { symbol: '$', name: 'Colombian Peso', locale: 'es-CO', decimals: 2 }, // Symbol can be COP$
  PEN: { symbol: 'S/', name: 'Peruvian Sol', locale: 'es-PE', decimals: 2 },
  NGN: { symbol: '₦', name: 'Nigerian Naira', locale: 'en-NG', decimals: 2 },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling', locale: 'en-KE', decimals: 2 },
};