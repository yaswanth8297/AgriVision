/**
 * AgriVision - Module 2: Farming Method & Land Optimization Engine
 * Compares Organic vs Conventional vs Integrated systems side-by-side
 * Full trilingual support for English, Telugu, and Hindi.
 */

const FARMING_METHODS_DB = {
  organic: {
    id: 'organic',
    nameEn: 'Certified Organic Farming',
    nameTe: 'సేంద్రీయ వ్యవసాయం',
    nameHi: 'प्रमाणित जैविक कृषि',
    descEn: 'Relies on bio-fertilizers, vermicompost, Jeevamrutham, and biological pest controls. Premium price realization in organic clusters.',
    descTe: 'జీవామృతం, వర్మీకంపోస్ట్, వేప కషాయం మరియు జీవ నియంత్రణలపై ఆధారపడుతుంది. రసాయనాలు లేకుండా అధిక నాణ్యత.',
    descHi: 'जीवामृत, वर्मीकम्पोस्ट, नीम अर्क और जैव-नियंत्रक पर आधारित। शून्य रसायन एवं जैविक मंडियों में अधिक मूल्य।',
    baseCostPerAcre: 18500,
    laborDaysPerAcre: 48,
    waterIndexLitersPerKg: 420,
    roi3YearPct: 142,
    sustainabilityScore: 95,
    subsidyEn: 'PKVY (Paramparagat Krishi Vikas Yojana) & State Organic Mission',
    subsidyTe: 'PKVY మరియు రాష్ట్ర సేంద్రీయ వ్యవసాయ మిషన్',
    subsidyHi: 'परम्परागत कृषि विकास योजना (PKVY) एवं राज्य जैविक मिशन'
  },
  conventional: {
    id: 'conventional',
    nameEn: 'Conventional Chemical Farming',
    nameTe: 'సాంప్రదాయ రసాయన వ్యవసాయం',
    nameHi: 'पारंपरिक रासायनिक कृषि',
    descEn: 'Uses chemical NPK fertilizers (Urea, DAP, MOP) and synthetic pesticides. High immediate yield, but triggers soil compaction.',
    descTe: 'యూరియా, డీఏపీ మరియు పురుగుమందుల ఆధారిత సాగు. త్వరిత దిగుబడి వచ్చినప్పటికీ నేల సారం తగ్గిపోతుంది.',
    descHi: 'यूरिया, डीएपी एवं कीटनाशकों पर आधारित खेती। तात्कालिक उत्पादन अधिक परंतु दीर्घकालिक मृदा क्षरण।',
    baseCostPerAcre: 26000,
    laborDaysPerAcre: 34,
    waterIndexLitersPerKg: 680,
    roi3YearPct: 98,
    sustainabilityScore: 45,
    subsidyEn: 'Standard fertilizer nutrient-based subsidy (NBS)',
    subsidyTe: 'సాధారణ రసాయన ఎరువుల సబ్సిడీ',
    subsidyHi: 'मानक पोषक तत्व आधारित उर्वरक सब्सिडी'
  },
  integrated: {
    id: 'integrated',
    nameEn: 'Integrated Crop Management (Recommended)',
    nameTe: 'సమీకృత వ్యవసాయ పద్ధతి (సిఫార్సు చేయబడినది)',
    nameHi: 'एकीकृत फसल प्रबंधन (सर्वोत्तम अनुशंसित)',
    descEn: 'Fuses 60% organic inputs with precision chemical rescue only when economic thresholds are breached. Maximizes net income and water conservation.',
    descTe: '60% సేంద్రీయ ఎరువులు + అత్యవసర సమయాల్లోనే కచ్చితమైన రసాయన రక్షణ. తక్కువ ఖర్చుతో అత్యధిక లాభం.',
    descHi: '60% जैविक खाद + आवश्यकता पड़ने पर ही सटीक रासायनिक सुरक्षा। न्यूनतम लागत में अधिकतम शुद्ध लाभ एवं जल संरक्षण।',
    baseCostPerAcre: 21500,
    laborDaysPerAcre: 40,
    waterIndexLitersPerKg: 490,
    roi3YearPct: 168,
    sustainabilityScore: 84,
    subsidyEn: 'PMKSY Micro-Irrigation (Up to 90% subsidy for smallholders)',
    subsidyTe: 'పీఎం కేఎస్‌వై మైక్రో ఇరిగేషన్ సబ్సిడీ (చిన్నకారు రైతులకు 90% వరకు)',
    subsidyHi: 'पीएम कृषि सिंचाई योजना (लघु किसानों हेतु 90% तक अनुदान)'
  }
};

function updateOptimizerUI() {
  const container = document.getElementById('optimizer-cards-container');
  if (!container) return;

  const parcel = getActiveParcel();
  const acres = parcel.acres || ((parcel.L * parcel.W) / 4046.86);
  
  const budgetInput = document.getElementById('opt-custom-budget');
  const userBudget = budgetInput ? parseFloat(budgetInput.value) || 200000 : 200000;

  const l = STATE.lang;
  const labels = {
    en: {
      recBadge: 'RECOMMENDED',
      totalCost: 'Total Input Cost:',
      costPerAcre: 'Cost per Acre:',
      laborDays: 'Labor Days Needed:',
      personDays: 'person-days',
      waterIndex: 'Water Consumption Index:',
      roi3Yr: '3-Year Projected ROI:',
      soilScore: 'Soil Sustainability:',
      subsidy: 'Government Subsidy:',
      adoptBtn: 'Adopt This Method',
      acresLabel: 'Acres'
    },
    te: {
      recBadge: 'ఉత్తమ ఎంపిక',
      totalCost: 'మొత్తం పెట్టుబడి ఖర్చు:',
      costPerAcre: 'ఎకరాకు ఖర్చు:',
      laborDays: 'శ్రామిక రోజుల అవసరం:',
      personDays: 'మనిషి రోజులు',
      waterIndex: 'నీటి వినియోగ సూచిక:',
      roi3Yr: '3 సంవత్సరాల అంచనా ROI:',
      soilScore: 'భూసార స్థిరత్వ స్కోరు:',
      subsidy: 'ప్రభుత్వ సబ్సిడీ:',
      adoptBtn: 'ఈ పద్ధతిని వర్తింపజేయి',
      acresLabel: 'ఎకరాలు'
    },
    hi: {
      recBadge: 'सर्वोत्तम अनुशंसित',
      totalCost: 'कुल लागत खर्च:',
      costPerAcre: 'प्रति एकड़ लागत:',
      laborDays: 'आवश्यक श्रम दिवस:',
      personDays: 'मानव दिवस',
      waterIndex: 'जल खपत सूचकांक:',
      roi3Yr: '3-वर्षीय अनुमानित ROI:',
      soilScore: 'मृदा स्थिरता स्कोर:',
      subsidy: 'सरकारी सब्सिडी:',
      adoptBtn: 'यह पद्धति अपनाएं',
      acresLabel: 'एकड़'
    }
  };

  const dict = labels[l] || labels.en;
  let html = '';

  Object.values(FARMING_METHODS_DB).forEach(method => {
    const isRecommended = method.id === 'integrated';
    const totalCost = Math.round(method.baseCostPerAcre * acres);
    const totalLabor = Math.round(method.laborDaysPerAcre * acres);
    const withinBudget = totalCost <= userBudget;

    let methodName = method.nameEn;
    let methodDesc = method.descEn;
    let subsidyName = method.subsidyEn;
    if (l === 'te') {
      methodName = method.nameTe;
      methodDesc = method.descTe;
      subsidyName = method.subsidyTe;
    } else if (l === 'hi') {
      methodName = method.nameHi;
      methodDesc = method.descHi;
      subsidyName = method.subsidyHi;
    }

    html += `
      <div class="method-card ${isRecommended ? 'recommended' : ''}">
        ${isRecommended ? `<div class="recommended-pill">${dict.recBadge}</div>` : ''}
        
        <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
          ${methodName}
        </h3>
        
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px; min-height: 48px;">
          ${methodDesc}
        </p>

        <div class="method-metric-row">
          <span>${dict.totalCost}</span>
          <span class="metric-val" style="color: ${withinBudget ? 'var(--primary)' : 'var(--danger)'};">
            ₹${totalCost.toLocaleString('en-IN')} (${acres.toFixed(1)} ${dict.acresLabel})
          </span>
        </div>

        <div class="method-metric-row">
          <span>${dict.costPerAcre}</span>
          <span class="metric-val">₹${method.baseCostPerAcre.toLocaleString('en-IN')}</span>
        </div>

        <div class="method-metric-row">
          <span>${dict.laborDays}</span>
          <span class="metric-val">${totalLabor} ${dict.personDays}</span>
        </div>

        <div class="method-metric-row">
          <span>${dict.waterIndex}</span>
          <span class="metric-val">${method.waterIndexLitersPerKg} L / kg</span>
        </div>

        <div class="method-metric-row">
          <span>${dict.roi3Yr}</span>
          <span class="metric-val" style="color: #27ae60;">+${method.roi3YearPct}%</span>
        </div>

        <div class="method-metric-row">
          <span>${dict.soilScore}</span>
          <span class="metric-val">${method.sustainabilityScore} / 100</span>
        </div>

        <div style="margin-top: 14px; padding: 10px; background: var(--bg-primary); border-radius: var(--radius-sm); font-size: 0.8rem;">
          <strong>${dict.subsidy}</strong> ${subsidyName}
        </div>

        <button class="btn btn-primary btn-sm" style="width: 100%; margin-top: 16px;" onclick="applyFarmingMethod('${method.id}')">
          ${dict.adoptBtn}
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

function applyFarmingMethod(methodId) {
  const parcel = getActiveParcel();
  parcel.farmingMethod = methodId;
  const m = FARMING_METHODS_DB[methodId];
  let name = m.nameEn;
  if (STATE.lang === 'te') name = m.nameTe;
  else if (STATE.lang === 'hi') name = m.nameHi || m.nameEn;

  const msg = STATE.lang === 'te' 
    ? `${name} ఎంపిక చేయబడింది!` 
    : (STATE.lang === 'hi' ? `${name} खेत पर लागू किया गया!` : `${name} applied to your farm!`);
  showToast(msg);
}

window.updateOptimizerUI = updateOptimizerUI;
window.applyFarmingMethod = applyFarmingMethod;
