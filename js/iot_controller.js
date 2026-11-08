/**
 * AgriVision - Module 5: Smart Water & Electricity Management (ESP32 IoT Integration)
 * Automated Closed-Loop Hysteresis Control (Pump ON < 30%, Pump OFF >= 65%)
 * Full multi-language support (English, Telugu, Hindi) with zero hardcoded language leakage.
 */

let simulationTimer = null;

function updateTelemetry(moisture, temp, humidity, tankLevel, power) {
  const t = STATE.telemetry;
  const l = STATE.lang;

  if (moisture !== undefined) t.moisture = Math.max(0, Math.min(100, Math.round(moisture)));
  if (temp !== undefined) t.temperature = parseFloat(temp.toFixed(1));
  if (humidity !== undefined) t.humidity = Math.round(humidity);
  if (tankLevel !== undefined) t.tankLevel = Math.round(tankLevel);
  if (power !== undefined) t.powerActive = !!power;

  // Closed-Loop Hysteresis Logic
  if (!t.manualOverride) {
    if (t.moisture < 30 && !t.pump) {
      t.pump = true;
      const msg = l === 'te' 
        ? '⚡ నేల తేమ < 30%: ESP32 డ్రిప్ పంప్‌ను ఆటోమేటిక్‌గా ఆన్ చేసింది!' 
        : (l === 'hi' ? '⚡ मिट्टी की नमी < 30%: ESP32 ने ड्रिप पंप स्वचालित चालू किया!' : '⚡ Soil Moisture < 30%: ESP32 auto-activated drip irrigation pump!');
      showToast(msg);
    } else if (t.moisture >= 65 && t.pump) {
      t.pump = false;
      const msg = l === 'te' 
        ? '💧 నేల సంతృప్త స్థాయి (65%) చేరింది: ESP32 పంప్‌ను ఆఫ్‌ చేసింది.' 
        : (l === 'hi' ? '💧 लक्षित नमी स्तर (65%) प्राप्त: ESP32 ने पंप बंद किया।' : '💧 Saturation (>= 65%) reached: ESP32 auto-deactivated pump.');
      showToast(msg);
    }
  }

  if (t.pump) {
    t.kwhAccumulated += 0.02;
  }

  renderIotDashboard();
  if (window.updateSubBarUI) window.updateSubBarUI();
}

function renderIotDashboard() {
  const t = STATE.telemetry;
  const l = STATE.lang;

  const labels = {
    en: {
      activeIrrigating: 'ACTIVE (Irrigating)',
      standbyOff: 'STANDBY (Standby)',
      manualOverride: 'Manual Override Active',
      autoIrrigating: 'Auto Hysteresis: Irrigating until 65% soil saturation is reached',
      autoWaiting: 'Auto Hysteresis: Waiting for soil moisture to drop below 30%',
      soilMoistureTitle: 'Capacitive Soil Moisture (GPIO 34)',
      soilMoistureSub: 'Thresholds: Turn ON < 30% | Turn OFF ≥ 65%',
      simulateSlider: 'Simulate Moisture Level:',
      runCycleBtn: '▶️ Run Full Irrigation Cycle Test',
      soilTempTitle: 'Soil Temperature (DHT22)',
      soilTempSub: 'Optimal Root Zone: 24°C – 32°C',
      ambientHumTitle: 'Ambient Humidity (DHT22)',
      ambientHumSub: 'Fungal risk threshold > 80%',
      tankLevelTitle: 'Farm Pond Storage Level',
      tankLevelSub: 'Estimated reserve: 14 days irrigation',
      elecTrackerTitle: 'Electricity & Energy Consumption Tracker (FR-5.3)',
      accumulatedPower: 'Accumulated Power:',
      subsidizedCost: 'Subsidized Cost (₹5.25/kWh):',
      watchdogStatus: 'ESP32 Fail-Safe Status:',
      watchdogActive: 'Active Watchdog (45 min max)'
    },
    te: {
      activeIrrigating: 'ఆన్ (నీటి సరఫరా జరుగుతోంది)',
      standbyOff: 'స్టాండ్‌బై (నిలిపివేయబడింది)',
      manualOverride: 'మాన్యువల్ కంట్రోల్ మోడ్ యాక్టివ్',
      autoIrrigating: 'ఆటోమేటిక్ హిస్టెరిసిస్: తేమ 65% వరకు నీరు అందుతుంది',
      autoWaiting: 'ఆటోమేటిక్ హిస్టెరిసిస్: తేమ 30% కంటే తగ్గితే ఆన్ అవుతుంది',
      soilMoistureTitle: 'కెపాసిటివ్ నేల తేమ (GPIO 34)',
      soilMoistureSub: 'పరిమితులు: ఆన్ < 30% | ఆఫ్‌ ≥ 65%',
      simulateSlider: 'తేమ స్థాయిని అనుకరించండి:',
      runCycleBtn: '▶️ పూర్తి నీటి సరఫరా సిమ్యులేషన్ పరీక్ష',
      soilTempTitle: 'నేల ఉష్ణోగ్రత (DHT22)',
      soilTempSub: 'అనుకూల వేరు ఉష్ణోగ్రత: 24°C – 32°C',
      ambientHumTitle: 'గాలిలో తేమ (DHT22)',
      ambientHumSub: 'శిలీంధ్రాల వ్యాప్తి సూచిక > 80%',
      tankLevelTitle: 'పొలం కుంట నీటి నిల్వ',
      tankLevelSub: 'అంచనా నిల్వ: 14 రోజుల సాగునీరు',
      elecTrackerTitle: 'విద్యుత్ వినియోగం & ఖర్చుల ట్రాకర్ (FR-5.3)',
      accumulatedPower: 'వినియోగించిన విద్యుత్:',
      subsidizedCost: 'సబ్సిడీ ధర (₹5.25/kWh):',
      watchdogStatus: 'ESP32 భద్రతా వాచ్‌డాగ్:',
      watchdogActive: 'క్రియాశీలం (45 నిమిషాల గరిష్టం)'
    },
    hi: {
      activeIrrigating: 'सक्रिय (सिंचाई जारी है)',
      standbyOff: 'स्टैंडबाय (पंप बंद है)',
      manualOverride: 'मैनुअल नियंत्रण मोड सक्रिय',
      autoIrrigating: 'स्वचालित हिस्टैरिसीस: 65% नमी तक सिंचाई चालू रहेगी',
      autoWaiting: 'स्वचालित हिस्टैरिसीस: 30% से कम नमी होने पर चालू होगा',
      soilMoistureTitle: 'कैपेसिटिव मृदा नमी (GPIO 34)',
      soilMoistureSub: 'सीमाएँ: चालू < 30% | बंद ≥ 65%',
      simulateSlider: 'नमी स्तर का परीक्षण करें:',
      runCycleBtn: '▶️ पूर्ण सिंचाई चक्र का परीक्षण करें',
      soilTempTitle: 'मृदा तापमान (DHT22)',
      soilTempSub: 'जड़ विकास क्षेत्र: 24°C – 32°C',
      ambientHumTitle: 'वातावरणीय आर्द्रता (DHT22)',
      ambientHumSub: 'फंगल संक्रमण जोखिम > 80%',
      tankLevelTitle: 'खेत तालाब जल संचयन स्तर',
      tankLevelSub: 'अनुमानित जल उपलब्धता: 14 दिन',
      elecTrackerTitle: 'बिजली एवं ऊर्जा खपत ट्रैकर (FR-5.3)',
      accumulatedPower: 'कुल बिजली खपत:',
      subsidizedCost: 'सब्सिडी दर (₹5.25/kWh):',
      watchdogStatus: 'ESP32 सुरक्षा वॉचडॉग:',
      watchdogActive: 'सक्रिय (अधिकतम 45 मिनट)'
    }
  };

  const dict = labels[l] || labels.en;

  // Update Dynamic Values
  const moistureVal = document.getElementById('iot-moisture-val');
  const tempVal = document.getElementById('iot-temp-val');
  const humVal = document.getElementById('iot-hum-val');
  const tankVal = document.getElementById('iot-tank-val');
  const pumpBadge = document.getElementById('iot-pump-badge');
  const pumpStatusText = document.getElementById('iot-pump-text');
  const kwhVal = document.getElementById('iot-kwh-val');
  const energyCostVal = document.getElementById('iot-energy-cost-val');
  const moistureSlider = document.getElementById('iot-moisture-slider');

  if (moistureVal) moistureVal.textContent = `${t.moisture}%`;
  if (tempVal) tempVal.textContent = `${t.temperature} °C`;
  if (humVal) humVal.textContent = `${t.humidity}% RH`;
  if (tankVal) tankVal.textContent = `${t.tankLevel}%`;
  if (kwhVal) kwhVal.textContent = `${t.kwhAccumulated.toFixed(2)} kWh`;
  if (energyCostVal) energyCostVal.textContent = `₹${(t.kwhAccumulated * 5.25).toFixed(1)}`;
  if (moistureSlider && document.activeElement !== moistureSlider) {
    moistureSlider.value = t.moisture;
  }

  // Card Pump Badge
  if (pumpBadge) {
    pumpBadge.className = `pump-status-badge ${t.pump ? 'on' : 'off'}`;
    pumpBadge.textContent = t.pump ? dict.activeIrrigating : dict.standbyOff;
  }

  if (pumpStatusText) {
    if (t.manualOverride) {
      pumpStatusText.textContent = dict.manualOverride;
    } else {
      pumpStatusText.textContent = t.pump ? dict.autoIrrigating : dict.autoWaiting;
    }
  }

  // Update Section Labels
  const moistTitleEl = document.getElementById('iot-moist-card-title');
  const moistSubEl = document.getElementById('iot-moist-card-sub');
  const simSliderLabel = document.getElementById('iot-sim-slider-label');
  const runSimBtn = document.getElementById('iot-run-sim-btn');
  const tempTitleEl = document.getElementById('iot-temp-title');
  const tempSubEl = document.getElementById('iot-temp-sub');
  const humTitleEl = document.getElementById('iot-hum-title');
  const humSubEl = document.getElementById('iot-hum-sub');
  const tankTitleEl = document.getElementById('iot-tank-title');
  const tankSubEl = document.getElementById('iot-tank-sub');
  const energyTitleEl = document.getElementById('iot-energy-title');
  const kwhLabel = document.getElementById('iot-kwh-label');
  const costLabel = document.getElementById('iot-cost-label');
  const watchdogLabel = document.getElementById('iot-watchdog-label');
  const watchdogVal = document.getElementById('iot-watchdog-val');

  if (moistTitleEl) moistTitleEl.textContent = dict.soilMoistureTitle;
  if (moistSubEl) moistSubEl.textContent = dict.soilMoistureSub;
  if (simSliderLabel) simSliderLabel.textContent = dict.simulateSlider;
  if (runSimBtn) runSimBtn.textContent = dict.runCycleBtn;
  if (tempTitleEl) tempTitleEl.textContent = dict.soilTempTitle;
  if (tempSubEl) tempSubEl.textContent = dict.soilTempSub;
  if (humTitleEl) humTitleEl.textContent = dict.ambientHumTitle;
  if (humSubEl) humSubEl.textContent = dict.ambientHumSub;
  if (tankTitleEl) tankTitleEl.textContent = dict.tankLevelTitle;
  if (tankSubEl) tankSubEl.textContent = dict.tankLevelSub;
  if (energyTitleEl) energyTitleEl.textContent = dict.elecTrackerTitle;
  if (kwhLabel) kwhLabel.textContent = dict.accumulatedPower;
  if (costLabel) costLabel.textContent = dict.subsidizedCost;
  if (watchdogLabel) watchdogLabel.textContent = dict.watchdogStatus;
  if (watchdogVal) watchdogVal.textContent = dict.watchdogActive;
}

function setPumpMode(mode) {
  const t = STATE.telemetry;
  const l = STATE.lang;

  if (mode === 'auto') {
    t.manualOverride = false;
    const msg = l === 'te' ? 'ఆటోమేటిక్ సెన్సార్ మోడ్ పునరుద్ధరించబడింది' : (l === 'hi' ? 'स्वचालित सेंसर मोड पुनः सक्रिय' : 'Restored Auto-Hysteresis Mode');
    showToast(msg);
  } else if (mode === 'on') {
    t.manualOverride = true;
    t.pump = true;
    const msg = l === 'te' ? 'పంప్ మాన్యువల్‌గా ఆన్ చేయబడింది' : (l === 'hi' ? 'पंप को मैनुअल रूप से चालू किया गया' : 'Force Pump ON Override');
    showToast(msg);
  } else if (mode === 'off') {
    t.manualOverride = true;
    t.pump = false;
    const msg = l === 'te' ? 'పంప్ మాన్యువల్‌గా నిలిపివేయబడింది' : (l === 'hi' ? 'पंप को मैनुअल रूप से बंद किया गया' : 'Force Pump OFF Override');
    showToast(msg);
  }
  renderIotDashboard();
  if (window.updateSubBarUI) window.updateSubBarUI();
}

function runMoistureSimulation() {
  const l = STATE.lang;
  if (simulationTimer) {
    clearInterval(simulationTimer);
    simulationTimer = null;
    const msg = l === 'te' ? 'సిమ్యులేషన్ ఆపివేయబడింది' : (l === 'hi' ? 'सिमुलेशन रोक दिया गया' : 'Simulation paused');
    showToast(msg);
    return;
  }

  STATE.telemetry.manualOverride = false;
  STATE.telemetry.moisture = 34;
  const startMsg = l === 'te' 
    ? 'ఆటోమేటిక్ నీటి ప్రవాహ సిమ్యులేషన్ ప్రారంభమైంది!' 
    : (l === 'hi' ? 'स्वचालित सिंचाई परीक्षण प्रारंभ हुआ!' : 'Started closed-loop irrigation simulation!');
  showToast(startMsg);

  let step = 0;
  simulationTimer = setInterval(() => {
    const t = STATE.telemetry;
    step++;

    if (!t.pump) {
      t.moisture = Math.max(18, t.moisture - 2);
    } else {
      t.moisture = Math.min(75, t.moisture + 3);
    }

    updateTelemetry(t.moisture, 29.2 + Math.random() * 0.8, 62 + Math.random() * 3);

    if (step > 30) {
      clearInterval(simulationTimer);
      simulationTimer = null;
    }
  }, 1000);
}

window.updateTelemetry = updateTelemetry;
window.renderIotDashboard = renderIotDashboard;
window.setPumpMode = setPumpMode;
window.runMoistureSimulation = runMoistureSimulation;
