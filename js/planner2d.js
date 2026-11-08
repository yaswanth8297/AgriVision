/**
 * AgriVision - Module 1: Real-Life Photorealistic 2D Vector Canvas Farm Designer
 * Features photorealistic SVG textures, botanical tree canopies with fruit accents,
 * crop rows, gravel road texture, water ripples, solar polyhouse glass, and AABB collision guard.
 */

let selectedObjId = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let activeDragObj = null;

// Botanical species database with real-life canopy sizing & fruit colors
const TREE_SPECIES = {
  mango: { spacing: 6, canopyRadius: 2.8, color: '#1b5e20', fruitColor: '#f39c12', nameEn: 'Mango (Banganapalli)', nameTe: 'మామిడి (బంగినపల్లి)', nameHi: 'आम (दशहरी/लंगड़ा)' },
  guava: { spacing: 3, canopyRadius: 1.5, color: '#2e7d32', fruitColor: '#aed581', nameEn: 'Guava (Taiwan Pink)', nameTe: 'జామ (తైవాన్ పింక్)', nameHi: 'अमरूद (ताइवान पिंक)' },
  coconut: { spacing: 8, canopyRadius: 3.6, color: '#145214', fruitColor: '#8d6e63', nameEn: 'Coconut Palm', nameTe: 'కొబ్బరి చెట్లు', nameHi: 'नारियल के पेड़' },
  citrus: { spacing: 5, canopyRadius: 2.3, color: '#2e7d32', fruitColor: '#f1c40f', nameEn: 'Citrus / Lime', nameTe: 'నిమ్మ / బత్తాయి', nameHi: 'नींबू / मौसमी' }
};

function getSvgViewBox(p) {
  const f = Math.max(p.L, p.W) / 100;
  return `${-8 * f} ${-8 * f} ${p.L + 16 * f} ${p.W + 20 * f}`;
}

function getSvgPoint(svg, evt) {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  const loc = pt.matrixTransform(svg.getScreenCTM().inverse());
  return { x: Math.round(loc.x), y: Math.round(loc.y) };
}

// Spatial Land Analysis & Collision Detection Engine
function analyzeSpatialLayout(p) {
  const totalArea = p.L * p.W;
  const cover = new Uint8Array(totalArea);
  let used = 0;
  let overlapCount = 0;
  const cats = { crop: 0, orchard: 0, greenhouse: 0, pond: 0, road: 0 };

  p.objs.forEach(o => {
    for (let y = Math.floor(o.y); y < Math.floor(o.y + o.h); y++) {
      if (y < 0 || y >= p.W) continue;
      for (let x = Math.floor(o.x); x < Math.floor(o.x + o.w); x++) {
        if (x < 0 || x >= p.L) continue;
        const idx = y * p.L + x;
        if (cover[idx] === 0) {
          cover[idx] = 1;
          used++;
          cats[o.type] = (cats[o.type] || 0) + 1;
        } else if (cover[idx] === 1) {
          cover[idx] = 2;
          overlapCount++;
        }
      }
    }
  });

  const collidingPairs = [];
  const outOfBounds = [];

  for (let i = 0; i < p.objs.length; i++) {
    const a = p.objs[i];
    if (a.x < 0 || a.y < 0 || a.x + a.w > p.L || a.y + a.h > p.W) {
      outOfBounds.push(a);
    }
    for (let j = i + 1; j < p.objs.length; j++) {
      const b = p.objs[j];
      if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) {
        collidingPairs.push([a, b]);
      }
    }
  }

  const roadArea = (p.L * 3 * 2) + ((p.W - 6) * 3 * 2);

  return {
    totalArea,
    usedArea: used,
    emptyArea: Math.max(0, totalArea - used),
    overlapCount,
    collidingPairs,
    outOfBounds,
    roadArea,
    cats
  };
}

// Botanical Tree Grid Generator with Fruit Clusters
function calculateTreeGrid(obj) {
  const sp = obj.spacing || 6;
  const trees = [];
  const speciesKey = obj.crop || (sp <= 4 ? 'guava' : 'mango');
  const spec = TREE_SPECIES[speciesKey] || TREE_SPECIES.mango;

  for (let tx = obj.x + sp / 2; tx < obj.x + obj.w; tx += sp) {
    for (let ty = obj.y + sp / 2; ty < obj.y + obj.h; ty += sp) {
      trees.push({
        x: tx,
        y: ty,
        r: spec.canopyRadius,
        color: spec.color,
        fruitColor: spec.fruitColor
      });
    }
  }
  return trees;
}

// Master 2D Real-Life Vector Blueprint Renderer
function render2D() {
  const p = getActiveParcel();
  const svg = document.getElementById('svg-canvas');
  if (!svg) return;

  const analysis = analyzeSpatialLayout(p);
  const f = Math.max(p.L, p.W) / 100;
  
  svg.setAttribute('viewBox', getSvgViewBox(p));

  const overlappingSet = new Set();
  analysis.collidingPairs.forEach(pair => {
    overlappingSet.add(pair[0].id);
    overlappingSet.add(pair[1].id);
  });
  analysis.outOfBounds.forEach(o => overlappingSet.add(o.id));

  // Collision Warning Banner
  const alertBanner = document.getElementById('collision-alert');
  if (alertBanner) {
    if (analysis.collidingPairs.length > 0 || analysis.outOfBounds.length > 0) {
      alertBanner.classList.add('show');
      if (STATE.lang === 'te') {
        alertBanner.textContent = `⚠️ హెచ్చరిక: ${analysis.collidingPairs.length} స్థల ఆక్రమణలు గుర్తించబడ్డాయి!`;
      } else if (STATE.lang === 'hi') {
        alertBanner.textContent = `⚠️ चेतावनी: ${analysis.collidingPairs.length} भू-स्थानिक अतिव्यापन का पता चला!`;
      } else {
        alertBanner.textContent = `⚠️ Warning: ${analysis.collidingPairs.length} Overlaps / Boundary Breaches Detected!`;
      }
    } else {
      alertBanner.classList.remove('show');
    }
  }

  // Build Real-Life SVG Definitions and Elements
  let markup = `
    <defs>
      <!-- Real-Life Arable Loam Soil Texture Pattern -->
      <pattern id="soil-pattern" width="${6 * f}" height="${6 * f}" patternUnits="userSpaceOnUse">
        <rect width="${6 * f}" height="${6 * f}" fill="#c7b299" />
        <circle cx="${1.5 * f}" cy="${1.5 * f}" r="${0.6 * f}" fill="#b8a186" opacity="0.6"/>
        <circle cx="${4.5 * f}" cy="${4.5 * f}" r="${0.5 * f}" fill="#a89278" opacity="0.5"/>
        <circle cx="${1.2 * f}" cy="${4.2 * f}" r="${0.4 * f}" fill="#8d745c" opacity="0.4"/>
        <circle cx="${4.8 * f}" cy="${1.8 * f}" r="${0.35 * f}" fill="#6b533e" opacity="0.3"/>
      </pattern>

      <!-- 5m Architectural Survey Grid Dots -->
      <pattern id="survey-grid" width="${5 * f}" height="${5 * f}" patternUnits="userSpaceOnUse">
        <circle cx="${2.5 * f}" cy="${2.5 * f}" r="${0.4 * f}" fill="rgba(40, 30, 20, 0.28)"/>
      </pattern>

      <!-- Real-Life Crushed Gravel Road Pattern -->
      <pattern id="gravel-road" width="${4 * f}" height="${4 * f}" patternUnits="userSpaceOnUse">
        <rect width="${4 * f}" height="${4 * f}" fill="#8d7b68"/>
        <circle cx="${1 * f}" cy="${1 * f}" r="${0.4 * f}" fill="#a3927f"/>
        <circle cx="${3 * f}" cy="${2.5 * f}" r="${0.35 * f}" fill="#6e5d4c"/>
      </pattern>

      <!-- Crop Bed Row Striping Pattern -->
      <pattern id="crop-rows" width="${10 * f}" height="${2.5 * f}" patternUnits="userSpaceOnUse">
        <rect width="${10 * f}" height="${1.3 * f}" fill="#2e7d32" />
        <rect y="${1.3 * f}" width="${10 * f}" height="${1.2 * f}" fill="#1b5e20" />
        <line x1="0" y1="${1.3 * f}" x2="${10 * f}" y2="${1.3 * f}" stroke="#144d18" stroke-width="${0.2 * f}" stroke-dasharray="${1 * f},${0.5 * f}"/>
      </pattern>

      <!-- Water Reflection Gradient for Retention Pond -->
      <linearGradient id="water-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0277bd" />
        <stop offset="50%" stop-color="#0288d1" />
        <stop offset="100%" stop-color="#01579b" />
      </linearGradient>

      <!-- Polyhouse Solar Glazing Gradient -->
      <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stop-color="#e0f7fa" stop-opacity="0.85"/>
        <stop offset="45%" stop-color="#80deea" stop-opacity="0.6"/>
        <stop offset="70%" stop-color="#ffffff" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#b2ebf2" stop-opacity="0.65"/>
      </linearGradient>

      <!-- Drop Shadow for Realistic Structures -->
      <filter id="entity-shadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="${0.8 * f}" dy="${1.2 * f}" stdDeviation="${0.8 * f}" flood-color="rgba(0,0,0,0.35)"/>
      </filter>
    </defs>

    <!-- Base Arable Farmland Soil -->
    <rect x="0" y="0" width="${p.L}" height="${p.W}" fill="url(#soil-pattern)" stroke="#3e2723" stroke-width="${1.4 * f}" rx="${1.5 * f}" />

    <!-- 5m Survey CAD Dot Matrix -->
    <rect x="0" y="0" width="${p.L}" height="${p.W}" fill="url(#survey-grid)" pointer-events="none" />

    <!-- 3m Perimeter Vehicular Gravel Road Ring -->
    <rect x="0" y="0" width="${p.L}" height="${p.W}" 
          fill="none" stroke="url(#gravel-road)" stroke-width="${3 * f}" opacity="0.9" pointer-events="none" />
    <rect x="${1.5 * f}" y="${1.5 * f}" width="${p.L - 3 * f}" height="${p.W - 3 * f}" 
          fill="none" stroke="#f1c40f" stroke-width="${0.4 * f}" stroke-dasharray="${3 * f},${2 * f}" opacity="0.8" pointer-events="none" />
    
    <text x="${p.L / 2}" y="${2.2 * f}" fill="#ffffff" font-size="${1.8 * f}" font-weight="800" text-anchor="middle" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">
      ${STATE.lang === 'te' ? '3మీటర్ల వాహన రోడ్డు (రైతు దారి)' : (STATE.lang === 'hi' ? '3 मी. वाहन सड़क (रास्ता)' : '3m Perimeter Vehicle Access Road')}
    </text>

    <!-- Dimension Annotations -->
    <text x="${p.L / 2}" y="${-2.5 * f}" fill="var(--text-primary)" font-size="${2.8 * f}" font-weight="800" text-anchor="middle">
      ${p.L}m (${((p.L * p.W) / 4046.86).toFixed(2)} ${STATE.lang === 'te' ? 'ఎకరాలు' : (STATE.lang === 'hi' ? 'एकड़' : 'Acres')})
    </text>
    <text x="${-3.2 * f}" y="${p.W / 2}" fill="var(--text-primary)" font-size="${2.8 * f}" font-weight="800" text-anchor="middle" transform="rotate(-90 ${-3.2 * f} ${p.W / 2})">
      ${p.W}m
    </text>
  `;

  // Draw Farm Entities with Real-Life Visuals
  p.objs.forEach(o => {
    const isSelected = selectedObjId === o.id;
    const isBad = overlappingSet.has(o.id);
    const strokeColor = isBad ? '#e74c3c' : (isSelected ? '#f39c12' : 'rgba(0,0,0,0.6)');
    const strokeWidth = isBad || isSelected ? 1.8 * f : 0.6 * f;

    markup += `<g class="farm-entity" data-id="${o.id}" style="cursor: move;" filter="url(#entity-shadow)">`;

    if (o.type === 'crop') {
      // Vegetable Beds with Row Striping
      markup += `
        <rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${0.8 * f}"
              fill="url(#crop-rows)" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
        <!-- Ridge Borders -->
        <rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${0.8 * f}"
              fill="none" stroke="#1b5e20" stroke-width="${0.8 * f}" pointer-events="none"/>
      `;
    } 
    else if (o.type === 'orchard') {
      // Orchard Background Loam Bed
      markup += `
        <rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${0.8 * f}"
              fill="#556b2f" fill-opacity="0.22" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
      `;

      // Render Trees with Multi-Layered Canopies & Fruits
      const trees = calculateTreeGrid(o);
      trees.forEach(t => {
        markup += `
          <!-- Canopy Clearance Boundary -->
          <circle cx="${t.x}" cy="${t.y}" r="${t.r}" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="${0.3 * f}" stroke-dasharray="${0.6 * f}" pointer-events="none" />
          
          <!-- Outer Dense Foliage Crown -->
          <circle cx="${t.x}" cy="${t.y}" r="${t.r * 0.9}" fill="${t.color}" stroke="#0f3d14" stroke-width="${0.3 * f}" pointer-events="none" />
          
          <!-- Inner Highlights Foliage -->
          <circle cx="${t.x - t.r * 0.2}" cy="${t.y - t.r * 0.2}" r="${t.r * 0.5}" fill="#4caf50" opacity="0.6" pointer-events="none" />
          
          <!-- Fruit Accents on Canopy -->
          <circle cx="${t.x + t.r * 0.4}" cy="${t.y - t.r * 0.3}" r="${0.45 * f}" fill="${t.fruitColor}" stroke="#ffffff" stroke-width="${0.15 * f}" pointer-events="none"/>
          <circle cx="${t.x - t.r * 0.35}" cy="${t.y + t.r * 0.4}" r="${0.45 * f}" fill="${t.fruitColor}" stroke="#ffffff" stroke-width="${0.15 * f}" pointer-events="none"/>
          
          <!-- Central Trunk Core -->
          <circle cx="${t.x}" cy="${t.y}" r="${0.45 * f}" fill="#4e342e" stroke="#ffffff" stroke-width="${0.18 * f}" pointer-events="none" />
        `;
      });
    } 
    else if (o.type === 'pond') {
      // Real-Life Water Pond with Stone Embankment & Waves
      const rx = Math.min(o.w, o.h) * 0.35;
      markup += `
        <!-- Earthen Bank Outer Rim -->
        <rect x="${o.x - 0.8 * f}" y="${o.y - 0.8 * f}" width="${o.w + 1.6 * f}" height="${o.h + 1.6 * f}" rx="${rx}"
              fill="#6d4c41" stroke="#4e342e" stroke-width="${0.6 * f}"/>
        <!-- Deep Water Surface -->
        <rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${rx}"
              fill="url(#water-gradient)" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
        <!-- Water Shimmer Wave Lines -->
        <path d="M ${o.x + o.w * 0.15} ${o.y + o.h * 0.3} Q ${o.x + o.w * 0.35} ${o.y + o.h * 0.22} ${o.x + o.w * 0.55} ${o.y + o.h * 0.3} T ${o.x + o.w * 0.85} ${o.y + o.h * 0.3}"
              fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="${0.4 * f}" pointer-events="none"/>
        <path d="M ${o.x + o.w * 0.2} ${o.y + o.h * 0.65} Q ${o.x + o.w * 0.45} ${o.y + o.h * 0.58} ${o.x + o.w * 0.7} ${o.y + o.h * 0.65}"
              fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="${0.35 * f}" pointer-events="none"/>
      `;
    } 
    else if (o.type === 'greenhouse') {
      // High-Tech Solar Greenhouse with Structural Trusses
      markup += `
        <rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${0.6 * f}"
              fill="url(#glass-gradient)" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
      `;
      // Internal Structural Arch Trusses
      const ribs = Math.max(2, Math.floor(o.w / (5 * f)));
      for (let ri = 1; ri < ribs; ri++) {
        const rxPos = o.x + (o.w / ribs) * ri;
        markup += `
          <line x1="${rxPos}" y1="${o.y}" x2="${rxPos}" y2="${o.y + o.h}" 
                stroke="#00838f" stroke-width="${0.4 * f}" stroke-dasharray="${0.8 * f},${0.4 * f}" pointer-events="none"/>
        `;
      }
      // Center Spine Beam
      markup += `
        <line x1="${o.x}" y1="${o.y + o.h / 2}" x2="${o.x + o.w}" y2="${o.y + o.h / 2}" 
              stroke="#006064" stroke-width="${0.6 * f}" pointer-events="none"/>
      `;
    }

    // Name & Area Badge
    let displayName = o.nameEn || o.name;
    if (STATE.lang === 'te') displayName = o.nameTe || o.name;
    else if (STATE.lang === 'hi') displayName = o.nameHi || o.nameEn || o.name;

    const fontSize = Math.max(1.8 * f, Math.min(3.2 * f, o.w / (displayName.length * 0.55)));
    if (o.h > fontSize * 1.6) {
      markup += `
        <rect x="${o.x + o.w / 2 - (displayName.length * fontSize * 0.32)}" y="${o.y + o.h / 2 - fontSize * 1.1}" 
              width="${displayName.length * fontSize * 0.64}" height="${fontSize * 2.2}" rx="${0.5 * f}" 
              fill="rgba(0,0,0,0.65)" pointer-events="none"/>
        <text x="${o.x + o.w / 2}" y="${o.y + o.h / 2 - fontSize * 0.1}" 
              font-size="${fontSize}" font-weight="800" fill="#ffffff" text-anchor="middle" dominant-baseline="central" pointer-events="none">
          ${displayName}
        </text>
        <text x="${o.x + o.w / 2}" y="${o.y + o.h / 2 + fontSize * 0.85}" 
              font-size="${fontSize * 0.72}" font-weight="700" fill="#a9dfbf" text-anchor="middle" dominant-baseline="central" pointer-events="none">
          ${Math.round(o.w * o.h)} m²
        </text>
      `;
    }

    // Resize Handle if Selected
    if (isSelected) {
      markup += `
        <circle class="resize-handle" data-id="${o.id}" cx="${o.x + o.w}" cy="${o.y + o.h}" r="${1.8 * f}" 
                fill="#f39c12" stroke="#ffffff" stroke-width="${0.5 * f}" style="cursor: se-resize;" />
      `;
    }

    markup += `</g>`;
  });

  svg.innerHTML = markup;
  attachSvgEventListeners(svg);
  updateUtilizationSummary(analysis, p);
}

function attachSvgEventListeners(svg) {
  const p = getActiveParcel();

  svg.onmousedown = (e) => {
    const pt = getSvgPoint(svg, e);
    const target = e.target;

    if (target.classList.contains('resize-handle')) {
      const id = target.getAttribute('data-id');
      const obj = p.objs.find(o => o.id === id);
      if (obj) {
        startResizing(obj, pt, svg);
        return;
      }
    }

    const entityGroup = target.closest('.farm-entity');
    if (entityGroup) {
      const id = entityGroup.getAttribute('data-id');
      selectedObjId = id;
      const obj = p.objs.find(o => o.id === id);
      if (obj) {
        isDragging = true;
        activeDragObj = obj;
        dragOffset = { x: pt.x - obj.x, y: pt.y - obj.y };
      }
      render2D();
      return;
    }

    selectedObjId = null;
    render2D();
  };

  window.onmousemove = (e) => {
    if (!isDragging || !activeDragObj) return;
    const pt = getSvgPoint(svg, e);
    const newX = Math.round(pt.x - dragOffset.x);
    const newY = Math.round(pt.y - dragOffset.y);

    activeDragObj.x = Math.max(0, Math.min(p.L - activeDragObj.w, newX));
    activeDragObj.y = Math.max(0, Math.min(p.W - activeDragObj.h, newY));

    render2D();
    if (window.render3D) window.render3D();
  };

  window.onmouseup = () => {
    if (isDragging) {
      isDragging = false;
      activeDragObj = null;
      if (window.render3D) window.render3D();
    }
  };
}

function startResizing(obj, startPt, svg) {
  const p = getActiveParcel();
  const initialW = obj.w;
  const initialH = obj.h;

  function onMouseMove(e) {
    const currentPt = getSvgPoint(svg, e);
    const deltaX = currentPt.x - startPt.x;
    const deltaY = currentPt.y - startPt.y;

    obj.w = Math.max(4, Math.min(p.L - obj.x, initialW + deltaX));
    obj.h = Math.max(4, Math.min(p.W - obj.y, initialH + deltaY));

    render2D();
    if (window.render3D) window.render3D();
  }

  function onMouseUp() {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    if (window.render3D) window.render3D();
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

function updateUtilizationSummary(analysis, p) {
  const cropPct = ((analysis.cats.crop || 0) / analysis.totalArea * 100).toFixed(1);
  const orchardPct = ((analysis.cats.orchard || 0) / analysis.totalArea * 100).toFixed(1);
  const ghPct = ((analysis.cats.greenhouse || 0) / analysis.totalArea * 100).toFixed(1);
  const pondPct = ((analysis.cats.pond || 0) / analysis.totalArea * 100).toFixed(1);
  const emptyPct = (analysis.emptyArea / analysis.totalArea * 100).toFixed(1);

  const bar = document.getElementById('utilization-bar');
  if (bar) {
    bar.innerHTML = `
      <div class="land-util-segment" style="width: ${cropPct}%; background: #2e7d32;" title="Crops: ${cropPct}%"></div>
      <div class="land-util-segment" style="width: ${orchardPct}%; background: #1b4d2e;" title="Orchard: ${orchardPct}%"></div>
      <div class="land-util-segment" style="width: ${ghPct}%; background: #00838f;" title="Polyhouse: ${ghPct}%"></div>
      <div class="land-util-segment" style="width: ${pondPct}%; background: #0277bd;" title="Pond: ${pondPct}%"></div>
      <div class="land-util-segment" style="width: ${emptyPct}%; background: #d0d7d1;" title="Free/Roads: ${emptyPct}%"></div>
    `;
  }

  const statArea = document.getElementById('stat-total-area');
  const statPerimeter = document.getElementById('stat-perimeter');
  if (statArea) statArea.textContent = `${analysis.totalArea} m² (${(analysis.totalArea / 4046.86).toFixed(2)} Ac)`;
  if (statPerimeter) statPerimeter.textContent = `${2 * (p.L + p.W)} m`;
}

function autoGenerateBlueprint() {
  const p = getActiveParcel();
  p.objs = [
    {
      id: 'pond_' + Date.now(),
      type: 'pond',
      nameEn: 'Catchment Retention Pond',
      nameTe: 'వర్షపు నీటి నిల్వ కుంట',
      nameHi: 'वर्षा जल संचयन तालाब',
      x: Math.round(p.L * 0.72),
      y: Math.round(p.W * 0.68),
      w: Math.round(p.L * 0.22),
      h: Math.round(p.W * 0.25)
    },
    {
      id: 'gh_' + Date.now(),
      type: 'greenhouse',
      nameEn: 'Polyhouse (Solar E-W)',
      nameTe: 'పాలీహౌస్ (సూర్య అనుకూల)',
      nameHi: 'पॉलीहाउस (सौर पूर्व-पश्चिम)',
      x: 6,
      y: 6,
      w: Math.round(p.L * 0.24),
      h: Math.round(p.W * 0.2)
    },
    {
      id: 'crop_' + Date.now(),
      type: 'crop',
      nameEn: 'Organic Vegetable Beds',
      nameTe: 'సేంద్రీయ కూరగాయల బెడ్లు',
      nameHi: 'जैविक सब्जी की क्यारियां',
      x: 6,
      y: Math.round(p.W * 0.32),
      w: Math.round(p.L * 0.36),
      h: Math.round(p.W * 0.6)
    },
    {
      id: 'orchard_' + Date.now(),
      type: 'orchard',
      nameEn: 'High-Density Orchard',
      nameTe: 'సాంద్ర పండ్ల తోట (గ్రిడ్)',
      nameHi: 'सघन बागवानी ग्रिड',
      x: Math.round(p.L * 0.46),
      y: 6,
      w: Math.round(p.L * 0.48),
      h: Math.round(p.W * 0.58),
      spacing: 6,
      crop: 'mango'
    }
  ];

  selectedObjId = null;
  render2D();
  if (window.render3D) window.render3D();
  showToast(STATE.lang === 'en' ? 'Optimal Real-Life Layout Auto-Generated!' : (STATE.lang === 'te' ? 'స్మార్ట్ లేఅవుట్ విజయవంతంగా రూపొందించబడింది!' : 'इष्टतम लेआउट सफलतापूर्वक उत्पन्न किया गया!'));
}

function addNewEntity(type) {
  const p = getActiveParcel();
  const id = `${type}_${Date.now()}`;
  let newObj;

  if (type === 'crop') {
    newObj = { id, type: 'crop', nameEn: 'New Crop Zone', nameTe: 'కొత్త పంట బెడ్', nameHi: 'नई फसल क्यारी', x: 10, y: 10, w: 20, h: 25, crop: 'vegetables' };
  } else if (type === 'orchard') {
    newObj = { id, type: 'orchard', nameEn: 'Mango Orchard (6m)', nameTe: 'మామిడి తోట (6మీ)', nameHi: 'आम का बाग (6 मी.)', x: 35, y: 10, w: 30, h: 30, spacing: 6, crop: 'mango' };
  } else if (type === 'greenhouse') {
    newObj = { id, type: 'greenhouse', nameEn: 'Polyhouse Unit', nameTe: 'పాలీహౌస్ యూనిట్', nameHi: 'पॉलीहाउस इकाई', x: 10, y: 40, w: 18, h: 12 };
  } else if (type === 'pond') {
    newObj = { id, type: 'pond', nameEn: 'Retention Pond', nameTe: 'నీటి నిల్వ కుంట', nameHi: 'खेत तालाब', x: 40, y: 45, w: 18, h: 16 };
  }

  p.objs.push(newObj);
  selectedObjId = id;
  render2D();
  if (window.render3D) window.render3D();
  showToast(STATE.lang === 'en' ? 'New entity added' : (STATE.lang === 'te' ? 'కొత్త జోన్ జోడించబడింది' : 'नया क्षेत्र जोड़ा गया'));
}

function exportBlueprintImage() {
  const svg = document.getElementById('svg-canvas');
  if (!svg) return;

  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  canvas.width = 1600;
  canvas.height = 1100;

  img.onload = () => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0a1f13';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('AgriVision Real-Life Precision Farm Blueprint', 40, 50);
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#784212';
    ctx.fillText('Advisory Plan Only - Not a statutory land survey or engineering sign-off', 40, 80);

    const a = document.createElement('a');
    a.download = `AgriVision_Farm_Blueprint_${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    showToast(STATE.lang === 'en' ? 'Blueprint exported as high-res PNG!' : (STATE.lang === 'te' ? 'బ్లూప్రింట్ చిత్రం డౌన్‌లోడ్ చేయబడింది!' : 'ब्लूप्रिंट पीएनजी में निर्यात किया गया!'));
  };

  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}

window.render2D = render2D;
window.autoGenerateBlueprint = autoGenerateBlueprint;
window.addNewEntity = addNewEntity;
window.exportBlueprintImage = exportBlueprintImage;
window.TREE_SPECIES = TREE_SPECIES;
