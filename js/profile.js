/**
 * AgriVision - Profile & Farm System Settings Manager
 * Manages farmer profile, regional KVK preferences, and ESP32 hardware configurations
 */

function renderProfileUI() {
  const container = document.getElementById('profile-content-container');
  if (!container) return;

  const p = (window.STATE && window.STATE.profile) ? window.STATE.profile : {
    farmerName: 'Apparao Nimmana',
    phone: '+91 98480 22338',
    village: 'Anakapalli Rural',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    kvkCenter: 'KVK Kondempudi, Anakapalli (ANGRAU)',
    defaultUnits: 'acres',
    irrigationType: 'drip',
    pumpHp: '5.0 HP Submersible',
    borewellDepthFt: 280,
    espNodeIp: '192.168.4.1',
    syncIntervalSec: 3,
    airAdcValue: 3200,
    waterAdcValue: 1450
  };

  const l = (window.STATE && window.STATE.lang) ? window.STATE.lang : 'en';
  const currentUser = (window.DB && window.DB.getCurrentUser) ? window.DB.getCurrentUser() : null;

  const labels = {
    en: {
      settingsMainTitle: 'Settings & Preferences',
      systemStatus: 'System v1.3.0',
      accountTitle: 'Account & Active Session',
      switchAccountBtn: 'Switch Account',
      signOutBtn: 'Sign Out',
      displayTitle: 'Language & Display Settings',
      activeLang: 'Active App Language:',
      themeLabel: 'App Color Theme:',
      themeLight: '☀️ Light Theme',
      themeDark: '🌙 Dark / Field Mode',
      gridSnapLabel: '2D Blueprint Grid Snap:',
      farmSettingsTitle: 'Farm Land & Irrigation Settings',
      defaultUnits: 'Default Land Measurement Unit:',
      irrigation: 'Primary Irrigation Delivery System:',
      pumpHp: 'Borewell Pump Rating (HP):',
      borewellDepth: 'Borewell Aquifer Depth (Feet):',
      pumpThresholdsTitle: 'Smart Pump Automation Thresholds',
      pumpOnLabel: 'Auto-Start Pump Trigger (Soil Moisture < %):',
      pumpOffLabel: 'Auto-Stop Pump Trigger (Soil Moisture >= %):',
      pumpOnHelp: 'Turns irrigation pump ON when soil moisture falls below this limit.',
      pumpOffHelp: 'Shuts pump OFF to prevent waterlogging and root rot.',
      iotTitle: 'ESP32 Telemetry & Sensor Calibration',
      nodeIp: 'ESP32 Node IP Address:',
      syncInterval: 'Telemetry Frequency (Seconds):',
      airCalib: 'Capacitive Air ADC (Dry 0% Moisture):',
      waterCalib: 'Capacitive Water ADC (Wet 100% Moisture):',
      profileTitle: 'Farmer Profile & KVK Center',
      fullName: 'Full Name:',
      phone: 'Mobile Number:',
      village: 'Village / Hamlet:',
      district: 'District & State:',
      kvk: 'Assigned KVK Center:',
      saveBtn: 'Save Settings',
      exportBtn: 'Export Farm Data (JSON)'
    },
    te: {
      settingsMainTitle: 'సిస్టమ్ సెట్టింగ్‌లు & వివరాలు',
      systemStatus: 'సిస్టమ్ v1.3.0',
      accountTitle: 'రైతు ఖాతా & లాగిన్ వివరాలు',
      switchAccountBtn: 'ఖాతా మార్చండి',
      signOutBtn: 'లాగ్ అవుట్',
      displayTitle: 'భాష & డిస్‌ప్లే సెట్టింగ్‌లు',
      activeLang: 'యాప్ ప్రస్తుత భాష:',
      themeLabel: 'యాప్ థీమ్ రంగు:',
      themeLight: '☀️ లైట్ మోడ్',
      themeDark: '🌙 డార్క్ ఫీల్డ్ మోడ్',
      gridSnapLabel: '2D బ్లూప్రింట్ గ్రిడ్ స్నాప్:',
      farmSettingsTitle: 'భూమి & సాగునీటి సెట్టింగ్‌లు',
      defaultUnits: 'కొలత ప్రమాణం:',
      irrigation: 'ప్రధాన సాగునీటి వ్యవస్థ:',
      pumpHp: 'బోర్‌వెల్ పంప్ సామర్థ్యం (HP):',
      borewellDepth: 'బోర్‌వెల్ లోతు (అడుగులు):',
      pumpThresholdsTitle: 'స్మార్ట్ పంప్ ఆటోమేషన్ పరిమితులు',
      pumpOnLabel: 'పంప్ ఆటో-ఆన్ పరిమితి (తేమ < %):',
      pumpOffLabel: 'పంప్ ఆటో-ఆఫ్ పరిమితి (తేమ >= %):',
      pumpOnHelp: 'నేలలో తేమ ఈ స్థాయి కన్నా తగ్గినప్పుడు పంప్ ఆటోమేటిక్‌గా మొదలవుతుంది.',
      pumpOffHelp: 'అధిక నీటి వలన పంట దెబ్బతినకుండా పంప్ ఆటోమేటిక్‌గా ఆగిపోతుంది.',
      iotTitle: 'ESP32 హార్డ్‌వేర్ & సెన్సార్ క్యాలిబ్రేషన్',
      nodeIp: 'ESP32 నోడ్ ఐపీ అడ్రస్:',
      syncInterval: 'డేటా సమయం (సెకన్లు):',
      airCalib: 'గాలిలో ADC రీడింగ్ (0% తేమ):',
      waterCalib: 'నీటిలో ADC రీడింగ్ (100% తేమ):',
      profileTitle: 'రైతు ప్రొఫైల్ & కేవీకే కేంద్రం',
      fullName: 'రైతు పూర్తి పేరు:',
      phone: 'మొబైల్ నంబర్:',
      village: 'గ్రామం / మండలం:',
      district: 'జిల్లా & రాష్ట్రం:',
      kvk: 'సమీప కేవీకే విస్తరణ కేంద్రం:',
      saveBtn: 'సెట్టింగ్‌లను భద్రపరచండి',
      exportBtn: 'డేటా ఎగుమతి (JSON)'
    },
    hi: {
      settingsMainTitle: 'सिस्टम सेटिंग्स एवं प्राथमिकताएं',
      systemStatus: 'सिस्टम v1.3.0',
      accountTitle: 'किसान खाता एवं सक्रिय सत्र',
      switchAccountBtn: 'खाता बदलें',
      signOutBtn: 'लॉग आउट',
      displayTitle: 'भाषा एवं डिस्प्ले सेटिंग्स',
      activeLang: 'ऐप की सक्रिय भाषा:',
      themeLabel: 'कलर थीम:',
      themeLight: '☀️ लाइट थीम',
      themeDark: '🌙 डार्क फील्ड मोड',
      gridSnapLabel: '2D ब्लूप्रिंट ग्रिड स्नैप:',
      farmSettingsTitle: 'भूमि एवं सिंचाई सेटिंग्स',
      defaultUnits: 'भूमि मापन इकाई:',
      irrigation: 'मुख्य सिंचाई प्रणाली:',
      pumpHp: 'बोरवेल पंप क्षमता (HP):',
      borewellDepth: 'बोरवेल गहराई (फीट):',
      pumpThresholdsTitle: 'स्मार्ट पंप ऑटोमेशन सीमाएं',
      pumpOnLabel: 'पंप ऑटो-ऑन सीमा (नमी < %):',
      pumpOffLabel: 'पंप ऑटो-ऑफ सीमा (नमी >= %):',
      pumpOnHelp: 'नमी इस प्रतिशत से कम होने पर सिंचाई पंप अपने आप चालू होगा।',
      pumpOffHelp: 'अत्यधिक जलभराव रोकने के लिए इस प्रतिशत पर पंप अपने आप बंद होगा।',
      iotTitle: 'ESP32 टेलीमेट्री एवं सेंसर कैलिब्रेशन',
      nodeIp: 'ESP32 नोड आईपी पता:',
      syncInterval: 'टेलीमेट्री अंतराल (सेकंड):',
      airCalib: 'शुष्क वायु ADC मान (0% नमी):',
      waterCalib: 'जलमग्न ADC मान (100% नमी):',
      profileTitle: 'किसान प्रोफ़ाइल एवं केवीके केंद्र',
      fullName: 'पूरा नाम:',
      phone: 'मोबाइल नंबर:',
      village: 'गाँव / क्षेत्र:',
      district: 'जिला एवं राज्य:',
      kvk: 'निकटतम केवीके केंद्र:',
      saveBtn: 'सेटिंग्स सुरक्षित करें',
      exportBtn: 'डेटा निर्यात करें (JSON)'
    }
  };

  const t = labels[l] || labels.en;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 14px;">
      
      <!-- Settings Header Banner -->
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 6px;">
        <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 8px;">
          <span>⚙️</span> <span>${t.settingsMainTitle}</span>
        </h3>
        <span style="font-size: 0.72rem; background: var(--bg-card); border: 1px solid var(--border-color); padding: 3px 8px; border-radius: 12px; font-weight: 700; color: var(--primary);">
          🟢 ${t.systemStatus}
        </span>
      </div>

      <!-- 1. Account & Active Farmer Session -->
      <div class="card" style="border-left: 5px solid var(--primary);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 2rem;">${currentUser?.avatar || '👨‍🌾'}</span>
            <div>
              <div style="font-size: 1rem; font-weight: 800; color: var(--text-primary);">${currentUser?.name || p.farmerName}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${currentUser?.email || 'apparao@agrivision.in'}</div>
            </div>
          </div>
          <span style="background: rgba(46, 204, 113, 0.15); color: var(--primary); font-size: 0.72rem; font-weight: 800; padding: 4px 10px; border-radius: 12px; text-transform: uppercase;">
            ${currentUser?.role || 'FARMER'}
          </span>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="showAuthModal('login')">
            🔄 ${t.switchAccountBtn}
          </button>
          <button class="btn btn-danger btn-sm" onclick="handleSignOut()">
            🚪 ${t.signOutBtn}
          </button>
        </div>
      </div>

      <!-- 2. Language & Display Settings -->
      <div class="card">
        <div class="card-title">
          <span>🌐</span> ${t.displayTitle}
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label">${t.activeLang}</label>
          <select id="settings-lang-select" class="form-control" onchange="setLanguage(this.value); renderProfileUI();">
            <option value="en" ${l === 'en' ? 'selected' : ''}>English</option>
            <option value="te" ${l === 'te' ? 'selected' : ''}>తెలుగు (Telugu)</option>
            <option value="hi" ${l === 'hi' ? 'selected' : ''}>हिन्दी (Hindi)</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label">${t.themeLabel}</label>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="if(window.STATE.theme !== 'light') toggleTheme();">
              ${t.themeLight}
            </button>
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="if(window.STATE.theme !== 'dark') toggleTheme();">
              ${t.themeDark}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">${t.gridSnapLabel}</label>
          <select id="settings-grid-snap" class="form-control">
            <option value="5" selected>5.0 Meters (Standard CAD)</option>
            <option value="1">1.0 Meter (Precision Micro)</option>
            <option value="10">10.0 Meters (Orchard Macro)</option>
          </select>
        </div>
      </div>

      <!-- 3. Farm Land & Irrigation Configuration -->
      <div class="card">
        <div class="card-title">
          <span>🚜</span> ${t.farmSettingsTitle}
        </div>
        
        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label">${t.defaultUnits}</label>
          <select id="prof-units" class="form-control">
            <option value="acres" ${p.defaultUnits === 'acres' ? 'selected' : ''}>Acres (ఎకరాలు / एकड़)</option>
            <option value="hectares" ${p.defaultUnits === 'hectares' ? 'selected' : ''}>Hectares (హెక్టార్లు / हेक्टेयर)</option>
            <option value="guntas" ${p.defaultUnits === 'guntas' ? 'selected' : ''}>Guntas (40 guntas = 1 acre)</option>
            <option value="cents" ${p.defaultUnits === 'cents' ? 'selected' : ''}>Cents (100 cents = 1 acre)</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label">${t.irrigation}</label>
          <select id="prof-irrigation" class="form-control">
            <option value="drip" ${p.irrigationType === 'drip' ? 'selected' : ''}>Precision Drip (బిందు సేద్యం / ड्रिप)</option>
            <option value="sprinkler" ${p.irrigationType === 'sprinkler' ? 'selected' : ''}>Micro-Sprinkler (తుంపర సేద్యం)</option>
            <option value="flood" ${p.irrigationType === 'flood' ? 'selected' : ''}>Controlled Furrow (కాలువ తడులు)</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label">${t.pumpHp}</label>
          <input type="text" id="prof-pumphp" class="form-control" value="${p.pumpHp || '5.0 HP Submersible'}">
        </div>

        <div class="form-group">
          <label class="form-label">${t.borewellDepth}</label>
          <input type="number" id="prof-depth" class="form-control" value="${p.borewellDepthFt || 280}">
        </div>
      </div>

      <!-- 4. Smart Irrigation & Pump Thresholds -->
      <div class="card">
        <div class="card-title">
          <span>💧</span> ${t.pumpThresholdsTitle}
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label">${t.pumpOnLabel}</label>
          <input type="number" id="settings-pump-on-thresh" class="form-control" value="30" min="15" max="50">
          <small style="color: var(--text-muted); font-size: 0.72rem;">${t.pumpOnHelp}</small>
        </div>

        <div class="form-group">
          <label class="form-label">${t.pumpOffLabel}</label>
          <input type="number" id="settings-pump-off-thresh" class="form-control" value="65" min="50" max="90">
          <small style="color: var(--text-muted); font-size: 0.72rem;">${t.pumpOffHelp}</small>
        </div>
      </div>

      <!-- 5. IoT Hardware & ESP32 Telemetry Calibration -->
      <div class="card">
        <div class="card-title">
          <span>📡</span> ${t.iotTitle}
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label">${t.nodeIp}</label>
          <input type="text" id="prof-nodeip" class="form-control" value="${p.espNodeIp || '192.168.4.1'}">
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label">${t.syncInterval}</label>
          <input type="number" id="prof-sync" class="form-control" value="${p.syncIntervalSec || 3}" min="1" max="60">
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label">${t.airCalib}</label>
          <input type="number" id="prof-airadc" class="form-control" value="${p.airAdcValue || 3200}">
        </div>

        <div class="form-group">
          <label class="form-label">${t.waterCalib}</label>
          <input type="number" id="prof-wateradc" class="form-control" value="${p.waterAdcValue || 1450}">
        </div>
      </div>

      <!-- 6. Farmer Profile & KVK Identification -->
      <div class="card">
        <div class="card-title">
          <span>👤</span> ${t.profileTitle}
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label">${t.fullName}</label>
          <input type="text" id="prof-name" class="form-control" value="${p.farmerName}">
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label">${t.phone}</label>
          <input type="tel" id="prof-phone" class="form-control" value="${p.phone}">
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label">${t.village}</label>
          <input type="text" id="prof-village" class="form-control" value="${p.village}">
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label">${t.district}</label>
          <input type="text" id="prof-district" class="form-control" value="${p.district}, ${p.state}">
        </div>

        <div class="form-group">
          <label class="form-label">${t.kvk}</label>
          <input type="text" id="prof-kvk" class="form-control" value="${p.kvkCenter}">
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="card" style="background: transparent; border: none; padding: 0;">
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary" style="flex: 1;" onclick="exportProfileData()">
            💾 ${t.exportBtn}
          </button>
          <button class="btn btn-primary" style="flex: 1;" onclick="saveProfileFormData()">
            ✓ ${t.saveBtn}
          </button>
        </div>
      </div>

    </div>
  `;
}

function saveProfileFormData() {
  const p = window.STATE.profile;
  const nameInput = document.getElementById('prof-name');
  const phoneInput = document.getElementById('prof-phone');
  const villageInput = document.getElementById('prof-village');
  const kvkInput = document.getElementById('prof-kvk');
  const unitsInput = document.getElementById('prof-units');
  const irrigationInput = document.getElementById('prof-irrigation');
  const pumpHpInput = document.getElementById('prof-pumphp');
  const depthInput = document.getElementById('prof-depth');
  const nodeIpInput = document.getElementById('prof-nodeip');
  const syncInput = document.getElementById('prof-sync');
  const airAdcInput = document.getElementById('prof-airadc');
  const waterAdcInput = document.getElementById('prof-wateradc');

  if (nameInput) p.farmerName = nameInput.value;
  if (phoneInput) p.phone = phoneInput.value;
  if (villageInput) p.village = villageInput.value;
  if (kvkInput) p.kvkCenter = kvkInput.value;
  if (unitsInput) p.defaultUnits = unitsInput.value;
  if (irrigationInput) p.irrigationType = irrigationInput.value;
  if (pumpHpInput) p.pumpHp = pumpHpInput.value;
  if (depthInput) p.borewellDepthFt = parseInt(depthInput.value) || 280;
  if (nodeIpInput) p.espNodeIp = nodeIpInput.value;
  if (syncInput) p.syncIntervalSec = parseInt(syncInput.value) || 3;
  if (airAdcInput) p.airAdcValue = parseInt(airAdcInput.value) || 3200;
  if (waterAdcInput) p.waterAdcValue = parseInt(waterAdcInput.value) || 1450;

  if (window.saveProfileState) window.saveProfileState();
  
  const msg = window.STATE.lang === 'te' 
    ? 'సెట్టింగ్‌లు భద్రపరచబడ్డాయి!' 
    : (window.STATE.lang === 'hi' ? 'सेटिंग्स सुरक्षित की गईं!' : 'All Settings saved successfully!');
  if (window.showToast) window.showToast(msg);
}

function exportProfileData() {
  const exportPayload = {
    app: 'AgriVision',
    version: '1.3.0',
    exportDate: new Date().toISOString(),
    profile: window.STATE.profile,
    parcels: window.STATE.parcels,
    telemetry: window.STATE.telemetry
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AgriVision_Settings_Backup_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  if (window.showToast) window.showToast('Farm settings & data exported as JSON');
}

window.renderProfileUI = renderProfileUI;
window.saveProfileFormData = saveProfileFormData;
window.exportProfileData = exportProfileData;
