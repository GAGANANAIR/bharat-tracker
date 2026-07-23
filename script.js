// === TAB SWITCHING ===
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = {
  schemes: document.getElementById('tab-schemes'),
  prices: document.getElementById('tab-prices'),
  train: document.getElementById('tab-train'),
  map: document.getElementById('tab-map')
};
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = panels[btn.dataset.tab];
    if (!target) {
      console.warn(`No panel found for tab "${btn.dataset.tab}" — check data-tab matches an id in panels{}`);
      return;
    }
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    Object.values(panels).forEach(p => p.classList.add('hidden'));
    target.classList.remove('hidden');
  });
});

// === SCHEMES ===
const schemeSearch = document.getElementById('schemeSearch');
const schemeCategory = document.getElementById('schemeCategory');
const schemeResults = document.getElementById('schemeResults');
const trainResult = document.getElementById('trainResult');

const categories = [...new Set(SCHEMES.map(s => s.category))].sort();
categories.forEach(cat => {
  const opt = document.createElement('option');
  opt.value = cat;
  opt.textContent = cat;
  schemeCategory.appendChild(opt);
});

function renderSchemes() {
  const q = schemeSearch.value.trim().toLowerCase();
  const cat = schemeCategory.value;
  const filtered = SCHEMES.filter(s => {
    const matchesQ = !q || s.name.toLowerCase().includes(q) ||
      s.who.toLowerCase().includes(q) || s.benefit.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);
    const matchesCat = !cat || s.category === cat;
    return matchesQ && matchesCat;
  });
  schemeResults.innerHTML = '';
  if (filtered.length === 0) {
    schemeResults.innerHTML = '<p style="color:#888">No schemes match your search.</p>';
    return;
  }
  filtered.forEach(s => {
    const card = document.createElement('div');
    card.className = 'scheme-card';
    card.innerHTML = `
      <span class="cat">${s.category}</span>
      <h3>${s.name}</h3>
      <p><b>Who it's for:</b> ${s.who}</p>
      <p><b>Benefit:</b> ${s.benefit}</p>
      <p><b>How to apply:</b> ${s.how}</p>
      <a href="${s.link}" target="_blank" rel="noopener noreferrer">Official page →</a>
    `;
    schemeResults.appendChild(card);
  });
}
schemeSearch.addEventListener('input', renderSchemes);
schemeCategory.addEventListener('change', renderSchemes);
renderSchemes();

// === LIVE GOLD/SILVER PRICES ===
const OZ_TO_G = 31.1035;
const goldPriceEl = document.getElementById('goldPrice');
const silverPriceEl = document.getElementById('silverPrice');
const pricesStatusEl = document.getElementById('pricesStatus');

async function fetchLivePrices() {
  if (pricesStatusEl) pricesStatusEl.textContent = 'Updating prices…';
  try {
    const [goldRes, silverRes, fxRes] = await Promise.all([
      fetch('https://api.gold-api.com/price/XAU'),
      fetch('https://api.gold-api.com/price/XAG'),
      fetch('https://open.er-api.com/v6/latest/USD')
    ]);

    if (!goldRes.ok || !silverRes.ok || !fxRes.ok) {
      throw new Error('One or more price APIs returned a non-OK response');
    }

    const gold = await goldRes.json();
    const silver = await silverRes.json();
    const fx = await fxRes.json();

    const usdToInr = fx.rates && fx.rates.INR;
    if (!usdToInr) throw new Error('INR rate missing from FX response');

    const goldPerGramInr = (gold.price / OZ_TO_G) * usdToInr;
    const silverPerGramInr = (silver.price / OZ_TO_G) * usdToInr;

    if (goldPriceEl) goldPriceEl.textContent = `₹${goldPerGramInr.toFixed(2)} / g`;
    if (silverPriceEl) silverPriceEl.textContent = `₹${silverPerGramInr.toFixed(2)} / g`;
    if (pricesStatusEl) pricesStatusEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
  } catch (err) {
    console.error('fetchLivePrices failed:', err);
    if (pricesStatusEl) pricesStatusEl.textContent = 'Live prices unavailable right now — please retry shortly.';
  }
}
fetchLivePrices();
setInterval(fetchLivePrices, 60000);

// === FUEL PRICES ===
const fuelApiKeyInput = document.getElementById('fuelApiKey');
const fuelResult = document.getElementById('fuelResult');
const fuelBtn = document.getElementById('fuelBtn');

if (fuelBtn) {
  fuelBtn.addEventListener('click', async () => {
    const key = fuelApiKeyInput ? fuelApiKeyInput.value.trim() : '';
    if (!key) {
      fuelResult.innerHTML = '<p style="color:#d32f2f;">Please paste your free data.gov.in API key first.</p>';
      return;
    }
    fuelResult.innerHTML = '<p style="color:#0066cc;">Fetching fuel prices…</p>';
    try {
      const resourceId = 'REPLACE_WITH_DATA_GOV_IN_RESOURCE_ID';
      const response = await fetch(
        `https://api.data.gov.in/resource/${resourceId}?api-key=${encodeURIComponent(key)}&format=json&limit=10`
      );
      if (!response.ok) throw new Error(`API responded with ${response.status}`);
      const data = await response.json();
      if (!data.records || data.records.length === 0) throw new Error('No records returned');

      let html = '<h4>Fuel Prices</h4><ul>';
      data.records.forEach(r => {
        html += `<li>${r.state || r.district || 'Unknown'}: ${r.price || 'N/A'}</li>`;
      });
      html += '</ul>';
      fuelResult.innerHTML = html;
    } catch (err) {
      console.error('Fuel price fetch failed:', err);
      fuelResult.innerHTML = '<p style="color:#d32f2f;">Could not fetch fuel prices. Check your API key and try again.</p>';
    }
  });
}

// === TRAIN STATUS ===
function checkPNR(pnr) {
  trainResult.style.display = 'block';
  trainResult.innerHTML = `
    <p><strong>PNR ${pnr} is ready to check.</strong></p>
    <button id="openPnrBtn" style="padding:10px 20px; background:#0066cc; color:white; border:none; border-radius:6px; cursor:pointer;">
      Open Official PNR Page →
    </button>
  `;
  document.getElementById('openPnrBtn').addEventListener('click', () => {
    window.open(`https://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html?pnr=${encodeURIComponent(pnr)}`, '_blank', 'noopener,noreferrer');
  });
}

document.getElementById('pnrBtn').addEventListener('click', () => {
  const pnr = document.getElementById('pnrInput').value.trim();
  if (!/^\d{10}$/.test(pnr)) {
    alert('Please enter a valid 10-digit PNR number.');
    return;
  }
  checkPNR(pnr);
});

document.getElementById('trainBtn').addEventListener('click', () => {
  const train = document.getElementById('trainInput').value.trim();
  if (!/^\d{4,5}$/.test(train)) {
    alert('Please enter a valid train number.');
    return;
  }
  window.open(`https://enquiry.indianrail.gov.in/ntes/RunningTrain?trainNo=${encodeURIComponent(train)}`, '_blank', 'noopener,noreferrer');
});
