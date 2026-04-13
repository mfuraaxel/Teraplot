// ════════════════════════════════════════════════════════════════════
//  TAB ROUTING
// ════════════════════════════════════════════════════════════════════
var mapInitialized = false;

function switchTab(tabId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });
  // Deactivate all tab buttons
  document.querySelectorAll('.tab-btn').forEach(function(t) {
    t.classList.remove('active');
  });
  // Show target page
  document.getElementById('page-' + tabId).classList.add('active');
  // Activate target tab
  var tabBtn = document.querySelector('[data-tab="' + tabId + '"]');
  if (tabBtn) tabBtn.classList.add('active');

  // Init map on first visit
  if (tabId === 'map') {
    if (!mapInitialized) {
      setTimeout(function() {
        initLeafletMap();
        mapInitialized = true;
      }, 80);
    } else {
      setTimeout(function() {
        if (window.leafletMap) window.leafletMap.invalidateSize();
      }, 80);
    }
    renderMapSidebar();
  }
}

// ════════════════════════════════════════════════════════════════════
//  HOME PAGE INTERACTIONS
// ════════════════════════════════════════════════════════════════════

// ── Filter chips (type filter) ───────────────────────────────────
var homeTypeFilter = 'all';

document.querySelectorAll('.filter-group .filter-chip').forEach(function(chip) {
  chip.addEventListener('click', function() {
    document.querySelectorAll('.filter-group .filter-chip').forEach(function(c) { c.classList.remove('active'); });
    chip.classList.add('active');
    homeTypeFilter = chip.textContent.trim().toLowerCase();
    filterHomeListings();
  });
});

// ── Hero search bar ───────────────────────────────────────────────
document.querySelector('.hero-search .btn-primary').addEventListener('click', function() {
  filterHomeListings();
});
document.querySelector('.hero-search input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') filterHomeListings();
});

function filterHomeListings() {
  var query = document.querySelector('.hero-search input').value.trim().toLowerCase();
  var district = document.querySelector('.hero-search select').value.toLowerCase();
  var cards = document.querySelectorAll('.listing-card');
  var visible = 0;

  cards.forEach(function(card) {
    var type  = card.getAttribute('data-type') || '';
    var title = card.getAttribute('data-title') || '';

    var matchType     = homeTypeFilter === 'all' || type === homeTypeFilter;
    var matchQuery    = !query   || title.includes(query);
    var matchDistrict = !district || district === 'all districts' || district === '' || title.includes(district);

    var show = matchType && matchQuery && matchDistrict;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  // Update count label
  var sub = document.querySelector('.section-sub');
  if (sub) {
    sub.textContent = visible + ' plot' + (visible !== 1 ? 's' : '') + ' found';
  }

  // Show empty state if nothing matches
  var grid = document.querySelector('.cards-grid');
  var existing = document.getElementById('no-results-msg');
  if (visible === 0) {
    if (!existing) {
      var msg = document.createElement('div');
      msg.id = 'no-results-msg';
      msg.style.cssText = 'grid-column:1/-1;padding:48px;text-align:center;color:var(--mist);font-size:14px;';
      msg.innerHTML = '<div style="font-size:32px;margin-bottom:12px;opacity:.4">🔍</div>No plots match your search. Try different keywords or filters.';
      grid.appendChild(msg);
    }
  } else {
    if (existing) existing.remove();
  }
}

// ── Detail thumbnails ────────────────────────────────────────────
document.querySelectorAll('.detail-thumb').forEach(function(thumb) {
  thumb.addEventListener('click', function() {
    document.querySelectorAll('.detail-thumb').forEach(function(t) { t.classList.remove('active'); });
    thumb.classList.add('active');
  });
});

function selectLandType(btn) {
  document.querySelectorAll('.land-type-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
}

// ════════════════════════════════════════════════════════════════════
//  PLOT DATA
// ════════════════════════════════════════════════════════════════════
var PLOTS = [
  { id:1,  title:'600 sqm plot',           sector:'Kicukiro',   type:'residential', price:'RWF 12,000,000', size:'600 m²',   lat:-1.9806, lng:30.1044, verified:true  },
  { id:2,  title:'1,200 sqm commercial',   sector:'Nyarugenge', type:'commercial',  price:'RWF 45,000,000', size:'1,200 m²', lat:-1.9441, lng:30.0619, verified:true  },
  { id:3,  title:'400 sqm plot',           sector:'Gasabo',     type:'residential', price:'RWF 9,500,000',  size:'400 m²',   lat:-1.9275, lng:30.1128, verified:true  },
  { id:4,  title:'800 sqm mixed-use',      sector:'Remera',     type:'commercial',  price:'RWF 28,000,000', size:'800 m²',   lat:-1.9556, lng:30.1120, verified:false },
  { id:5,  title:'300 sqm plot',           sector:'Kimironko',  type:'residential', price:'RWF 7,200,000',  size:'300 m²',   lat:-1.9360, lng:30.1313, verified:true  },
  { id:6,  title:'1,500 sqm warehouse',    sector:'Gikondo',    type:'commercial',  price:'RWF 62,000,000', size:'1,500 m²', lat:-1.9800, lng:30.0830, verified:true  },
  { id:7,  title:'500 sqm plot',           sector:'Kanombe',    type:'residential', price:'RWF 10,800,000', size:'500 m²',   lat:-1.9681, lng:30.1383, verified:true  },
  { id:8,  title:'700 sqm corner plot',    sector:'Kinyinya',   type:'residential', price:'RWF 14,500,000', size:'700 m²',   lat:-1.9142, lng:30.1192, verified:false },
  { id:9,  title:'2,000 sqm farmland',     sector:'Rusororo',   type:'agricultural',price:'RWF 8,000,000',  size:'2,000 m²', lat:-1.8930, lng:30.1350, verified:true  },
  { id:10, title:'450 sqm plot',           sector:'Gisozi',     type:'residential', price:'RWF 11,000,000', size:'450 m²',   lat:-1.9188, lng:30.0940, verified:true  },
  { id:11, title:'900 sqm office land',    sector:'Muhima',     type:'commercial',  price:'RWF 38,500,000', size:'900 m²',   lat:-1.9530, lng:30.0570, verified:true  },
  { id:12, title:'1,800 sqm farm plot',    sector:'Jabana',     type:'agricultural',price:'RWF 6,500,000',  size:'1,800 m²', lat:-1.8975, lng:30.1580, verified:false }
];

var TYPE_COLORS = { residential:'#e84040', commercial:'#1a73e8', agricultural:'#2e8c50' };
var TYPE_ICONS  = { residential:'🏘️', commercial:'🏢', agricultural:'🌾' };
var mapTypeFilter = 'all';
var leafletMarkers = [];

// ════════════════════════════════════════════════════════════════════
//  LEAFLET MAP
// ════════════════════════════════════════════════════════════════════
function initLeafletMap() {
  window.leafletMap = L.map('map', {
    center: [-1.9441, 30.0619],
    zoom: 13,
    zoomControl: false
  });

  // OpenStreetMap — free, no key, full Kigali roads visible
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    subdomains: ['a','b','c']
  }).addTo(window.leafletMap);

  L.control.zoom({ position: 'bottomright' }).addTo(window.leafletMap);
  placeMapMarkers(getFilteredPlots());
}

function makeMarkerIcon(color, large) {
  var size = large ? 38 : 28;
  var height = large ? 52 : 38;
  var svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + height + '" viewBox="0 0 28 38">',
    '<filter id="ds"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.35"/></filter>',
    '<path d="M14 0C6.27 0 0 6.27 0 14c0 9.8 14 24 14 24S28 23.8 28 14C28 6.27 21.73 0 14 0z" fill="' + color + '" filter="url(#ds)" stroke="white" stroke-width="1.2"/>',
    '<circle cx="14" cy="14" r="5.5" fill="white" opacity="0.92"/>',
    '</svg>'
  ].join('');
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, height],
    iconAnchor: [size / 2, height],
    popupAnchor: [0, -(height + 4)]
  });
}

function placeMapMarkers(plots) {
  // Remove old markers
  leafletMarkers.forEach(function(m) { window.leafletMap.removeLayer(m); });
  leafletMarkers = [];

  plots.forEach(function(plot) {
    var color = TYPE_COLORS[plot.type] || '#e84040';
    var marker = L.marker([plot.lat, plot.lng], {
      icon: makeMarkerIcon(color, false)
    }).addTo(window.leafletMap);

    // Popup content
    var popup = [
      '<div style="font-family: -apple-system, sans-serif; min-width: 210px;">',
      '  <div style="font-size:17px;font-weight:700;color:#111;margin-bottom:3px">' + plot.price + '</div>',
      '  <div style="font-size:13px;color:#333;margin-bottom:2px">' + plot.title + '</div>',
      '  <div style="font-size:11px;color:#888;margin-bottom:12px">📍 ' + plot.sector + ', Kigali</div>',
      '  <div style="display:flex;gap:14px;padding:10px 0;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;margin-bottom:12px">',
      '    <div style="text-align:center"><div style="font-size:13px;font-weight:600;color:#222">' + plot.size + '</div><div style="font-size:10px;color:#aaa;margin-top:2px;text-transform:uppercase;letter-spacing:.3px">Area</div></div>',
      '    <div style="text-align:center"><div style="font-size:13px;font-weight:600;color:' + color + ';text-transform:capitalize">' + plot.type + '</div><div style="font-size:10px;color:#aaa;margin-top:2px;text-transform:uppercase;letter-spacing:.3px">Type</div></div>',
      '    <div style="text-align:center"><div style="font-size:13px;font-weight:600;color:' + (plot.verified ? '#2e8c50' : '#aaa') + '">' + (plot.verified ? '✓ Verified' : 'Unverified') + '</div><div style="font-size:10px;color:#aaa;margin-top:2px;text-transform:uppercase;letter-spacing:.3px">Seller</div></div>',
      '  </div>',
      '  <button onclick="switchTab(\'detail\')" style="width:100%;padding:10px;background:' + color + ';color:#fff;border:none;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;letter-spacing:.3px">View listing →</button>',
      '</div>'
    ].join('');

    marker.bindPopup(popup, { maxWidth: 260, closeButton: true });

    // Sync with sidebar on marker click
    marker.on('click', function() {
      document.querySelectorAll('.map-plot-card').forEach(function(c) { c.classList.remove('active'); });
      var card = document.querySelector('[data-plot-id="' + plot.id + '"]');
      if (card) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    leafletMarkers.push({ marker: marker, plot: plot });
  });
}

// ════════════════════════════════════════════════════════════════════
//  MAP SIDEBAR
// ════════════════════════════════════════════════════════════════════
function getFilteredPlots() {
  var query = (document.getElementById('map-search').value || '').toLowerCase().trim();
  return PLOTS.filter(function(p) {
    var matchType = mapTypeFilter === 'all' || p.type === mapTypeFilter;
    var matchSearch = !query ||
      p.title.toLowerCase().indexOf(query) > -1 ||
      p.sector.toLowerCase().indexOf(query) > -1;
    return matchType && matchSearch;
  });
}

function renderMapSidebar() {
  var filtered = getFilteredPlots();
  var container = document.getElementById('map-cards');
  container.innerHTML = '';

  var count = filtered.length;
  document.getElementById('map-count').textContent = count + ' plot' + (count !== 1 ? 's' : '') + ' found';
  document.getElementById('map-badge').textContent = count + ' active plots';

  if (window.leafletMap) placeMapMarkers(filtered);

  filtered.forEach(function(plot, idx) {
    var color = TYPE_COLORS[plot.type] || '#e84040';
    var icon  = TYPE_ICONS[plot.type]  || '🏡';

    var card = document.createElement('div');
    card.className = 'map-plot-card';
    card.setAttribute('data-plot-id', plot.id);

    card.innerHTML = [
      '<div class="map-plot-icon">' + icon + '</div>',
      '<div style="flex:1;min-width:0">',
      '  <div class="map-plot-price">' + plot.price + '</div>',
      '  <div class="map-plot-title">' + plot.title + ', ' + plot.sector + '</div>',
      '  <div class="map-plot-loc">📍 ' + plot.sector + ', Kigali</div>',
      '  <div class="map-plot-tags">',
      '    <div class="map-plot-tag">' + plot.size + '</div>',
      '    <div class="map-plot-tag" style="color:' + color + ';border-color:' + color + '44;text-transform:capitalize">' + plot.type + '</div>',
      (plot.verified ? '    <div class="map-plot-tag" style="color:#2e8c50;border-color:#2e8c5044">✓ Verified</div>' : ''),
      '  </div>',
      '</div>'
    ].join('');

    card.addEventListener('click', function() {
      // Highlight card
      document.querySelectorAll('.map-plot-card').forEach(function(c) { c.classList.remove('active'); });
      card.classList.add('active');

      if (window.leafletMap) {
        // Fly to plot
        window.leafletMap.flyTo([plot.lat, plot.lng], 16, { duration: 0.7, easeLinearity: 0.4 });
        // Open popup after fly completes
        var entry = leafletMarkers[idx];
        if (entry) {
          setTimeout(function() { entry.marker.openPopup(); }, 750);
        }
      }
    });

    container.appendChild(card);
  });
}

function setMapType(type, btn) {
  document.querySelectorAll('.map-filter-row .filter-chip').forEach(function(c) { c.classList.remove('active'); });
  btn.classList.add('active');
  mapTypeFilter = type;
  renderMapSidebar();
}

function applyMapFilter() { renderMapSidebar(); }

document.getElementById('map-search').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') applyMapFilter();
});

// ── FAQ toggle ───────────────────────────────────────────────────
function toggleFaq(item) {
  var answer = item.querySelector('.faq-answer');
  var toggle = item.querySelector('.faq-toggle');
  var isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-answer').forEach(function(a) { a.classList.remove('open'); });
  document.querySelectorAll('.faq-toggle').forEach(function(t) { t.classList.remove('open'); });
  if (!isOpen) {
    answer.classList.add('open');
    toggle.classList.add('open');
  }
}

// ════════════════════════════════════════════════════════════════════
//  PLOT SUBMISSION & PERSISTENCE
// ════════════════════════════════════════════════════════════════════

// District approximate center coordinates for map pinning
var DISTRICT_COORDS = {
  'kigali':   { lat: -1.9441, lng: 30.0619 },
  'musanze':  { lat: -1.4987, lng: 29.6340 },
  'huye':     { lat: -2.5967, lng: 29.7394 },
  'rubavu':   { lat: -1.6814, lng: 29.3575 },
  'kayonza':  { lat: -1.8840, lng: 30.6470 },
  'rwamagana':{ lat: -1.9490, lng: 30.4347 }
};

// Sector offsets within Kigali to spread pins slightly
var SECTOR_OFFSETS = {
  'kicukiro':  { dlat: -0.038, dlng:  0.044 },
  'gasabo':    { dlat:  0.013, dlng:  0.053 },
  'nyarugenge':{ dlat: -0.003, dlng: -0.001 },
  'remera':    { dlat: -0.015, dlng:  0.051 },
  'kimironko': { dlat:  0.006, dlng:  0.072 },
  'gikondo':   { dlat: -0.039, dlng:  0.013 },
  'kanombe':   { dlat: -0.027, dlng:  0.079 },
  'kinyinya':  { dlat:  0.028, dlng:  0.060 },
  'rusororo':  { dlat:  0.049, dlng:  0.076 },
  'gisozi':    { dlat:  0.022, dlng:  0.021 },
  'muhima':    { dlat: -0.012, dlng: -0.012 },
  'jabana':    { dlat:  0.053, dlng:  0.099 }
};

function getCoords(district, sector) {
  var base = DISTRICT_COORDS[(district || 'kigali').toLowerCase()] || DISTRICT_COORDS['kigali'];
  var off  = SECTOR_OFFSETS[(sector || '').toLowerCase()] || { dlat: (Math.random()-0.5)*0.04, dlng: (Math.random()-0.5)*0.04 };
  return { lat: base.lat + off.dlat, lng: base.lng + off.dlng };
}

function formatPrice(raw) {
  var n = parseInt(raw, 10);
  if (!n) return 'Price on request';
  return 'RWF ' + n.toLocaleString();
}

// Load any previously saved user plots from localStorage
function loadSavedPlots() {
  try {
    var saved = JSON.parse(localStorage.getItem('teraplot_user_plots') || '[]');
    saved.forEach(function(p) { PLOTS.push(p); });
  } catch(e) {}
}

function savePlotToStorage(plot) {
  try {
    var saved = JSON.parse(localStorage.getItem('teraplot_user_plots') || '[]');
    saved.push(plot);
    localStorage.setItem('teraplot_user_plots', JSON.stringify(saved));
  } catch(e) {}
}

function submitPlot() {
  // Read form values
  var title      = (document.getElementById('f-title')      || {}).value || '';
  var district   = (document.getElementById('f-district')   || {}).value || '';
  var sector     = (document.getElementById('f-sector')     || {}).value || '';
  var size       = (document.getElementById('f-size')       || {}).value || '';
  var unit       = (document.getElementById('f-unit')       || {}).value || 'm²';
  var price      = (document.getElementById('f-price')      || {}).value || '';
  var negotiable = (document.getElementById('f-negotiable') || {}).value || 'Yes';
  var landTypeBtn = document.querySelector('.land-type-btn.active');
  var landType   = landTypeBtn ? landTypeBtn.textContent.trim().toLowerCase() : 'residential';

  // Validation
  if (!title.trim()) { alert('Please add a listing title.'); return; }
  if (!district)     { alert('Please select a district.');   return; }
  if (!sector.trim()){ alert('Please enter the sector.');    return; }
  if (!size)         { alert('Please enter the plot size.'); return; }
  if (!price)        { alert('Please enter the asking price.'); return; }

  // Build coords from district + sector
  var coords = getCoords(district, sector);

  // Build new plot object
  var newPlot = {
    id:       Date.now(),
    title:    title.trim() || (size + ' ' + unit + ' plot'),
    sector:   sector.trim() || district,
    district: district,
    type:     landType,
    price:    formatPrice(price),
    size:     size + ' ' + unit,
    lat:      coords.lat,
    lng:      coords.lng,
    verified: false,
    isNew:    true
  };

  // Add to live PLOTS array
  PLOTS.push(newPlot);

  // Persist to localStorage
  savePlotToStorage(newPlot);

  // Show success modal
  var summary = document.getElementById('modal-plot-summary');
  summary.innerHTML =
    '<div style="font-family:var(--serif);font-size:16px;color:var(--sand);margin-bottom:6px">' + newPlot.price + '</div>' +
    '<div style="font-size:13px;color:var(--cream);margin-bottom:3px">' + newPlot.title + '</div>' +
    '<div style="font-size:12px;color:var(--mist);margin-bottom:10px">&#128205; ' + newPlot.sector + ', ' + newPlot.district + '</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      '<span style="font-size:11px;padding:3px 9px;border:1px solid var(--border);color:var(--mist);border-radius:2px">' + newPlot.size + '</span>' +
      '<span style="font-size:11px;padding:3px 9px;border:1px solid rgba(194,98,42,.3);color:var(--terra);border-radius:2px;text-transform:capitalize">' + newPlot.type + '</span>' +
      '<span style="font-size:11px;padding:3px 9px;border:1px solid var(--border);color:var(--mist);border-radius:2px">Negotiable: ' + negotiable + '</span>' +
    '</div>';

  var modal = document.getElementById('submit-modal');
  modal.style.display = 'flex';

  // If map is open, refresh markers immediately
  if (window.leafletMap && mapInitialized) {
    renderMapSidebar();
  }
}

function closeModal() {
  document.getElementById('submit-modal').style.display = 'none';
  switchTab('home');
  // Reset form
  var inputs = document.querySelectorAll('#page-post .form-input, #page-post .form-textarea');
  inputs.forEach(function(i){ i.value = ''; });
  var selects = document.querySelectorAll('#page-post .form-select');
  selects.forEach(function(s){ s.selectedIndex = 0; });
  document.querySelectorAll('.land-type-btn').forEach(function(b){ b.classList.remove('active'); });
  document.querySelector('.land-type-btn').classList.add('active');
}

function goToMap() {
  document.getElementById('submit-modal').style.display = 'none';
  switchTab('map');
}

// Load saved plots on startup
loadSavedPlots();