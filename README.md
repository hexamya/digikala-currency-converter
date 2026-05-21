# Digikala Currency Converter

A lightweight browser extension that automatically converts product prices on [Digikala](https://www.digikala.com) from Iranian Toman to US Dollars (USD). 

It dynamically fetches the real-time USD to IRR exchange rate and displays the converted USD price cleanly right below the original price on the website.

---

## ✨ Features
* **Real-Time Rates:** Fetches live, up-to-date USD exchange rates from the Nobitex API.
* **Seamless Integration:** USD prices blend naturally into Digikala's layout without breaking the page structure.
* **Fast & Efficient:** Caches exchange rates locally for 10 minutes to minimize API requests and maximize loading speed.
* **Dynamic Loading:** Uses `MutationObserver` to flawlessly handle Digikala's SPA (Single Page Application) navigation and lazy-loaded items securely.
* **Dark Mode Compatible:** Fully respects system or Digikala dark mode color schemes.

---

## 🛠️ How to Install (Free Manual Installation)

Because this extension is not published to the Web Stores (to bypass publisher fees), you can easily install it locally in less than a minute.

### For Google Chrome, Brave, or Chromium Browsers:
1. Download this repository by clicking the green **Code** button and selecting **Download ZIP**.
2. Extract out the downloaded ZIP file to a folder on your computer.
3. Open your browser and go to `chrome://extensions/` in the URL bar.
4. Turn on **Developer mode** using the toggle switch in the top right corner.
5. Click the **Load unpacked** button in the top left.
6. Select the extracted folder containing the `manifest.json` file.
7. Done! Open Digikala and enjoy.

### For Microsoft Edge:
1. Download this repository by clicking the green **Code** button and selecting **Download ZIP**.
2. Extract out the downloaded ZIP file to a folder on your computer.
3. Open Edge and go to `edge://extensions/` in the URL bar.
4. Turn on the **Developer mode** switch at the bottom left of the sidebar.
5. Click the **Load unpacked** button near the top right.
6. Select the extracted folder containing the `manifest.json` file.
7. Done!

---

## ⚙️ How it Works
The extension relies on Manifest V3. 
To bypass Digikala's strict Content Security Policy (CSP), API calls are handled safely by a background Service Worker (`background.js`). `content.js` strictly reads price tags using Digikala's `data-testid` DOM properties, dividing Toman values by the live rate dynamically.

* **Target API:** `https://apiv2.nobitex.ir/v3/orderbook/USDTIRT`

---

## 📝 Privacy
This extension requires local storage permission purely to cache API responses and limit heavy network requests. It tracks absolutely no user data, has no analytics, and does not monitor browsing outside of Digikala pages.

---

Feel free to fork, modify, or submit Pull Requests if you'd like to improve the tool!