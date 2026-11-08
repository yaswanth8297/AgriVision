/**
 * AgriVision - Module 6: Weather Alerts & Seasonal Farm Calendar
 * Features full reactive multi-language support (English, Telugu, Hindi)
 */

const REGIONAL_WEATHER_DATA = {
  anakapalli: {
    regionEn: 'Anakapalli Agricultural Belt',
    regionTe: 'అనకాపల్లి వ్యవసాయ మండలం',
    regionHi: 'अनकापल्ली कृषि क्षेत्र',
    temp: '31°C',
    humidity: '74%',
    rainProb: '65%',
    wind: '18 km/h ENE',
    alertEn: 'Bay of Bengal Low Pressure Warning: Moderate to heavy rain showers expected in 48 hours. Secure polyhouse side vents and clear drainage channels.',
    alertTe: 'బంగాళాఖాతంలో అల్పపీడన హెచ్చరిక: 48 గంటల్లో ఒక మోస్తరు నుండి భారీ వర్షాలు కురిసే అవకాశం ఉంది. పాలీహౌస్ కిటికీలు బిగించండి, మురుగునీటి కాల్వలను శుభ్రం చేయండి.',
    alertHi: 'बंगाल की खाड़ी में कम दबाव की चेतावनी: आगामी 48 घंटों में मध्यम से भारी बारिश की संभावना है। पॉलीहाउस के वेंट्स सुरक्षित करें और जल निकासी नालियों को साफ रखें।',
    forecast: [
      { dayEn: 'Sat', dayTe: 'శని', dayHi: 'शनि', temp: '31°C / 24°C', rain: '65%', icon: '🌧️', condEn: 'Thunder Showers', condTe: 'ఉరుములతో కూడిన వర్షం', condHi: 'गरज के साथ बौछारें' },
      { dayEn: 'Sun', dayTe: 'ఆది', dayHi: 'रवि', temp: '29°C / 23°C', rain: '80%', icon: '⛈️', condEn: 'Heavy Rain', condTe: 'భారీ వర్షం', condHi: 'भारी वर्षा' },
      { dayEn: 'Mon', dayTe: 'సోమ', dayHi: 'सोम', temp: '30°C / 24°C', rain: '40%', icon: '🌦️', condEn: 'Passing Showers', condTe: 'తేలికపాటి జల్లులు', condHi: 'हल्की बारिश' },
      { dayEn: 'Tue', dayTe: 'మంగళ', dayHi: 'मंगल', temp: '32°C / 25°C', rain: '20%', icon: '⛅', condEn: 'Partly Cloudy', condTe: 'పాక్షిక మేఘావృతం', condHi: 'आंशिक रूप से बादल' },
      { dayEn: 'Wed', dayTe: 'బుధ', dayHi: 'बुध', temp: '33°C / 25°C', rain: '10%', icon: '☀️', condEn: 'Sunny & Clear', condTe: 'ప్రకాశవంతమైన ఎండ', condHi: 'धूप एवं साफ' }
    ]
  },
  vizianagaram: {
    regionEn: 'Vizianagaram Dryland Tracts',
    regionTe: 'విజయనగరం మెట్ట ప్రాంతం',
    regionHi: 'विजयनगरम शुष्क कृषि क्षेत्र',
    temp: '33°C',
    humidity: '58%',
    rainProb: '25%',
    wind: '12 km/h SE',
    alertEn: 'Elevated Daytime Evapotranspiration Alert: Schedule drip irrigation during early morning (6:00 AM - 8:30 AM) to minimize evaporation losses.',
    alertTe: 'పగటి బాష్పీభవన నష్టాల హెచ్చరిక: నీటి ఆవిరి నష్టాన్ని తగ్గించడానికి డ్రిప్ నీటి సరఫరాను ఉదయం 6:00 - 8:30 గంటల మధ్య పూర్తి చేయండి.',
    alertHi: 'उच्च वाष्पीकरण चेतावनी: जल हानि कम करने के लिए ड्रिप सिंचाई केवल प्रातः काल (6:00 से 8:30 बजे) ही संचालित करें।',
    forecast: [
      { dayEn: 'Sat', dayTe: 'శని', dayHi: 'शनि', temp: '33°C / 25°C', rain: '25%', icon: '⛅', condEn: 'Partly Cloudy', condTe: 'పాక్షిక మేఘాలు', condHi: 'आंशिक बादल' },
      { dayEn: 'Sun', dayTe: 'ఆది', dayHi: 'रवि', temp: '34°C / 25°C', rain: '15%', icon: '🌤️', condEn: 'Mostly Sunny', condTe: 'ఎండగా ఉంటుంది', condHi: 'अधिकतर धूप' },
      { dayEn: 'Mon', dayTe: 'సోమ', dayHi: 'सोम', temp: '33°C / 24°C', rain: '30%', icon: '🌦️', condEn: 'Isolated Rain', condTe: 'చెదురుమదురు వర్షం', condHi: 'छिटपुट वर्षा' },
      { dayEn: 'Tue', dayTe: 'మంగళ', dayHi: 'मंगल', temp: '34°C / 26°C', rain: '10%', icon: '☀️', condEn: 'Sunny', condTe: 'ఎండ తీవ్రత', condHi: 'चिलचिलाती धूप' },
      { dayEn: 'Wed', dayTe: 'బుధ', dayHi: 'बुध', temp: '35°C / 26°C', rain: '5%', icon: '☀️', condEn: 'Hot & Dry', condTe: 'వేడి మరియు పొడి వాతావరణం', condHi: 'गर्म एवं शुष्क' }
    ]
  }
};

const SEASONAL_ROADMAP_TASKS = [
  {
    weekEn: 'Week 1–2',
    weekTe: 'వారం 1–2',
    weekHi: 'सप्ताह 1–2',
    titleEn: 'Land Preparation & Basal Nutrition',
    titleTe: 'భూమి తయారీ & ప్రాథమిక ఎరువులు',
    titleHi: 'खेत की तैयारी एवं बेसल खाद',
    descEn: 'Deep summer ploughing to eradicate resting pupae. Incorporate 4 tons Farmyard Manure (FYM) and Trichoderma-enriched vermicompost.',
    descTe: 'లోతు దుక్కులు చేసి పెంకు పురుగుల కోశస్థ దశలను నిర్మూలించండి. ఎకరానికి 4 టన్నుల పశువుల ఎరువు, ట్రైకోడెర్మా కలిపిన వర్మీకంపోస్ట్ వేయండి.',
    descHi: 'गहरी जुताई कर कीटों के प्यूपा नष्ट करें। 4 टन गोबर खाद एवं ट्राइकोडर्मा युक्त वर्मीकम्पोस्ट अच्छी तरह मिलाएं।',
    status: 'completed'
  },
  {
    weekEn: 'Week 3–4',
    weekTe: 'వారం 3–4',
    weekHi: 'सप्ताह 3–4',
    titleEn: 'Micro-Irrigation Flushing & Soil Bed Formation',
    titleTe: 'డ్రిప్ పైపుల ఫ్లషింగ్ & ఎత్తైన బెడ్ల నిర్మాణం',
    titleHi: 'ड्रिप पाइप की सफाई एवं क्यारी निर्माण',
    descEn: 'Flush main and sub-main drip lateral lines with 0.1% acid wash to clear salt scale. Shape 15cm raised planting beds.',
    descTe: 'డ్రిప్ పైపులలో ఉప్పు నిక్షేపాలను తొలగించడానికి యాసిడ్ ఫ్లషింగ్ చేయండి. 15 సెం.మీ ఎత్తులో సాగు బెడ్లను రూపొందించండి.',
    descHi: 'ड्रिप लैटरल लाइनों को 0.1% एसिड फ्लशिंग द्वारा साफ करें। 15 सेमी ऊंची उठी हुई क्यारियां तैयार करें।',
    status: 'in-progress'
  },
  {
    weekEn: 'Week 5–6',
    weekTe: 'వారం 5–6',
    weekHi: 'सप्ताह 5–6',
    titleEn: 'Transplanting & Pheromone Trap Deployment',
    titleTe: 'మొక్కలు నాటడం & లింగాకర్షక బుట్టల ఏర్పాటు',
    titleHi: 'पौध रोपाई एवं फेरोमोन ट्रैप स्थापना',
    descEn: 'Transplant healthy 30-day seedlings in early evening. Install 8 yellow sticky traps and 4 pheromone traps per acre for early pest monitoring.',
    descTe: 'సాయంత్రం వేళల్లో బలమైన నారును నాటండి. రసం పీల్చే పురుగుల నిఘా కోసం ఎకరానికి 8 పసుపు జిగురు అట్టలు, 4 లింగాకర్షక బుట్టలు అమర్చండి.',
    descHi: 'शाम के समय स्वस्थ पौध का रोपण करें। कीट निगरानी हेतु प्रति एकड़ 8 पीले स्टिकी ट्रैप एवं 4 फेरोमोन ट्रैप लगाएं।',
    status: 'pending'
  },
  {
    weekEn: 'Week 7–9',
    weekTe: 'వారం 7–9',
    weekHi: 'सप्ताह 7–9',
    titleEn: 'Vegetative Foliar Spray & Micro-Nutrient Drench',
    titleTe: 'శాఖీయ దశలో పోషకాల పిచికారీ & వేప కషాయం',
    titleHi: 'वानस्पतिक पर्णीय छिड़काव एवं सूक्ष्म पोषक तत्व',
    descEn: 'Apply Panchagavya (3%) or 19:19:19 foliar spray. Spray 5% Neem Seed Kernel Extract (NSKE) as prophylactic protection against mites and thrips.',
    descTe: 'పంచగవ్య (3%) లేదా 19:19:19 ద్రావణాన్ని పిచికారీ చేయండి. తామర పురుగులు, పేనుబంక రాకుండా నివారణగా 5% వేప గింజల కషాయం చల్లండి.',
    descHi: 'पंचगव्य (3%) अथवा 19:19:19 का पर्णीय छिड़काव करें। थ्रिप्स व रस चूसक कीटों से बचाव हेतु 5% नीम अर्क (NSKE) छिड़कें।',
    status: 'pending'
  },
  {
    weekEn: 'Week 10–12',
    weekTe: 'వారం 10–12',
    weekHi: 'सप्ताह 10–12',
    titleEn: 'Fruit Formation & Yield Harvesting Cycle',
    titleTe: 'కాయ ఎదుగుదల దశ & పంట కోత',
    titleHi: 'फल विकास एवं तुड़ाई चक्र',
    descEn: 'Apply Potassium Nitrate (13-0-45) to enhance fruit size and shine. Harvest mature produce in cool morning hours for mandi transport.',
    descTe: 'కాయ నాణ్యత, పరిమాణం పెరగడానికి పొటాషియం నైట్రేట్ అందించండి. మార్కెట్ తరలింపు కోసం ఉదయాన్నే కోతలు పూర్తి చేయండి.',
    descHi: 'फलों के आकार एवं चमक बढ़ाने के लिए पोटेशियम नाइट्रेट (13-0-45) दें। सुबह के समय ही परिपक्व तुड़ाई संपन्न करें।',
    status: 'pending'
  }
];

function renderWeatherAndCalendar() {
  const l = STATE.lang;
  const currentRegionKey = STATE.activeParcelId === 'parcel_dryland' ? 'vizianagaram' : 'anakapalli';
  const weather = REGIONAL_WEATHER_DATA[currentRegionKey] || REGIONAL_WEATHER_DATA.anakapalli;

  const labels = {
    en: {
      alertPrefix: 'Regional Weather Advisory:',
      forecastTitle: '5-Day Micro-Climate Regional Forecast:',
      roadmapTitle: 'Automated Crop Calendar & Task Roadmap:'
    },
    te: {
      alertPrefix: 'ప్రాంతీయ వాతావరణ హెచ్చరిక:',
      forecastTitle: '5 రోజుల సూక్ష్మ వాతావరణ అంచనా:',
      roadmapTitle: 'స్వయంకృత పంట కాలెండర్ & పనుల ప్రణాళిక:'
    },
    hi: {
      alertPrefix: 'क्षेत्रीय मौसम सलाह:',
      forecastTitle: '5-दिवसीय सूक्ष्म मौसम पूर्वानुमान:',
      roadmapTitle: 'स्वचालित फसल कैलेंडर एवं कार्य योजना:'
    }
  };

  const dict = labels[l] || labels.en;

  let regionName = weather.regionEn;
  let alertText = weather.alertEn;
  if (l === 'te') {
    regionName = weather.regionTe;
    alertText = weather.alertTe;
  } else if (l === 'hi') {
    regionName = weather.regionHi;
    alertText = weather.alertHi;
  }

  // Render Weather Alert Banner
  const alertCard = document.getElementById('weather-alert-card');
  if (alertCard) {
    alertCard.innerHTML = `
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="font-size: 2rem;">⚠️</span>
        <div>
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #78281f; margin-bottom: 3px;">
            ${dict.alertPrefix} ${regionName}
          </h4>
          <p style="font-size: 0.88rem; color: #641e16; line-height: 1.5;">
            ${alertText}
          </p>
        </div>
      </div>
    `;
  }

  // Section titles
  const forecastHeadEl = document.getElementById('weather-forecast-head');
  const roadmapHeadEl = document.getElementById('weather-roadmap-head');
  if (forecastHeadEl) forecastHeadEl.textContent = dict.forecastTitle;
  if (roadmapHeadEl) roadmapHeadEl.textContent = dict.roadmapTitle;

  // Render 5-Day Forecast Grid
  const forecastContainer = document.getElementById('weather-forecast-grid');
  if (forecastContainer) {
    let forecastHtml = '';
    weather.forecast.forEach(f => {
      let dayName = f.dayEn;
      let condName = f.condEn;
      if (l === 'te') {
        dayName = f.dayTe;
        condName = f.condTe;
      } else if (l === 'hi') {
        dayName = f.dayHi;
        condName = f.condHi;
      }

      forecastHtml += `
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; padding: 14px 10px; text-align: center; box-shadow: var(--shadow-sm);">
          <div style="font-size: 0.9rem; font-weight: 800; color: var(--text-secondary);">${dayName}</div>
          <div style="font-size: 2rem; margin: 6px 0;">${f.icon}</div>
          <div style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary);">${f.temp}</div>
          <div style="font-size: 0.78rem; color: var(--info); font-weight: 700; margin-top: 2px;">🌧️ ${f.rain}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">${condName}</div>
        </div>
      `;
    });
    forecastContainer.innerHTML = forecastHtml;
  }

  // Render Seasonal Roadmap Timeline
  const roadmapContainer = document.getElementById('seasonal-roadmap-timeline');
  if (roadmapContainer) {
    let timelineHtml = '<div class="timeline-list">';
    SEASONAL_ROADMAP_TASKS.forEach(t => {
      const isDone = t.status === 'completed';
      const isCurrent = t.status === 'in-progress';
      const dotColor = isDone ? '#27ae60' : (isCurrent ? '#f39c12' : '#95a5a6');

      let weekText = t.weekEn;
      let titleText = t.titleEn;
      let descText = t.descEn;

      if (l === 'te') {
        weekText = t.weekTe;
        titleText = t.titleTe;
        descText = t.descTe;
      } else if (l === 'hi') {
        weekText = t.weekHi;
        titleText = t.titleHi;
        descText = t.descHi;
      }

      timelineHtml += `
        <div class="timeline-node">
          <div class="timeline-dot" style="background: ${dotColor};"></div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px;">
            <h5 style="font-size: 1rem; font-weight: 800; color: var(--text-primary);">
              ${titleText}
            </h5>
            <span style="font-size: 0.78rem; font-weight: 800; color: ${dotColor}; background: var(--bg-primary); padding: 3px 10px; border-radius: 12px; border: 1px solid var(--border-color);">
              ${weekText}
            </span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.5;">
            ${descText}
          </p>
        </div>
      `;
    });
    timelineHtml += '</div>';
    roadmapContainer.innerHTML = timelineHtml;
  }
}

window.renderWeatherAndCalendar = renderWeatherAndCalendar;
