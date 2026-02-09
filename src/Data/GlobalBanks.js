export const globalBanks = [
  // --- UNITED STATES ---
  { isHeader: true, title: "United States (ACH/Routing)" },
  { 
    id: 'chase_us', 
    name: 'Chase Bank', 
    region: 'USA', 
    currency: 'USD',
    flag: '🇺🇸', // Added Flag property for UX
    fields: [
      { name: 'routingNumber', label: 'ACH Routing Number', placeholder: '9 digits', regex: /^\d{9}$/, error: 'Routing number must be 9 digits' },
      { name: 'accountNumber', label: 'Account Number', placeholder: '8-12 digits', regex: /^\d{8,12}$/, error: 'Invalid account number' }
    ],
    logoColor: '#117ACA', 
    logoInitial: 'C'
  },
  { 
    id: 'boa_us', 
    name: 'Bank of America', 
    region: 'USA', 
    currency: 'USD',
    flag: '🇺🇸',
    fields: [
      { name: 'routingNumber', label: 'ACH Routing Number', placeholder: '9 digits', regex: /^\d{9}$/, error: 'Routing number must be 9 digits' },
      { name: 'accountNumber', label: 'Account Number', placeholder: '8-12 digits', regex: /^\d{8,12}$/, error: 'Invalid account number' }
    ],
    logoColor: '#E31837', 
    logoInitial: 'B'
  },
  { 
    id: 'wf_us', 
    name: 'Wells Fargo', 
    region: 'USA', 
    currency: 'USD',
    flag: '🇺🇸',
    fields: [
      { name: 'routingNumber', label: 'ACH Routing Number', placeholder: '9 digits', regex: /^\d{9}$/, error: 'Routing number must be 9 digits' },
      { name: 'accountNumber', label: 'Account Number', placeholder: '10 digits', regex: /^\d{10}$/, error: 'Invalid account number' }
    ],
    logoColor: '#CD1409', 
    logoInitial: 'W'
  },

  // --- UNITED KINGDOM ---
  { isHeader: true, title: "United Kingdom (Sort Code)" },
  { 
    id: 'hsbc_uk', 
    name: 'HSBC UK', 
    region: 'UK', 
    currency: 'GBP',
    flag: '🇬🇧',
    fields: [
      { name: 'sortCode', label: 'Sort Code', placeholder: '00-00-00', regex: /^\d{2}-?\d{2}-?\d{2}$/, error: 'Sort code must be 6 digits' },
      { name: 'accountNumber', label: 'Account Number', placeholder: '8 digits', regex: /^\d{8}$/, error: 'Account number must be 8 digits' }
    ],
    logoColor: '#DB0011', 
    logoInitial: 'H'
  },
  { 
    id: 'barclays_uk', 
    name: 'Barclays', 
    region: 'UK', 
    currency: 'GBP',
    flag: '🇬🇧',
    fields: [
      { name: 'sortCode', label: 'Sort Code', placeholder: '00-00-00', regex: /^\d{2}-?\d{2}-?\d{2}$/, error: 'Invalid sort code' },
      { name: 'accountNumber', label: 'Account Number', placeholder: '8 digits', regex: /^\d{8}$/, error: 'Invalid account number' }
    ],
    logoColor: '#00AEEF', 
    logoInitial: 'B'
  },
  { 
    id: 'lloyds_uk', 
    name: 'Lloyds Bank', 
    region: 'UK', 
    currency: 'GBP',
    flag: '🇬🇧',
    fields: [
      { name: 'sortCode', label: 'Sort Code', placeholder: '00-00-00', regex: /^\d{2}-?\d{2}-?\d{2}$/, error: 'Invalid sort code' },
      { name: 'accountNumber', label: 'Account Number', placeholder: '8 digits', regex: /^\d{8}$/, error: 'Invalid account number' }
    ],
    logoColor: '#006A4D', 
    logoInitial: 'L'
  },

  // --- EUROPE (SEPA) ---
  { isHeader: true, title: "Europe (SEPA/IBAN)" },
  { 
    id: 'revolut_eu', 
    name: 'Revolut', 
    region: 'EU', 
    currency: 'EUR',
    flag: '🇪🇺',
    fields: [
      { name: 'iban', label: 'IBAN', placeholder: 'LT00 0000 0000...', regex: /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/, error: 'Invalid IBAN format' }
    ],
    logoColor: '#000000', 
    logoInitial: 'R'
  },
  { 
    id: 'wise_eu', 
    name: 'Wise', 
    region: 'EU', 
    currency: 'EUR',
    flag: '🇪🇺',
    fields: [
      { name: 'iban', label: 'IBAN', placeholder: 'BE00 0000 0000...', regex: /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/, error: 'Invalid IBAN format' }
    ],
    logoColor: '#9FE870', 
    logoInitial: 'W'
  },
  { 
    id: 'n26_eu', 
    name: 'N26', 
    region: 'EU', 
    currency: 'EUR',
    flag: '🇩🇪',
    fields: [
      { name: 'iban', label: 'IBAN', placeholder: 'DE00 0000 0000...', regex: /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/, error: 'Invalid IBAN format' }
    ],
    logoColor: '#36A18B', 
    logoInitial: 'N'
  },

  // --- ASIA ---
  { isHeader: true, title: "Asia (Swift/Local)" },
  { 
    id: 'dbs_sg', 
    name: 'DBS Singapore', 
    region: 'SG', 
    currency: 'SGD',
    flag: '🇸🇬',
    fields: [
      { name: 'swiftCode', label: 'SWIFT / BIC', placeholder: 'DBSSSGSG', regex: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, error: 'Invalid SWIFT code' },
      { name: 'accountNumber', label: 'Account Number', placeholder: '10 digits', regex: /^\d{7,14}$/, error: 'Invalid account length' }
    ],
    logoColor: '#FF3300', 
    logoInitial: 'D'
  },
  { 
    id: 'mufg_jp', 
    name: 'MUFG Bank', 
    region: 'JP', 
    currency: 'JPY',
    flag: '🇯🇵',
    fields: [
      { name: 'swiftCode', label: 'SWIFT / BIC', placeholder: 'BOTKJPJT', regex: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, error: 'Invalid SWIFT code' },
      { name: 'accountNumber', label: 'Account Number', placeholder: '7 digits', regex: /^\d{7}$/, error: 'Invalid account length' }
    ],
    logoColor: '#D3122E', 
    logoInitial: 'M'
  },
  { isHeader: true, title: "Canada (Transit/Inst)" },
  { 
    id: 'rbc_ca', 
    name: 'Royal Bank of Canada', 
    region: 'CA', 
    currency: 'CAD',
    flag: '🇨🇦',
    fields: [
      { name: 'transitNumber', label: 'Transit Number', placeholder: '5 digits', regex: /^\d{5}$/, error: '5 digits required' },
      { name: 'accountNumber', label: 'Account Number', placeholder: '7-12 digits', regex: /^\d{7,12}$/, error: 'Invalid account number' }
    ],
    logoColor: '#FFC425', 
    logoInitial: 'R'
  },
  { 
    id: 'td_ca', 
    name: 'TD Canada Trust', 
    region: 'CA', 
    currency: 'CAD',
    flag: '🇨🇦',
    fields: [
      { name: 'transitNumber', label: 'Transit Number', placeholder: '5 digits', regex: /^\d{5}$/, error: '5 digits required' },
      { name: 'accountNumber', label: 'Account Number', placeholder: '7-12 digits', regex: /^\d{7,12}$/, error: 'Invalid account number' }
    ],
    logoColor: '#008A00', 
    logoInitial: 'T'
  },

  // --- AUSTRALIA (BSB) ---
  { isHeader: true, title: "Australia (BSB)" },
  { 
    id: 'commbank_au', 
    name: 'Commonwealth Bank', 
    region: 'AU', 
    currency: 'AUD',
    flag: '🇦🇺',
    fields: [
      { name: 'bsb', label: 'BSB Code', placeholder: '000-000', regex: /^\d{3}-?\d{3}$/, error: 'BSB must be 6 digits' },
      { name: 'accountNumber', label: 'Account Number', placeholder: '8-9 digits', regex: /^\d{8,9}$/, error: 'Invalid account number' }
    ],
    logoColor: '#FFCC00', 
    logoInitial: 'C'
  },
  { 
    id: 'anz_au', 
    name: 'ANZ', 
    region: 'AU', 
    currency: 'AUD',
    flag: '🇦🇺',
    fields: [
      { name: 'bsb', label: 'BSB Code', placeholder: '000-000', regex: /^\d{3}-?\d{3}$/, error: 'BSB must be 6 digits' },
      { name: 'accountNumber', label: 'Account Number', placeholder: '8-9 digits', regex: /^\d{8,9}$/, error: 'Invalid account number' }
    ],
    logoColor: '#004165', 
    logoInitial: 'A'
  },

  // --- SWITZERLAND (IBAN) ---
  { isHeader: true, title: "Switzerland (CH-IBAN)" },
  { 
    id: 'ubs_ch', 
    name: 'UBS', 
    region: 'CH', 
    currency: 'CHF',
    flag: '🇨🇭',
    fields: [
      { name: 'iban', label: 'IBAN', placeholder: 'CH00 0000...', regex: /^CH\d{19}$/, error: 'Invalid Swiss IBAN' }
    ],
    logoColor: '#1E1E1E', 
    logoInitial: 'U'
  },

  // --- CHINA / HONG KONG ---
  { isHeader: true, title: "China & Hong Kong" },
  { 
    id: 'boc_cn', 
    name: 'Bank of China', 
    region: 'CN', 
    currency: 'CNY',
    flag: '🇨🇳',
    fields: [
      { name: 'accountNumber', label: 'Card/Account No.', placeholder: '16-19 digits', regex: /^\d{16,19}$/, error: 'Invalid card number' }
    ],
    logoColor: '#B40028', 
    logoInitial: 'B'
  },
  { 
    id: 'hsbc_hk', 
    name: 'HSBC Hong Kong', 
    region: 'HK', 
    currency: 'HKD',
    flag: '🇭🇰',
    fields: [
      { name: 'bankCode', label: 'Bank Code', placeholder: '3 digits', regex: /^\d{3}$/, error: '3 digits required' },
      { name: 'accountNumber', label: 'Account Number', placeholder: '9-12 digits', regex: /^\d{9,12}$/, error: 'Invalid account number' }
    ],
    logoColor: '#DB0011', 
    logoInitial: 'H'
  }
];