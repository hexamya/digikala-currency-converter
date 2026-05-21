// Cache for the current rate
let currentRate = 820000;
let currentCurrency = 'USD';

// Initialize the extension
async function init() {
  // Get preferred currency from storage
  const result = await chrome.storage.local.get(['preferredCurrency']);
  currentCurrency = result.preferredCurrency || 'USD';
  
  // Fetch initial rate
  currentRate = await fetchDollarRate(currentCurrency);
  
  // Convert existing prices on the page
  convertPrices();

  // Setup MutationObserver for dynamic content
  setupObserver();
}

function setupObserver() {
  let timeout = null;
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldUpdate = true;
        break;
      }
    }
    
    if (shouldUpdate) {
      // Debounce updates slightly to prevent infinite loops and performance issues
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        convertPrices();
      }, 300);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Convert prices
function convertPrices() {
  // Find price elements targeted by Digikala's data-testid attributes
  const priceNodes = document.querySelectorAll('[data-testid="price-final"], [data-testid="price-no-discount"]');

  priceNodes.forEach(el => {
    try {
      // Find the closest suitable container and ensure we haven't processed it
      if (el.dataset.currencyConverted === 'true' || el.querySelector('.dk-currency-converted')) {
          return;
      }

      // Mark as processed
      el.dataset.currencyConverted = 'true';

      const priceText = el.textContent;
      const numericPrice = extractNumericPrice(priceText);
      
      if (numericPrice) {
          // Digikala displays prices in Toman
          let convertedPrice = numericPrice / currentRate;
          
          const formattedPrice = formatCurrency(convertedPrice, currentCurrency);
          
          const convertedEl = document.createElement('div');
          convertedEl.className = 'dk-currency-converted';
          
          // If this is the original undiscounted (crossed-out) price, add a specific class
          if (el.getAttribute('data-testid') === 'price-no-discount') {
              convertedEl.classList.add('dk-currency-no-discount');
          }
          
          convertedEl.textContent = "~ " + formattedPrice;
          
          // Fix styling so it doesn't break their layout
          el.style.display = 'flex';
          el.style.flexDirection = 'column';
          el.style.alignItems = 'flex-end';
          
          el.appendChild(convertedEl);
      }
    } catch(err) {
      console.error('Digikala Currency Extension error:', err);
    }
  });
}

// Run init
init();

// Listen for messages from popup to update preferences
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateCurrency') {
    currentCurrency = request.currency;
    fetchDollarRate(currentCurrency).then(rate => {
      currentRate = rate;
      // Re-convert all prices
      document.querySelectorAll('.dk-currency-converted').forEach(el => el.remove());
      document.querySelectorAll('[data-currency-converted]').forEach(el => {
          el.dataset.currencyConverted = 'false';
      });
      convertPrices();
    });
  }
});
