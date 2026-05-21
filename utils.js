// Function to convert Persian and Arabic digits to English
function convertPersianDigits(str) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  
  if (typeof str === 'string') {
    for (let i = 0; i < 10; i++) {
        str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
  }
  return str;
}

// Function to extract numeric price from Digikala price string
function extractNumericPrice(priceStr) {
  if (!priceStr) return null;
  const englishDigitsStr = convertPersianDigits(priceStr);
  const numericOnly = englishDigitsStr.replace(/[^0-9]/g, '');
  if (!numericOnly) return null;
  return parseInt(numericOnly, 10);
}

// Format number to USD / EUR
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Fetch exchange rate with caching via background script to avoid CSP issues
function fetchDollarRate(targetCurrency = 'USD') {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'fetchRate', currency: targetCurrency }, (response) => {
      resolve(response && response.rate ? response.rate : 820000);
    });
  });
}
