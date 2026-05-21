document.addEventListener('DOMContentLoaded', async () => {
  const select = document.getElementById('currency-select');
  
  // Load current preference
  const result = await chrome.storage.local.get(['preferredCurrency']);
  if (result.preferredCurrency) {
    select.value = result.preferredCurrency;
  }

  // Listen for changes
  select.addEventListener('change', async (e) => {
    const newCurrency = e.target.value;
    await chrome.storage.local.set({ preferredCurrency: newCurrency });
    
    // Notify content scripts
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateCurrency',
          currency: newCurrency
        });
      }
    });
  });
});
