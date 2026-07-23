// ---------------------------------------------------------------------
// Tab switching
// ---------------------------------------------------------------------
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = {
  schemes: document.getElementById('tab-schemes'),
  prices: document.getElementById('tab-prices'),
  train: document.getElementById('tab-train'),
  map: document.getElementById('tab-map')
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

// ---------------------------------------------------------------------
// Nearby Map: Leaflet + OpenStreetMap tiles (free) + Overpass API (free,
// no key) for fuel stations, hospitals, and railway stations near the
// user's browser-reported location.
// ---------------------------------------------------------------------
let leafletMap = null;
let mapMarkers = [];
let userLat = 20.5937, userLon = 78.9629; // fallback: center of India
let currentMapType = 'fuel';
let mapInitialized = false;

const OVERPASS_QUERY = {
  fuel: 'node["amenity"="fuel"]',
  hospital: 'node["amenity"="hospital"]',
  railway: 'node["railway"="station"]'
};

function initMap(){
  if (mapInitialized) return;
  mapInitialized = true;
  leafletMap = L.map('mapContainer').setView([userLat, userLon], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(leafletMap);

  L.marker([userLat, userLon]).addTo(leafletMap).bindPopup('You are here (approx.)');
  loadNearby(currentMapType);
}

function haversineKm(lat1, lon1, lat2, lon2){
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

let isLoadingNearby = false;
let lastLoadTime = 0;
const MIN_REQUEST_GAP_MS = 4000; // avoid hammering Overpass's rate limit

async function loadNearby(type){
  if (isLoadingNearby){
    document.getElementById('mapStatus').textContent = 'Still loading the previous request — please wait a moment.';
    return;
  }
  const sinceLast = Date.now() - lastLoadTime;
  if (sinceLast < MIN_REQUEST_GAP_MS){
    const waitMs = MIN_REQUEST_GAP_MS - sinceLast;
    document.getElementById('mapStatus').textContent = `Please wait ${Math.ceil(waitMs/1000)}s before switching again — Overpass rate-limits rapid requests.`;
    setTimeout(() => loadNearby(type), waitMs + 100);
    return;
  }

  isLoadingNearby = true;
  lastLoadTime = Date.now();
  document.querySelectorAll('.map-filter-btn').forEach(b => b.disabled = true);
  document.getElementById('mapStatus').textContent = `Searching within 20km for ${type === 'fuel' ? 'fuel stations' : type === 'hospital' ? 'hospitals' : 'railway stations'}…`;
  mapMarkers.forEach(m => leafletMap.removeLayer(m));
  mapMarkers = [];

  try {
    const query = `[out:json][timeout:25];${OVERPASS_QUERY[type]}(around:20000,${userLat},${userLon});out body 300;`;
    const endpoints = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
      'https://overpass.openstreetmap.ru/api/interpreter'
    ];

    let data = null;
    let lastError = '';
    for (const url of endpoints){
      try {
        const res = await fetch(url, { method: 'POST', body: query });
        if (!res.ok){
          lastError = `${url} → HTTP ${res.status}`;
          continue;
        }
        data = await res.json();
        break; // success, stop trying further mirrors
      } catch (err){
        lastError = `${url} → ${err.message}`;
      }
    }

    if (!data){
      document.getElementById('mapStatus').textContent = `Could not reach any Overpass server. Last error: ${lastError}. This is usually temporary — try again in a moment.`;
      return;
    }

    if (!data.elements || data.elements.length === 0){
      document.getElementById('mapStatus').textContent = `No ${type} found within 20km of your location.`;
      return;
    }

    // Sort by actual distance from the user, closest first, and cap the
    // markers shown so the map stays readable.
    const withDist = data.elements
      .filter(el => el.lat !== undefined)
      .map(el => ({ el, dist: haversineKm(userLat, userLon, el.lat, el.lon) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 60);

    withDist.forEach(({ el, dist }) => {
      const name = (el.tags && el.tags.name) ? el.tags.name : (type === 'fuel' ? 'Fuel station' : type === 'hospital' ? 'Hospital' : 'Railway station');
      const marker = L.marker([el.lat, el.lon]).addTo(leafletMap).bindPopup(`${name}<br>${dist.toFixed(1)} km away`);
      mapMarkers.push(marker);
    });
    document.getElementById('mapStatus').textContent = `Found ${data.elements.length} ${type} within 20km — showing nearest ${withDist.length}.`;
  } catch (err){
    document.getElementById('mapStatus').textContent = 'Got a response but could not process it: ' + err.message;
  } finally {
    isLoadingNearby = false;
    document.querySelectorAll('.map-filter-btn').forEach(b => b.disabled = false);
  }
}

document.querySelectorAll('.map-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMapType = btn.dataset.type;
    if (leafletMap) loadNearby(currentMapType);
  });
});

// Hook into tab switching: initialize the map the first time its tab is opened
document.querySelector('[data-tab="map"]').addEventListener('click', () => {
  if (!mapInitialized){
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        pos => {
          userLat = pos.coords.latitude;
          userLon = pos.coords.longitude;
          initMap();
        },
        (err) => {
          let reason = 'Location unavailable.';
          if (err.code === 1) reason = 'Location permission was denied.';
          else if (err.code === 2) reason = 'Your device could not determine a location.';
          else if (err.code === 3) reason = 'Location request timed out.';
          document.getElementById('mapStatus').textContent = reason + ' Showing central India instead — check your browser/OS location permissions for this site and reload to try again.';
          initMap();
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      document.getElementById('mapStatus').textContent = 'Your browser does not support geolocation. Showing central India instead.';
      initMap();
    }
  } else {
    setTimeout(() => leafletMap.invalidateSize(), 50);
  }
});
