async function fetchActualRate() {
    try {
        const response = await fetch(`https://apiv2.nobitex.ir/v3/orderbook/USDTIRT`);
        if (!response.ok) throw new Error(`API error ${response.status}`);
        
        const data = await response.json();
        return parseFloat(data.lastTradePrice) / 10;
    } catch(e) {
        console.error(e);
        return null;
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchRate') {
        const cacheKey = `exchange_rate_USD`;
        const CACHE_DURATION = 10 * 60 * 1000;
        
        chrome.storage.local.get([cacheKey, `${cacheKey}_timestamp`]).then(async (result) => {
            const now = Date.now();
            
            // Return cached rate if valid
            if (result[cacheKey] && result[`${cacheKey}_timestamp`] && (now - result[`${cacheKey}_timestamp`] < CACHE_DURATION)) {
                sendResponse({rate: result[cacheKey]});
                return;
            }
            
            // If cache miss, fetch new rate
            const rate = await fetchActualRate();
            if (rate) {
                await chrome.storage.local.set({ [cacheKey]: rate, [`${cacheKey}_timestamp`]: now });
                sendResponse({rate});
            } else {
                // Return cache even if expired if fetch fails
                sendResponse({rate: result[cacheKey] || 820000});
            }
        });
        
        // Return true to indicate we will sendResponse asynchronously
        return true; 
    }
});