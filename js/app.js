/**
 * AgriVision - Global Application State, Profile Management & Multi-Language Engine
 * Supports English (en), Telugu (te), and Hindi (hi)
 */

// Master Application State
const STATE = {
  lang: 'en',             // Default language set to English per user request
  theme: 'light',         // 'light' or 'dark'
  activeTab: 'planner',   // 'planner', 'optimizer', 'advisor', 'pathology', 'iot', 'calendar', 'profile'
  activeParcelId: 'parcel_main',
  voiceActive: false,
  profile: {
    farmerName: 'Vijay Kumar',
    phone: '+91 98480 22338',
    village: 'Anakapalli Rural',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    kvkCenter: 'KVK Kondempudi, Anakapalli',
    defaultUnits: 'acres', // 'acres', 'hectares'
    irrigationType: 'drip',
    pumpHp: '3.0 HP',
    borewellDepthFt: 280,
    espNodeIp: '192.168.1.100',
    syncIntervalSec: 3,
    airAdcValue: 3200,
    waterAdcValue: 1450
  },
  parcels: [
    {
      id: 'parcel_main',
      nameEn: 'Apparao Plot 1 (Anakapalli)',
      nameTe: 'అప్పారావు పొలం 1 (అనకాపల్లి)',
      nameHi: 'अप्पाराव खेत 1 (अनकापल्ली)',
      acres: 2.5,
      L: 100, // meters length
      W: 80,  // meters width
      soilType: 'red_loam',
      waterSource: 'borewell',
      borewellYieldLph: 2400,
      crop: 'guava_veg',
      farmingMethod: 'integrated',
      objs: [
        { id: 'pond_1', type: 'pond', name: 'Rainwater Retention Pond', nameTe: 'వర్షపు నీటి నిల్వ కుంట', nameHi: 'वर्षा जल संचयन तालाब', x: 74, y: 56, w: 20, h: 18 },
        { id: 'gh_1', type: 'greenhouse', name: 'Polyhouse Greenhouse', nameTe: 'పాలీహౌస్ గ్రీన్‌హౌస్', nameHi: 'पॉलीहाउस ग्रीनहाउस', x: 6, y: 6, w: 22, h: 14 },
        { id: 'crop_1', type: 'crop', name: 'High-Yield Chili & Veg Beds', nameTe: 'మిరప & కూరగాయల బెడ్లు', nameHi: 'मिर्च एवं सब्जी की क्यारियां', x: 6, y: 24, w: 32, h: 48, crop: 'chili' },
        { id: 'orchard_1', type: 'orchard', name: 'Taiwan Guava Orchard (3m)', nameTe: 'జామ పండ్ల తోట (3మీ గ్రిడ్)', nameHi: 'अमरूद का बाग (3 मी. ग्रिड)', x: 42, y: 6, w: 52, h: 46, spacing: 3, crop: 'guava' }
      ]
    },
    {
      id: 'parcel_dryland',
      nameEn: 'Lakshmi Semi-Arid Plot (Vizianagaram)',
      nameTe: 'లక్ష్మి మెట్ట భూమి (విజయనగరం)',
      nameHi: 'लक्ष्मी शुष्क भूमि (विजयनगरम)',
      acres: 4.0,
      L: 140,
      W: 115,
      soilType: 'black_clay',
      waterSource: 'limited_borewell',
      borewellYieldLph: 1800,
      crop: 'millets_mango',
      farmingMethod: 'organic',
      objs: [
        { id: 'pond_dry', type: 'pond', name: 'Farm Pond Catchment', nameTe: 'చెరువు నిల్వ గుంట', nameHi: 'खेत तालाब जलाशय', x: 105, y: 80, w: 26, h: 26 },
        { id: 'orchard_mango', type: 'orchard', name: 'Mango Orchard (6m Grid)', nameTe: 'మామిడి తోట (6మీ స్పేసింగ్)', nameHi: 'आम का बाग (6 मी. ग्रिड)', x: 8, y: 8, w: 70, h: 95, spacing: 6, crop: 'mango' },
        { id: 'crop_millet', type: 'crop', name: 'Finger Millet (Ragi) Zone', nameTe: 'రాగి / చిరుధాన్యాల జోన్', nameHi: 'रागी / मोटा अनाज क्षेत्र', x: 84, y: 8, w: 46, h: 65, crop: 'millet' }
      ]
    }
  ],
  telemetry: {
    moisture: 28,      // percentage
    temperature: 29.4, // deg C
    humidity: 62,      // percentage RH
    tankLevel: 78,     // percentage
    pump: true,        // true = pump ON, false = pump OFF
    powerActive: true, // 3-phase grid electricity status
    manualOverride: false,
    kwhAccumulated: 4.82
  }
};

// Trilingual Translation Dictionary (English, Telugu, Hindi)
const I18N = {
  en: {
    brandName: 'AgriVision',
    brandTag: 'Precision 2D/3D Farm Planning & Smart IoT Platform',
    tabPlanner: 'Farm Designer',
    tabOptimizer: 'Method Optimizer',
    tabAdvisor: 'Crop & Fertilizer',
    tabPathology: 'Disease Scanner',
    tabIot: 'Smart Water (ESP32)',
    tabCalendar: 'Weather & Calendar',
    tabProfile: 'Settings',
    tabSettings: 'Settings',
    navPlanner: 'Plan',
    navOptimizer: 'Methods',
    navAdvisor: 'Crops',
    navPathology: 'Scan',
    navIot: 'Water',
    navCalendar: 'Weather',
    navSettings: 'Settings',
    parcelLabel: 'Active Parcel:',
    soilMoisture: 'Soil Moisture',
    pumpRunning: 'Pump: ACTIVE',
    pumpStandby: 'Pump: STANDBY',
    powerOn: '3-Phase Grid Active',
    powerOff: 'Power Outage',
    dimLength: 'Length (m)',
    dimWidth: 'Width (m)',
    plotArea: 'Total Area',
    perimeter: 'Perimeter',
    acres: 'Acres',
    sqm: 'sq.m',
    generateBlueprint: 'Auto-Generate Blueprint',
    addCropBed: '+ Crop Bed',
    addOrchard: '+ Orchard Grid',
    addGreenhouse: '+ Polyhouse',
    addPond: '+ Retention Pond',
    exportBlueprint: 'Export Blueprint',
    collisionDetected: 'Warning: Spatial Overlap / Boundary Breach Detected!',
    disclaimer: 'Advisory Notice: AgriVision layout is for decision support only and not a statutory land survey or engineering sign-off.',
    speakStatus: 'Play Voice Overview',
    voiceListening: 'Listening to speech...',
    voiceAssistant: 'Voice Assistant',
    voiceClickPrompt: 'Tap mic to speak',
    seasonLabel: 'Season:',
    soilLabel: 'Soil Classification:',
    waterLabel: 'Water Source:',
    phLabel: 'Soil pH:'
  },
  te: {
    brandName: 'అగ్రివిజన్',
    brandTag: 'రైతు కేంద్రిత 2D/3D ప్రణాళిక & స్మార్ట్ ఇరిగేషన్ ప్లాట్‌ఫామ్',
    tabPlanner: 'పొలం డిజైనర్',
    tabOptimizer: 'వ్యవసాయ పద్ధతులు',
    tabAdvisor: 'పంట & ఎరువులు',
    tabPathology: 'తెగుళ్ల స్కానర్',
    tabIot: 'స్మార్ట్ నీరు & పంప్',
    tabCalendar: 'వాతావరణం & పనులు',
    tabProfile: 'సెట్టింగ్‌లు',
    tabSettings: 'సెట్టింగ్‌లు',
    navPlanner: 'ప్లాన్',
    navOptimizer: 'పద్ధతులు',
    navAdvisor: 'పంటలు',
    navPathology: 'స్కాన్',
    navIot: 'నీరు',
    navCalendar: 'వాతావరణం',
    navSettings: 'సెట్టింగ్స్',
    parcelLabel: 'కమతం ఎంపిక:',
    soilMoisture: 'నేల తేమ',
    pumpRunning: 'పంప్: నడుస్తోంది',
    pumpStandby: 'పంప్: నిలిపివేయబడింది',
    powerOn: '3-ఫేజ్ కరెంట్ ఉంది',
    powerOff: 'కరెంట్ లేదు',
    dimLength: 'పొడవు (మీటర్లు)',
    dimWidth: 'వెడల్పు (మీటర్లు)',
    plotArea: 'మొత్తం విస్తీర్ణం',
    perimeter: 'చుట్టుకొలత',
    acres: 'ఎకరాలు',
    sqm: 'చ.మీటర్లు',
    generateBlueprint: 'స్మార్ట్ లేఅవుట్ సృష్టించు',
    addCropBed: '+ కూరగాయల బెడ్',
    addOrchard: '+ పండ్ల తోట',
    addGreenhouse: '+ పాలీహౌస్',
    addPond: '+ నీటి కుంట',
    exportBlueprint: 'బ్లూప్రింట్ డౌన్‌లోడ్',
    collisionDetected: 'హెచ్చరిక: జోన్‌లు ఒకదానిపై ఒకటి ఆక్రమించాయి!',
    disclaimer: 'గమనిక: అగ్రివిజన్ ప్లాన్ సమాచార సలహా కొరకు మాత్రమే. ఇది అధికారిక సర్వే లేదా ఇంజనీరింగ్ ధృవీకరణ కాదు.',
    speakStatus: 'వాయిస్ ఓవర్‌వ్యూ వినండి',
    voiceListening: 'వాయిస్ వింటోంది...',
    voiceAssistant: 'వాయిస్ సలహాదారు',
    voiceClickPrompt: 'మాట్లాడటానికి మైక్ నొక్కండి',
    seasonLabel: 'రుతువు / సీజన్:',
    soilLabel: 'నేల రకం:',
    waterLabel: 'నీటి వనరు:',
    phLabel: 'నేల pH విలువ:'
  },
  hi: {
    brandName: 'एग्रीविज़न',
    brandTag: 'सटीक 2D/3D खेत योजना एवं स्मार्ट IoT सिंचाई प्लेटफॉर्म',
    tabPlanner: 'खेत डिज़ाइनर',
    tabOptimizer: 'कृषि पद्धतियाँ',
    tabAdvisor: 'फसल एवं खाद',
    tabPathology: 'रोग स्कैनर',
    tabIot: 'स्मार्ट जल (ESP32)',
    tabCalendar: 'मौसम एवं कार्य',
    tabProfile: 'सेटिंग्स',
    tabSettings: 'सेटिंग्स',
    navPlanner: 'प्लान',
    navOptimizer: 'पद्धति',
    navAdvisor: 'फसल',
    navPathology: 'स्कैन',
    navIot: 'सिंचाई',
    navCalendar: 'मौसम',
    navSettings: 'सेटिंग्स',
    parcelLabel: 'सक्रिय खेत:',
    soilMoisture: 'मिट्टी की नमी',
    pumpRunning: 'पंप: चालू है',
    pumpStandby: 'पंप: बंद है',
    powerOn: '3-फेज बिजली उपलब्ध',
    powerOff: 'बिजली कटौती',
    dimLength: 'लंबाई (मीटर)',
    dimWidth: 'चौड़ाई (मीटर)',
    plotArea: 'कुल क्षेत्रफल',
    perimeter: 'परिधि',
    acres: 'एकड़',
    sqm: 'वर्ग मीटर',
    generateBlueprint: 'स्मार्ट लेआउट बनाएं',
    addCropBed: '+ फसल क्यारी',
    addOrchard: '+ बागवानी ग्रिड',
    addGreenhouse: '+ पॉलीहाउस',
    addPond: '+ खेत तालाब',
    exportBlueprint: 'ब्लूप्रिंट डाउनलोड',
    collisionDetected: 'चेतावनी: भू-स्थानिक अतिव्यापन / सीमा उल्लंघन का पता चला!',
    disclaimer: 'सलाहकारी सूचना: एग्रीविज़न लेआउट केवल निर्णय सहायता हेतु है, यह वैधानिक भूमि सर्वेक्षण नहीं है।',
    speakStatus: 'ध्वनि विवरण सुनें',
    voiceListening: 'आवाज़ सुन रहा है...',
    voiceAssistant: 'आवाज़ सहायक',
    voiceClickPrompt: 'बोलने के लिए माइक दबाएं',
    seasonLabel: 'मौसम / ऋतु:',
    soilLabel: 'मिट्टी का प्रकार:',
    waterLabel: 'जल स्रोत:',
    phLabel: 'मिट्टी का पीएच:'
  }
};

// Retrieve active farm parcel
function getActiveParcel() {
  return STATE.parcels.find(p => p.id === STATE.activeParcelId) || STATE.parcels[0];
}

// Language switch handler
function setLanguage(lang) {
  if (!I18N[lang]) lang = 'en';
  STATE.lang = lang;

  // Update data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[lang] && I18N[lang][key]) {
      el.textContent = I18N[lang][key];
    }
  });

  // Sync language dropdown
  const langSelect = document.getElementById('lang-select');
  if (langSelect && langSelect.value !== lang) {
    langSelect.value = lang;
  }

  // Update dynamic parcel options
  updateParcelSelectorUI();
  updateSubBarUI();

  // Re-render active and background modules
  if (window.render2D) window.render2D();
  if (window.render3D) window.render3D();
  if (window.updateOptimizerUI) window.updateOptimizerUI();
  if (window.updateAdvisorUI) window.updateAdvisorUI();
  if (window.renderIotDashboard) window.renderIotDashboard();
  if (window.renderWeatherAndCalendar) window.renderWeatherAndCalendar();
  if (window.renderProfileUI) window.renderProfileUI();

  showToast(lang === 'en' ? 'Language switched to English' : (lang === 'te' ? 'భాష తెలుగులోకి మార్చబడింది' : 'भाषा हिन्दी में बदल दी गई है'));
}

// Update Top Sub-Bar Badges based on active language
function updateSubBarUI() {
  const t = STATE.telemetry;
  const l = STATE.lang;
  const dict = I18N[l] || I18N.en;

  const subMoist = document.getElementById('sub-moist-badge');
  const subPump = document.getElementById('sub-pump-badge');
  const subPower = document.getElementById('sub-power-badge');

  if (subMoist) {
    subMoist.textContent = `${dict.soilMoisture}: ${t.moisture}%`;
  }
  if (subPump) {
    subPump.className = `t-badge ${t.pump ? 'good' : 'warn'}`;
    subPump.textContent = t.pump ? `💧 ${dict.pumpRunning}` : `⏸️ ${dict.pumpStandby}`;
  }
  if (subPower) {
    subPower.className = `t-badge ${t.powerActive ? 'good' : 'alert'}`;
    subPower.textContent = t.powerActive ? `⚡ ${dict.powerOn}` : `⚠️ ${dict.powerOff}`;
  }

  const voicePillLabel = document.querySelector('#voice-status-pill .voice-label');
  if (voicePillLabel) {
    voicePillLabel.textContent = dict.voiceAssistant;
  }
}

// Theme switch handler
function toggleTheme() {
  STATE.theme = STATE.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', STATE.theme);
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.textContent = STATE.theme === 'light' ? '☀️' : '🌙';
  }
  if (window.update3DTheme) window.update3DTheme(STATE.theme);
  if (window.render2D) window.render2D();
}

// Tab navigation handler
function switchTab(tabId) {
  if (tabId === 'profile') tabId = 'settings';
  STATE.activeTab = tabId;
  document.querySelectorAll('.mobile-nav-item, .nav-tab-btn').forEach(btn => {
    const bTab = btn.getAttribute('data-tab');
    btn.classList.toggle('active', bTab === tabId || (tabId === 'settings' && (bTab === 'settings' || bTab === 'profile')));
  });
  document.querySelectorAll('.tab-pane').forEach(pane => {
    const isTarget = pane.id === `tab-${tabId}` || (tabId === 'settings' && (pane.id === 'tab-settings' || pane.id === 'tab-profile'));
    pane.classList.toggle('active', isTarget);
    pane.style.display = isTarget ? 'block' : 'none';
  });

  if (tabId === 'planner') {
    setTimeout(() => {
      if (window.resize3D) window.resize3D();
      if (window.render2D) window.render2D();
    }, 50);
  } else if (tabId === 'advisor' && window.updateAdvisorUI) {
    window.updateAdvisorUI();
  } else if ((tabId === 'settings' || tabId === 'profile') && window.renderProfileUI) {
    window.renderProfileUI();
  }
}

// Toast notification helper
function showToast(message, duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Populate and refresh parcel selector
function updateParcelSelectorUI() {
  const sel = document.getElementById('parcel-select');
  if (!sel) return;
  sel.innerHTML = '';
  STATE.parcels.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    if (STATE.lang === 'te') opt.textContent = p.nameTe;
    else if (STATE.lang === 'hi') opt.textContent = p.nameHi || p.nameEn;
    else opt.textContent = p.nameEn;
    opt.selected = p.id === STATE.activeParcelId;
    sel.appendChild(opt);
  });
}

// Save profile state to localStorage
function saveProfileState() {
  try {
    localStorage.setItem('agrivision_profile', JSON.stringify(STATE.profile));
    localStorage.setItem('agrivision_lang', STATE.lang);
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
}

// Load profile state from localStorage
function loadProfileState() {
  try {
    const saved = localStorage.getItem('agrivision_profile');
    if (saved) {
      STATE.profile = Object.assign(STATE.profile, JSON.parse(saved));
    }
    const savedLang = localStorage.getItem('agrivision_lang');
    if (savedLang && I18N[savedLang]) {
      STATE.lang = savedLang;
    }
  } catch (e) {
    console.warn('localStorage load failed:', e);
  }
}

// Global App Initialization
window.addEventListener('DOMContentLoaded', () => {
  loadProfileState();
  document.documentElement.setAttribute('data-theme', STATE.theme);
  
  // Setup tab buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
  });

  // Setup Language Selector Dropdown
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.value = STATE.lang;
    langSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value);
      saveProfileState();
    });
  }

  // Setup Theme Toggle
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Setup Parcel Selector
  const parcelSel = document.getElementById('parcel-select');
  if (parcelSel) {
    parcelSel.addEventListener('change', (e) => {
      STATE.activeParcelId = e.target.value;
      if (window.render2D) window.render2D();
      if (window.render3D) window.render3D();
      if (window.updateOptimizerUI) window.updateOptimizerUI();
      if (window.updateAdvisorUI) window.updateAdvisorUI();
      if (window.renderWeatherAndCalendar) window.renderWeatherAndCalendar();
      showToast(STATE.lang === 'en' ? 'Switched active parcel' : (STATE.lang === 'te' ? 'కమతం మార్చబడింది' : 'सक्रिय खेत बदला गया'));
    });
  }

  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(() => {
      console.log('[AgriVision] Service Worker active');
    }).catch(err => {
      console.warn('[AgriVision] Service Worker registration failed:', err);
    });
  }

  // Initial text hydration in English (default)
  setLanguage(STATE.lang);
});

window.setLanguage = setLanguage;
window.switchTab = switchTab;
window.showToast = showToast;
window.getActiveParcel = getActiveParcel;
window.updateSubBarUI = updateSubBarUI;
window.saveProfileState = saveProfileState;
