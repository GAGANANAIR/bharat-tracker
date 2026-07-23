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

const schemeSearch = document.getElementById('schemeSearch');
const schemeCategory = document.getElementById('schemeCategory');
const schemeResults = document.getElementById('schemeResults');
const trainResult = document.getElementById('trainResult');   // ← Important

// Schemes Code (unchanged)
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

// Prices Code (unchanged)
const OZ_TO_G = 31.1035;
async function fetchLivePrices(){ ... }   // your existing prices code
fetchLivePrices();
setInterval(fetchLivePrices, 60000);

// Fuel Code (unchanged)
const fuelApiKeyInput = document.getElementById('fuelApiKey');
const fuelResult = document.getElementById('fuelResult');
// ... your fuel code

// === PNR CHECKER ===
async function checkPNR(pnr) {
  trainResult.style.display = 'block';
  trainResult.innerHTML = '<p style="color:#0066cc;">Checking PNR with RapidAPI...</p>';

  try {
    const response = await fetch(`https://irctc1.p.rapidapi.com/api/v3/getPNR?pnrNumber=${pnr}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'irctc1.p.rapidapi.com',
        'x-rapidapi-key': '31f5e7752amsh62837c45a6eaf9bp19ce77jsnd063cd71a424'
      }
    });

    const data = await response.json();

    if (data && data.data) {
      const d = data.data;
      let html = `<h3>PNR: ${pnr}</h3>`;
      html += `<p><strong>Train:</strong> ${d.trainName || d.trainNo || 'N/A'}</p>`;
      html += `<p><strong>DoJ:</strong> ${d.doj || 'N/A'}</p>`;
      html += `<p><strong>Chart Status:</strong> ${d.chartPrepared ? '✅ Prepared' : 'Not Prepared'}</p>`;

      if (d.passengerInfo && d.passengerInfo.length > 0) {
        html += '<h4>Passengers:</h4><ul>';
        d.passengerInfo.forEach((p, i) => {
          html += `<li>Passenger ${i+1}: ${p.currentStatus || p.bookingStatus || 'N/A'}</li>`;
        });
        html += '</ul>';
      }
      trainResult.innerHTML = html;
    } else {
      throw new Error('No data');
    }
  } catch (err) {
    trainResult.innerHTML = `
      <p style="color:#d32f2f;">Live PNR data not available right now (API limit or temporary issue).</p>
      <p><strong>Your PNR is ready. Click below to see full details:</strong></p>
      <button onclick="window.open('https://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html?pnr=${pnr}', '_blank')" style="padding:10px 20px; background:#0066cc; color:white; border:none; border-radius:6px; cursor:pointer;">
        Open Official PNR Page →
      </button>
    `;
  }
}

// Button Listeners
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
  window.open(`https://enquiry.indianrail.gov.in/ntes/RunningTrain?trainNo=${train}`, '_blank');
});

// Rest of your map code (unchanged)
