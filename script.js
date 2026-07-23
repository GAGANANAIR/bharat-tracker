// ---------------------------------------------------------------------
// Tab switching
// ---------------------------------------------------------------------
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = {
  schemes: document.getElementById('tab-schemes'),
  prices: document.getElementById('tab-prices'),
  train: document.getElementById('tab-train')
};
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    Object.values(panels).forEach(p => p.classList.add('hidden'));
    panels[btn.dataset.tab].classList.remove('hidden');
  });
});

// ---------------------------------------------------------------------
// Government Schemes: search + category filter over the static SCHEMES list
// ---------------------------------------------------------------------
const schemeSearch = document.getElementById('schemeSearch');
const schemeCategory = document.getElementById('schemeCategory');
const schemeResults = document.getElementById('schemeResults');

// Populate category dropdown from the data itself
const categories = [...new Set(SCHEMES.map(s => s.category))].sort();
categories.forEach(cat => {
  const opt = document.createElement('option');
  opt.value = cat;
  opt.textContent = cat;
  schemeCategory.appendChild(opt);
});

function renderSchemes(){
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
  if (filtered.length === 0){
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
      <a href="${s.link}" target="_blank">Official page →</a>
    `;
    schemeResults.appendChild(card);
  });
}
schemeSearch.addEventListener('input', renderSchemes);
schemeCategory.addEventListener('change', renderSchemes);
renderSchemes();

// ---------------------------------------------------------------------
// Live Prices: gold-api.com (free, no key) for XAU/XAG spot price in USD,
// converted to INR via open.er-api.com (free, no key) exchange rate.
// Troy ounce -> grams: 1 oz = 31.1035 g
// ---------------------------------------------------------------------
const OZ_TO_G = 31.1035;

async function fetchLivePrices(){
  try {
    const [goldRes, silverRes, fxRes] = await Promise.all([
      fetch('https://api.gold-api.com/price/XAU'),
      fetch('https://api.gold-api.com/price/XAG'),
      fetch('https://open.er-api.com/v6/latest/USD')
    ]);
    const gold = await goldRes.json();   // { price: <USD per oz> }
    const silver = await silverRes.json();
    const fx = await fxRes.json();       // { rates: { INR: ... } }

    const usdToInr = fx.rates.INR;
    const goldPerGramUsd = gold.price / OZ_TO_G;
    const silverPerGramUsd = silver.price / OZ_TO_G;

    const gold10gInr = goldPerGramUsd * 10 * usdToInr;
    const silverKgInr = silverPerGramUsd * 1000 * usdToInr;

    document.getElementById('goldCard').classList.remove('loading');
    document.getElementById('goldValue').textContent = '₹' + gold10gInr.toLocaleString('en-IN', {maximumFractionDigits:0});
    document.getElementById('goldSub').textContent = `24K spot · $${gold.price.toFixed(2)}/oz · ₹${usdToInr.toFixed(2)}/USD`;

    document.getElementById('silverCard').classList.remove('loading');
    document.getElementById('silverValue').textContent = '₹' + silverKgInr.toLocaleString('en-IN', {maximumFractionDigits:0});
    document.getElementById('silverSub').textContent = `Spot · $${silver.price.toFixed(2)}/oz`;
  } catch (err){
    document.getElementById('goldValue').textContent = 'Unavailable';
    document.getElementById('silverValue').textContent = 'Unavailable';
    document.getElementById('goldSub').textContent = 'Could not reach price API';
    document.getElementById('silverSub').textContent = 'Could not reach price API';
  }
}
fetchLivePrices();
setInterval(fetchLivePrices, 60000); // refresh every minute

// ---------------------------------------------------------------------
// Fuel prices: no free keyless public API exists, so this is a
// bring-your-own-key integration point (data.gov.in).
// ---------------------------------------------------------------------
const fuelApiKeyInput = document.getElementById('fuelApiKey');
const fuelResult = document.getElementById('fuelResult');

// Restore a previously saved key, if any
try {
  const saved = localStorage.getItem('bharatTracker_fuelApiKey');
  if (saved) fuelApiKeyInput.value = saved;
} catch (e) { /* localStorage unavailable, ignore */ }

document.getElementById('fuelKeySave').addEventListener('click', () => {
  const fuelKey = fuelApiKeyInput.value.trim();
  if (!fuelKey){
    fuelResult.textContent = 'No key entered — fuel price lookup needs a data.gov.in API key.';
    return;
  }
  try { localStorage.setItem('bharatTracker_fuelApiKey', fuelKey); } catch (e) { /* ignore */ }
  fuelResult.textContent = 'Key saved in this browser. (Wire up the specific data.gov.in resource ID for your state/city to complete this integration — the free key alone doesn\'t pick the endpoint for you.)';
});

// ---------------------------------------------------------------------
// Train status: no reliable free keyless API, so we deep-link to the
// official government tools with the number pre-filled where possible.
// ---------------------------------------------------------------------
document.getElementById('pnrBtn').addEventListener('click', () => {
  const pnr = document.getElementById('pnrInput').value.trim();
  if (!/^\d{10}$/.test(pnr)){
    alert('Please enter a valid 10-digit PNR number.');
    return;
  }
  window.open('https://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html', '_blank');
});

document.getElementById('trainBtn').addEventListener('click', () => {
  const train = document.getElementById('trainInput').value.trim();
  if (!/^\d{4,5}$/.test(train)){
    alert('Please enter a valid train number (4-5 digits).');
    return;
  }
  window.open('https://enquiry.indianrail.gov.in/ntes/', '_blank');
});
