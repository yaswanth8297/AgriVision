/**
 * AgriVision - Module 3: AI Crop & Fertilizer Advisor
 * Features real-life photography for crops and fertilizers,
 * multi-language support (English, Telugu, Hindi), stage-wise NPK schedules,
 * and an interactive Real-Life Fertilizer Visual Guide.
 */

// Real-Life Photographic Image Mappings (Local Assets)
const CROP_IMAGES = {
  chili: 'images/crops/chili.jpg',
  guava: 'images/crops/guava.jpg',
  millet: 'images/crops/millet.jpg',
  mango: 'images/crops/mango.jpg',
  paddy: 'images/crops/paddy.jpg'
};

const FERTILIZER_IMAGES = {
  vermicompost: 'images/fertilizers/vermicompost.jpg',
  neem_cake: 'images/fertilizers/neem_cake.jpg',
  npk_granules: 'images/fertilizers/npk_granules.jpg',
  jeevamrutham: 'images/fertilizers/jeevamrutham.jpg'
};

// Comprehensive Agronomic Database (ICAR Standards)
const CROPS_AGRONOMIC_DB = [
  {
    id: 'chili',
    nameEn: 'Guntur Hope Chili (Mirapa)',
    nameTe: 'మిరప (గుంటూరు రకం)',
    nameHi: 'गुंटूर मिर्च (तीखी मिर्च)',
    imgKey: 'chili',
    seasons: ['kharif', 'rabi'],
    soils: ['red_loam', 'black_clay'],
    minPh: 6.0,
    maxPh: 7.8,
    waterNeedMm: 650,
    waterType: ['borewell', 'irrigated'],
    durationDays: '150–180 Days',
    expectedYield: '22–28 Quintals/Acre',
    isWaterIntensive: false,
    npkBasal: { 
      n: 30, p: 40, k: 30, 
      fertilizerImg: 'images/fertilizers/vermicompost.jpg',
      fertilizerNameEn: 'Organic FYM / Compost',
      fertilizerNameTe: 'పశువుల ఎరువు / కంపోస్ట్',
      fertilizerNameHi: 'गोबर की सड़ी खाद',
      organicEn: '4 tons FYM + 200kg Neem Cake', 
      organicTe: '4 టన్నుల పశువుల ఎరువు + 200కిలోల వేప పిండి', 
      organicHi: '4 टन गोबर खाद + 200 किग्रा नीम खली' 
    },
    npkVegetative: { 
      n: 40, p: 0, k: 20, 
      fertilizerImg: 'images/fertilizers/jeevamrutham.jpg',
      fertilizerNameEn: 'Jeevamrutham Liquid',
      fertilizerNameTe: 'జీవామృతం ద్రావణం',
      fertilizerNameHi: 'जीवामृत तरल खाद',
      organicEn: 'Jeevamrutham 200L foliar drench', 
      organicTe: 'జీవామృతం 200లీ పిచికారీ', 
      organicHi: 'जीवामृत 200 लीटर छिड़काव' 
    },
    npkFlowering: { 
      n: 30, p: 20, k: 30, 
      fertilizerImg: 'images/fertilizers/npk_granules.jpg',
      fertilizerNameEn: 'NPK 19:19:19 Complex',
      fertilizerNameTe: 'NPK 19:19:19 ఎరువు',
      fertilizerNameHi: 'एनपीके 19:19:19 उर्वरक',
      organicEn: 'Waste Decomposer + 19:19:19 micro-spray', 
      organicTe: 'వేస్ట్ డీకంపోజర్ + 19:19:19 స్ప్రే', 
      organicHi: 'वेस्ट डीकंपोजर + 19:19:19 स्प्रे' 
    }
  },
  {
    id: 'guava',
    nameEn: 'Taiwan Pink Guava (High-Density)',
    nameTe: 'తైవాన్ పింక్ జామ (సాంద్ర తోట)',
    nameHi: 'ताइवान पिंक अमरूद (सघन बागवानी)',
    imgKey: 'guava',
    seasons: ['kharif', 'rabi', 'zaid'],
    soils: ['red_loam', 'alluvial', 'laterite'],
    minPh: 5.8,
    maxPh: 8.0,
    waterNeedMm: 800,
    waterType: ['borewell', 'irrigated', 'limited_borewell'],
    durationDays: 'Perennial (First harvest at 18 months)',
    expectedYield: '12–15 Tons/Acre',
    isWaterIntensive: false,
    npkBasal: { 
      n: 25, p: 35, k: 25, 
      fertilizerImg: 'images/fertilizers/vermicompost.jpg',
      fertilizerNameEn: 'Vermicompost + Trichoderma',
      fertilizerNameTe: 'వర్మీకంపోస్ట్ + ట్రైకోడెర్మా',
      fertilizerNameHi: 'वर्मीकम्पोस्ट + ट्राइकोडर्मा',
      organicEn: '5 tons Vermicompost + 500g Trichoderma', 
      organicTe: '5 టన్నుల వర్మీకంపోస్ట్ + 500గ్రా ట్రైకోడెర్మా', 
      organicHi: '5 टन वर्मीकम्पोस्ट + 500 ग्राम ट्राइकोडर्मा' 
    },
    npkVegetative: { 
      n: 30, p: 15, k: 20, 
      fertilizerImg: 'images/fertilizers/jeevamrutham.jpg',
      fertilizerNameEn: 'Panchagavya / Bio-Wash',
      fertilizerNameTe: 'పంచగవ్య ద్రావణం',
      fertilizerNameHi: 'पंचगव्य / जैव रस',
      organicEn: 'Panchagavya 3% foliar spray', 
      organicTe: 'పంచగవ్య 3% పిచికారీ', 
      organicHi: 'पंचगव्य 3% छिड़काव' 
    },
    npkFlowering: { 
      n: 20, p: 25, k: 40, 
      fertilizerImg: 'images/fertilizers/npk_granules.jpg',
      fertilizerNameEn: 'Sulphate of Potash (KMB)',
      fertilizerNameTe: 'పొటాష్ ఎరువు (KMB)',
      fertilizerNameHi: 'पोटाश खाद (KMB)',
      organicEn: 'Potash mobilizing bacteria (KMB)', 
      organicTe: 'పొటాష్ బ్యాక్టీరియా (KMB) ద్రావణం', 
      organicHi: 'पोटाश घुलनशील बैक्टीरिया (KMB)' 
    }
  },
  {
    id: 'millet',
    nameEn: 'Finger Millet (Ragi / Chodi)',
    nameTe: 'రాగి / చోడి (చిరుధాన్యం)',
    nameHi: 'रागी / मडुआ (मोटा अनाज)',
    imgKey: 'millet',
    seasons: ['kharif', 'rabi'],
    soils: ['red_loam', 'laterite', 'black_clay'],
    minPh: 5.0,
    maxPh: 8.2,
    waterNeedMm: 350,
    waterType: ['limited_borewell', 'rainfed', 'borewell', 'irrigated'],
    durationDays: '100–115 Days',
    expectedYield: '14–18 Quintals/Acre',
    isWaterIntensive: false,
    npkBasal: { 
      n: 20, p: 20, k: 15, 
      fertilizerImg: 'images/fertilizers/vermicompost.jpg',
      fertilizerNameEn: 'Enriched Compost',
      fertilizerNameTe: 'అజోస్పైరిల్లమ్ కంపోస్ట్',
      fertilizerNameHi: 'संवर्धित कम्पोस्ट',
      organicEn: '2.5 tons compost + Azospirillum seed treatment', 
      organicTe: '2.5 టన్నుల కంపోస్ట్ + అజోస్పైరిల్లమ్ విత్తన శుద్ధి', 
      organicHi: '2.5 टन कम्पोस्ट + एजोस्पिरिलम बीजोपचार' 
    },
    npkVegetative: { 
      n: 20, p: 0, k: 0, 
      fertilizerImg: 'images/fertilizers/neem_cake.jpg',
      fertilizerNameEn: 'Neem Kernel Extract (NSKE)',
      fertilizerNameTe: 'వేప గింజల కషాయం',
      fertilizerNameHi: 'नीम बीज का अर्क',
      organicEn: 'Neem seed kernel extract (NSKE 5%)', 
      organicTe: 'వేప గింజల కషాయం (NSKE 5%)', 
      organicHi: 'नीम बीज अर्क (NSKE 5%)' 
    },
    npkFlowering: { 
      n: 10, p: 10, k: 15, 
      fertilizerImg: 'images/fertilizers/vermicompost.jpg',
      fertilizerNameEn: 'Organic Wood Ash & Potash',
      fertilizerNameTe: 'పొయ్యి బూడిద పోషకాలు',
      fertilizerNameHi: 'लकड़ी की जैविक राख',
      organicEn: 'Wood ash 50kg/acre for organic potassium', 
      organicTe: 'ఎకరానికి 50కిలోల పొయ్యి బూడిద', 
      organicHi: '50 किग्रा लकड़ी की राख प्रति एकड़' 
    }
  },
  {
    id: 'mango',
    nameEn: 'Banganapalli Mango Orchard',
    nameTe: 'బంగినపల్లి మామిడి తోట',
    nameHi: 'बंगनापल्ली आम का बाग',
    imgKey: 'mango',
    seasons: ['kharif'],
    soils: ['red_loam', 'alluvial', 'laterite'],
    minPh: 5.5,
    maxPh: 7.5,
    waterNeedMm: 750,
    waterType: ['borewell', 'limited_borewell', 'irrigated'],
    durationDays: 'Perennial (Year 3 onward)',
    expectedYield: '6–9 Tons/Acre',
    isWaterIntensive: false,
    npkBasal: { 
      n: 40, p: 50, k: 40, 
      fertilizerImg: 'images/fertilizers/vermicompost.jpg',
      fertilizerNameEn: 'Manure + Bone Meal Pit Blend',
      fertilizerNameTe: 'ఎరువు + ఎముకల పొడి మిశ్రమం',
      fertilizerNameHi: 'गोबर खाद + बोनमील मिश्रण',
      organicEn: '10kg FYM per pit + 1kg Bone meal', 
      organicTe: 'గుంతకు 10కిలోల ఎరువు + 1కిలో ఎముకల పొడి', 
      organicHi: '10 किग्रा गोबर खाद प्रति गड्ढा + 1 किग्रा बोनमील' 
    },
    npkVegetative: { 
      n: 30, p: 20, k: 30, 
      fertilizerImg: 'images/fertilizers/jeevamrutham.jpg',
      fertilizerNameEn: 'Zinc-Borax & Jeevamrutham',
      fertilizerNameTe: 'జింక్-బోరాక్స్ & జీవామృతం',
      fertilizerNameHi: 'जिंक-बोरेक्स एवं जीवामृत',
      organicEn: 'Zinc Sulphate 0.5% + Borax 0.2% spray', 
      organicTe: 'జింక్ సల్ఫేట్ 0.5% + బోరాక్స్ 0.2% పిచికారీ', 
      organicHi: 'जिंक सल्फेट 0.5% + बोरेक्स 0.2% छिड़काव' 
    },
    npkFlowering: { 
      n: 20, p: 40, k: 60, 
      fertilizerImg: 'images/fertilizers/npk_granules.jpg',
      fertilizerNameEn: 'Fruit Set Potash & Paclobutrazol',
      fertilizerNameTe: 'పూత నిలిపే పొటాష్ & కల్టార్',
      fertilizerNameHi: 'फल विकास पोटाश खाद',
      organicEn: 'Cultar paclobutrazol (if recommended by KVK)', 
      organicTe: 'కల్టార్ (కేవీకే సిఫార్సు మేరకు)', 
      organicHi: 'कल्टार (केवीके सलाह अनुसार)' 
    }
  },
  {
    id: 'paddy',
    nameEn: 'BPT 5204 Paddy (Samba Mahsuri)',
    nameTe: 'వరి (సాంబ మసూరి - BPT 5204)',
    nameHi: 'धान (सांभा मसूरी - BPT 5204)',
    imgKey: 'paddy',
    seasons: ['kharif', 'rabi'],
    soils: ['black_clay', 'alluvial'],
    minPh: 6.0,
    maxPh: 7.5,
    waterNeedMm: 1350,
    waterType: ['irrigated'],
    durationDays: '140–150 Days',
    expectedYield: '28–34 Bags/Acre',
    isWaterIntensive: true,
    npkBasal: { 
      n: 30, p: 40, k: 25, 
      fertilizerImg: 'images/fertilizers/neem_cake.jpg',
      fertilizerNameEn: 'Green Manure + Neem Cake',
      fertilizerNameTe: 'జీలుగ పచ్చిరొట్ట + వేప పిండి',
      fertilizerNameHi: 'ढैंचा हरी खाद + नीम खली',
      organicEn: 'Green manure (Dhaincha/Sunn hemp incorporated)', 
      organicTe: 'జీలుగ / జనుము పచ్చిరొట్ట ఎరువు', 
      organicHi: 'ढैंचा / सनई हरी खाद का समावेश' 
    },
    npkVegetative: { 
      n: 40, p: 0, k: 15, 
      fertilizerImg: 'images/fertilizers/jeevamrutham.jpg',
      fertilizerNameEn: 'Azolla Bio-Fertilizer & Jeevamrit',
      fertilizerNameTe: 'అజోల్లా జీవ ఎరువు & జీవామృతం',
      fertilizerNameHi: 'अजोला जैव खाद एवं जीवामृत',
      organicEn: 'Azolla bio-fertilizer layer', 
      organicTe: 'అజోల్లా జీవ ఎరువు', 
      organicHi: 'अजोला जैव उर्वरक परत' 
    },
    npkFlowering: { 
      n: 30, p: 0, k: 20, 
      fertilizerImg: 'images/fertilizers/npk_granules.jpg',
      fertilizerNameEn: 'Potassium Nitrate 13-0-45',
      fertilizerNameTe: 'పొటాషియం నైట్రేట్ 13-0-45',
      fertilizerNameHi: 'पोटेशियम नाइट्रेट 13-0-45',
      organicEn: 'Potassium Nitrate 13-0-45 foliar spray', 
      organicTe: 'పొటాషియం నైట్రేట్ 13-0-45 పిచికారీ', 
      organicHi: 'पोटेशियम नाइट्रेट 13-0-45 छिड़काव' 
    }
  }
];

// Dedicated Real-Life Fertilizer Reference Guide Database
const FERTILIZERS_DATA = [
  {
    id: 'vermicompost',
    nameEn: 'Organic Vermicompost / FYM',
    nameTe: 'వర్మీ కంపోస్ట్ / పశువుల ఎరువు',
    nameHi: 'वर्मीकम्पोस्ट / जैविक खाद',
    categoryEn: 'Certified Organic Basal Manure',
    categoryTe: 'సేంద్రీయ ప్రాథమిక ఎరువు',
    categoryHi: 'प्रमाणित जैविक बुनियादी खाद',
    img: 'images/fertilizers/vermicompost.jpg',
    descEn: 'High-humus organic compost enriched with beneficial earthworm cast microbes, humic acid, and optimal moisture retention. Completely rebuilds degraded soil organic carbon (SOC).',
    descTe: 'వానపాముల ద్వారా తయారైన మేలైన సేంద్రీయ ఎరువు. భూమిలో తేమ నిలిపే శక్తిని మరియు నేల సారాన్ని రెట్టింపు చేస్తుంది.',
    descHi: 'केंचुआ खाद जो ह्यूमिक एसिड, पोषक तत्वों और लाभदायक जीवाणुओं से भरपूर है। मिट्टी की जलधारण क्षमता और उपजाऊपन बढ़ाती है।',
    dosageEn: '2–4 Tons per Acre (Incorporated before sowing)',
    dosageTe: 'ఎకరానికి 2–4 టన్నులు (విత్తే ముందు భూమిలో కలపాలి)',
    dosageHi: '2–4 टन प्रति एकड़ (बुवाई से पूर्व खेत में मिलाएं)',
    benefitsEn: ['Increases Soil Microbial Flora', 'Boosts Cation Exchange Capacity', 'Prevents Moisture Stress']
  },
  {
    id: 'neem_cake',
    nameEn: 'Organic Neem Cake Bio-Manure',
    nameTe: 'వేప పిండి (సేంద్రీయ ఎరువు & కీటక నివారిణి)',
    nameHi: 'नीम की खली (जैविक खाद व कीट नियंत्रक)',
    categoryEn: 'Bio-Pesticide & Nitrification Inhibitor',
    categoryTe: 'సహజ నెమటోడ్ నిరోధకం',
    categoryHi: 'प्राकृतिक दीमक/नेमाटोड रोधी खाद',
    img: 'images/fertilizers/neem_cake.jpg',
    descEn: 'Natural soil amendment milled from Azadirachta indica seeds. Contains Azadirachtin and salannin which eradicate root nematodes, white grubs, and termite attacks, while preventing nitrogen runoff.',
    descTe: 'వేప గింజల నుంచి తీసిన పిండి. భూమిలోని నెమటోడ్లు, తెల్ల పురుగులను అరికట్టి, యూరియా నత్రజని నెమ్మదిగా మొక్కకు అందేలా చేస్తుంది.',
    descHi: 'नीम के बीजों की शुद्ध खली। इसमें एज़ाडिरेक्टिन होता है जो भूमिगत कीटों, दीमक और नेमाटोड को नष्ट कर नाइट्रोजन क्षय को रोकता है।',
    dosageEn: '150–250 kg per Acre',
    dosageTe: 'ఎకరానికి 150–250 కిలోలు',
    dosageHi: '150–250 किग्रा प्रति एकड़',
    benefitsEn: ['Natural Nematode & Grub Repellent', 'Slows Nitrogen Leaching', 'Improves Root Health']
  },
  {
    id: 'npk_granules',
    nameEn: 'Chemical NPK Granules (19:19:19 / DAP / MOP)',
    nameTe: 'రసాయనిక NPK ఎరువుల మిశ్రమం',
    nameHi: 'रासायनिक एनपीके दानेदार उर्वरक (19:19:19)',
    categoryEn: 'Fast-Acting Mineral Macro-Nutrients',
    categoryTe: 'ఖనిజ పోషక రసాయనాలు',
    categoryHi: 'तीव्र प्रभावी संतुलित खनिज पोषक तत्व',
    img: 'images/fertilizers/npk_granules.jpg',
    descEn: 'Balanced granular formulation containing water-soluble Nitrogen (N), Phosphorus pentoxide (P2O5), and Potassium oxide (K2O). Essential for fast tillering, vigorous root mass, and heavy flowering.',
    descTe: 'సమతుల్య నత్రజని, భాస్వరం మరియు పొటాష్ కలిగి ఉండే ఖనిజ ఎరువులు. కొమ్మలు తొందరగా రావడానికి, విపరీతమైన పూత నిలవడానికి తోడ్పడుతుంది.',
    descHi: 'संतुलित नाइट्रोजन, फास्फोरस एवं पोटाश युक्त दानेदार उर्वरक। पौधों के त्वरित विकास, कल्ले फूटने और बंपर पैदावार हेतु उपयुक्त।',
    dosageEn: '50–100 kg per Acre (Split during basal and growth)',
    dosageTe: 'ఎకరానికి 50–100 కిలోలు (విడతల వారీగా)',
    dosageHi: '50–100 किग्रा प्रति एकड़ (चरणबद्ध तरीके से)',
    benefitsEn: ['Immediate Nutrient Availability', 'Uniform Vegetative Growth', 'Maximizes Grain & Fruit Size']
  },
  {
    id: 'jeevamrutham',
    nameEn: 'Jeevamrutham Liquid Microbial Culture',
    nameTe: 'జీవామృతం ద్రావణం (దేశవాళీ జీవ ద్రవం)',
    nameHi: 'जीवामृत तरल जैव-उर्वरक',
    categoryEn: 'Indigenous Fermented Bio-Stimulant',
    categoryTe: 'సాంప్రదాయ దేశీ సూక్ష్మజీవ అమృతం',
    categoryHi: 'पारंपरिक जैविक अमृत घोल',
    img: 'images/fertilizers/jeevamrutham.jpg',
    descEn: 'Traditional Indian zero-budget natural farming elixir brewed from Desi cow dung, urine, jaggery, pulse flour, and virgin field soil. Delivers billions of living beneficial microbes straight to the root rhizosphere.',
    descTe: 'దేశీ ఆవు పేడ, మూత్రం, బెల్లం, శనగపిండి మరియు పొలం మట్టితో తయారుచేసిన జీవామృతం. భూమిలో సూక్ష్మజీవుల సంఖ్యను విశేషంగా పెంచుతుంది.',
    descHi: 'देसी गाय के गोबर, गोमूत्र, गुड़, बेसन एवं उपजाऊ मिट्टी से 48 घंटे में किण्वित अमृत घोल। भूमि में करोड़ों सूक्ष्मजीवाणु सक्रिय करता है।',
    dosageEn: '200 Litres per Acre (Through flood/drip irrigation every 15 days)',
    dosageTe: 'ఎకరానికి 200 లీటర్లు (ప్రతి 15 రోజులకు డ్రిప్ లేదా కాల్వ ద్వారా)',
    dosageHi: '200 लीटर प्रति एकड़ (हर 15 दिन में सिंचाई जल के साथ)',
    benefitsEn: ['Multiplies Soil Micro-Organisms', 'Synthesizes Plant Auxins', 'Zero Chemical Residue']
  }
];

// Current visual mode inside Advisor: 'crops' or 'fertilizers'
let currentAdvisorSubTab = 'crops';

function switchAdvisorSubTab(tabName) {
  currentAdvisorSubTab = tabName;
  const btnCrops = document.getElementById('adv-subtab-crops');
  const btnFertilizers = document.getElementById('adv-subtab-ferts');
  
  if (btnCrops && btnFertilizers) {
    if (tabName === 'crops') {
      btnCrops.classList.add('active');
      btnCrops.style.background = 'var(--primary)';
      btnCrops.style.color = '#ffffff';
      btnFertilizers.classList.remove('active');
      btnFertilizers.style.background = 'transparent';
      btnFertilizers.style.color = 'var(--text-secondary)';
    } else {
      btnFertilizers.classList.add('active');
      btnFertilizers.style.background = 'var(--primary)';
      btnFertilizers.style.color = '#ffffff';
      btnCrops.classList.remove('active');
      btnCrops.style.background = 'transparent';
      btnCrops.style.color = 'var(--text-secondary)';
    }
  }

  updateAdvisorUI();
}

function updateAdvisorUI() {
  const seasonSelect = document.getElementById('adv-season');
  const soilSelect = document.getElementById('adv-soil');
  const waterSelect = document.getElementById('adv-water');
  const phSlider = document.getElementById('adv-ph');
  const resultsContainer = document.getElementById('crop-recommendation-results');

  if (!resultsContainer) return;

  const currentSeason = seasonSelect ? seasonSelect.value : 'kharif';
  const currentSoil = soilSelect ? soilSelect.value : 'red_loam';
  const currentWater = waterSelect ? waterSelect.value : 'borewell';
  const currentPh = phSlider ? parseFloat(phSlider.value) : 6.8;

  const phValEl = document.getElementById('adv-ph-val');
  if (phValEl) phValEl.textContent = currentPh.toFixed(1);

  const l = (window.STATE && window.STATE.lang) ? window.STATE.lang : 'en';

  // Subtab Toggle Navigation Header
  let subTabHtml = `
    <div style="display: flex; gap: 8px; margin-bottom: 14px; background: var(--bg-card); padding: 4px; border-radius: 10px; border: 1px solid var(--border-color);">
      <button id="adv-subtab-crops" onclick="switchAdvisorSubTab('crops')" 
        style="flex: 1; padding: 10px 12px; border: none; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; background: ${currentAdvisorSubTab === 'crops' ? 'var(--primary)' : 'transparent'}; color: ${currentAdvisorSubTab === 'crops' ? '#ffffff' : 'var(--text-secondary)'};">
        🌾 ${l === 'te' ? 'సిఫార్సు చేయబడిన పంటలు' : (l === 'hi' ? 'अनुशंसित फसलें' : 'Recommended Crops')}
      </button>
      <button id="adv-subtab-ferts" onclick="switchAdvisorSubTab('fertilizers')" 
        style="flex: 1; padding: 10px 12px; border: none; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; background: ${currentAdvisorSubTab === 'fertilizers' ? 'var(--primary)' : 'transparent'}; color: ${currentAdvisorSubTab === 'fertilizers' ? '#ffffff' : 'var(--text-secondary)'};">
        🧪 ${l === 'te' ? 'వాస్తవ ఎరువుల గైడ్' : (l === 'hi' ? 'वास्तविक उर्वरक गाइड' : 'Real-Life Fertilizers')}
      </button>
    </div>
  `;

  // IF FERTILIZERS SUB-TAB IS ACTIVE
  if (currentAdvisorSubTab === 'fertilizers') {
    let fertsHtml = subTabHtml;
    fertsHtml += `
      <div style="margin-bottom: 14px; padding: 10px 12px; background: rgba(46, 204, 113, 0.12); border-left: 4px solid var(--primary); border-radius: 6px; font-size: 0.8rem; color: var(--text-primary);">
        📸 <strong>${l === 'te' ? 'వాస్తవ ఫోటోలతో ఎరువుల వివరాలు:' : (l === 'hi' ? 'वास्तविक तस्वीरों सहित पोषक तत्व गाइड:' : 'Real-Life High Resolution Fertilizer Visual Catalog:')}</strong>
        ${l === 'te' ? 'సేంద్రీయ మరియు రసాయనిక ఎరువుల స్పష్టమైన ఫోటోలు, మోతాదు మరియు ICAR సిఫార్సులు.' : (l === 'hi' ? 'जैविक एवं रासायनिक उर्वरकों की वास्तविक तस्वीरें, उचित मात्रा एवं प्रयोग विधि।' : 'Authentic photographic references, optimal dosage, and ICAR application methods for maximum crop yield.')}
      </div>
    `;

    FERTILIZERS_DATA.forEach(fert => {
      const fertName = l === 'te' ? fert.nameTe : (l === 'hi' ? fert.nameHi : fert.nameEn);
      const fertCat = l === 'te' ? fert.categoryTe : (l === 'hi' ? fert.categoryHi : fert.categoryEn);
      const fertDesc = l === 'te' ? fert.descTe : (l === 'hi' ? fert.descHi : fert.descEn);
      const fertDose = l === 'te' ? fert.dosageTe : (l === 'hi' ? fert.dosageHi : fert.dosageEn);

      fertsHtml += `
        <div class="card" style="margin-bottom: 18px; padding: 0; overflow: hidden; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-card); box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <!-- Real-Life Fertilizer Photograph -->
          <div style="position: relative; width: 100%; height: 190px; background: #0c1a12; overflow: hidden;">
            <img src="${fert.img}" alt="${fertName}" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
            <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.78); backdrop-filter: blur(4px); padding: 4px 10px; border-radius: 16px; border: 1px solid rgba(46, 204, 113, 0.5); font-size: 0.75rem; font-weight: 800; color: #2ecc71;">
              🌿 ${fertCat}
            </div>
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%); padding: 12px 14px 8px;">
              <h4 style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin: 0; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">${fertName}</h4>
            </div>
          </div>

          <div style="padding: 14px 16px;">
            <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 12px;">
              ${fertDesc}
            </p>

            <div style="background: var(--bg-primary); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 12px;">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                ${l === 'te' ? 'సిఫార్సు చేయబడిన మోతాదు (ICAR):' : (l === 'hi' ? 'अनुशंसित मात्रा (ICAR):' : 'Recommended Dosage (ICAR):')}
              </div>
              <div style="font-size: 0.9rem; font-weight: 800; color: var(--primary); margin-top: 2px;">
                ⚖️ ${fertDose}
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${fert.benefitsEn.map(b => `<span style="font-size: 0.72rem; background: rgba(46, 204, 113, 0.15); color: var(--primary); padding: 3px 8px; border-radius: 12px; font-weight: 700;">✓ ${b}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    });

    resultsContainer.innerHTML = fertsHtml;
    return;
  }

  // ELSE: CROPS TAB (Default View with Real-Life Crop Photos + Stage-Wise Fertilizer Photos)
  const scoredCrops = CROPS_AGRONOMIC_DB.map(crop => {
    let score = 50;

    if (crop.seasons.includes(currentSeason)) score += 20;
    if (crop.soils.includes(currentSoil)) score += 20;

    if (currentPh >= crop.minPh && currentPh <= crop.maxPh) {
      score += 15;
    } else {
      score -= Math.abs(currentPh - (crop.minPh + crop.maxPh) / 2) * 10;
    }

    const waterCompatible = crop.waterType.includes(currentWater);
    if (waterCompatible) {
      score += 15;
    } else {
      score -= 30;
    }

    const isDrylandWarning = crop.isWaterIntensive && (currentWater === 'limited_borewell' || currentWater === 'rainfed');

    return {
      ...crop,
      suitabilityScore: Math.max(15, Math.min(98, Math.round(score))),
      isDrylandWarning
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  let html = subTabHtml;
  scoredCrops.forEach(crop => {
    const isRecommended = crop.suitabilityScore >= 80;
    let displayName = crop.nameEn;
    if (l === 'te') displayName = crop.nameTe;
    else if (l === 'hi') displayName = crop.nameHi || crop.nameEn;

    const cropImgSrc = CROP_IMAGES[crop.imgKey] || 'images/crops/chili.jpg';

    const orgBasal = l === 'te' ? crop.npkBasal.organicTe : (l === 'hi' ? crop.npkBasal.organicHi : crop.npkBasal.organicEn);
    const orgVeg = l === 'te' ? crop.npkVegetative.organicTe : (l === 'hi' ? crop.npkVegetative.organicHi : crop.npkVegetative.organicEn);
    const orgFlowering = l === 'te' ? crop.npkFlowering.organicTe : (l === 'hi' ? crop.npkFlowering.organicHi : crop.npkFlowering.organicEn);

    const fertNameBasal = l === 'te' ? crop.npkBasal.fertilizerNameTe : (l === 'hi' ? crop.npkBasal.fertilizerNameHi : crop.npkBasal.fertilizerNameEn);
    const fertNameVeg = l === 'te' ? crop.npkVegetative.fertilizerNameTe : (l === 'hi' ? crop.npkVegetative.fertilizerNameHi : crop.npkVegetative.fertilizerNameEn);
    const fertNameFlowering = l === 'te' ? crop.npkFlowering.fertilizerNameTe : (l === 'hi' ? crop.npkFlowering.fertilizerNameHi : crop.npkFlowering.fertilizerNameEn);

    html += `
      <div class="card" style="border: 1px solid var(--border-color); border-left: 6px solid ${crop.isDrylandWarning ? 'var(--danger)' : (isRecommended ? 'var(--primary)' : 'var(--border-color)')}; margin-bottom: 20px; overflow: hidden; padding: 0; border-radius: 12px; background: var(--bg-card); box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
        
        <!-- Top Real-Life Crop Photograph Banner (Full Width for 9:16 Mobile Aspect Ratio) -->
        <div style="position: relative; width: 100%; height: 185px; background: #0c1a12; overflow: hidden;">
          <img src="${cropImgSrc}" alt="${displayName}" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
          
          <!-- Suitability Floating Tag -->
          <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); padding: 5px 12px; border-radius: 20px; border: 1px solid ${isRecommended ? 'rgba(46, 204, 113, 0.6)' : 'rgba(255,255,255,0.25)'}; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 1.05rem; font-weight: 900; color: ${isRecommended ? '#2ecc71' : '#f1c40f'};">${crop.suitabilityScore}%</span>
            <span style="font-size: 0.72rem; color: #ffffff; font-weight: 700;">${l === 'te' ? 'అనుకూలత' : (l === 'hi' ? 'अनुकूलता' : 'Match')}</span>
          </div>

          <!-- Bottom Gradient Caption with Crop Name -->
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 60%, transparent 100%); padding: 16px 14px 8px;">
            <h4 style="font-size: 1.2rem; font-weight: 800; color: #ffffff; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.85);">
              ${displayName}
            </h4>
            <div style="font-size: 0.78rem; color: #d0f0c0; margin-top: 3px; font-weight: 600;">
              ⏱️ ${crop.durationDays} &nbsp;|&nbsp; ⚖️ ${crop.expectedYield}
            </div>
          </div>
        </div>
        
        <div style="padding: 14px 16px;">
          ${crop.isDrylandWarning ? `
            <div style="margin-bottom: 12px; padding: 10px 12px; background: #fdf2e9; border: 1px solid #f5b7b1; border-radius: 8px; color: #922b21; font-size: 0.8rem; font-weight: 700;">
              ⚠️ ${l === 'te' 
                ? 'హెచ్చరిక: పరిమిత నీటి లభ్యత గల ప్రాంతాలలో అధిక నీటి ఆధారిత పంటను సాగు చేయడం వల్ల బోర్‌వెల్ ఎండిపోయే ప్రమాదం ఉంది!' 
                : (l === 'hi' ? 'चेतावनी: सीमित जल क्षेत्रों में अधिक जल-गहन फसल लगाने से भूजल संकट एवं नुकसान का जोखिम है!' : 'Water Deficit Alert: Allocating a water-intensive crop in a limited-water parcel triggers severe groundwater depletion!')}
            </div>
          ` : ''}

          <!-- Stage-Wise Fertilizer Schedule with Real-Life Fertilizer Photos -->
          <div style="background: var(--bg-primary); padding: 12px; border-radius: 10px; border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h5 style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary); margin: 0;">
                🧪 ${l === 'te' ? 'దశలవారీ ఎరువుల ప్రణాళిక (ICAR ప్రమాణాలు):' : (l === 'hi' ? 'चरणबद्ध उर्वरक सारणी (ICAR मानक):' : 'Stage-Wise Fertilizer Schedule (ICAR Standards):')}
              </h5>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
              
              <!-- 1. Basal Application -->
              <div style="display: flex; gap: 10px; align-items: center; background: var(--bg-card); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="width: 52px; height: 52px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: #16241b; border: 1px solid var(--border-color);">
                  <img src="${crop.npkBasal.fertilizerImg}" alt="${fertNameBasal}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <strong style="font-size: 0.82rem; color: var(--text-primary);">
                      ${l === 'te' ? '1. ప్రాథమిక ఎరువు (విత్తే ముందు):' : (l === 'hi' ? '1. बुवाई पूर्व बेसल खाद:' : '1. Basal Application:')}
                    </strong>
                    <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">NPK ${crop.npkBasal.n}:${crop.npkBasal.p}:${crop.npkBasal.k}</span>
                  </div>
                  <div style="color: var(--primary); font-size: 0.76rem; font-weight: 700; margin-top: 2px;">
                    🌿 ${fertNameBasal}
                  </div>
                  <div style="color: var(--text-secondary); font-size: 0.73rem; margin-top: 1px;">
                    ${orgBasal}
                  </div>
                </div>
              </div>

              <!-- 2. Vegetative Phase -->
              <div style="display: flex; gap: 10px; align-items: center; background: var(--bg-card); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="width: 52px; height: 52px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: #16241b; border: 1px solid var(--border-color);">
                  <img src="${crop.npkVegetative.fertilizerImg}" alt="${fertNameVeg}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <strong style="font-size: 0.82rem; color: var(--text-primary);">
                      ${l === 'te' ? '2. శాఖీయ పెరుగుదల దశ:' : (l === 'hi' ? '2. वानस्पतिक वृद्धि चरण:' : '2. Vegetative Phase:')}
                    </strong>
                    <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">NPK ${crop.npkVegetative.n}:${crop.npkVegetative.p}:${crop.npkVegetative.k}</span>
                  </div>
                  <div style="color: var(--primary); font-size: 0.76rem; font-weight: 700; margin-top: 2px;">
                    🌿 ${fertNameVeg}
                  </div>
                  <div style="color: var(--text-secondary); font-size: 0.73rem; margin-top: 1px;">
                    ${orgVeg}
                  </div>
                </div>
              </div>

              <!-- 3. Flowering & Yield Phase -->
              <div style="display: flex; gap: 10px; align-items: center; background: var(--bg-card); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="width: 52px; height: 52px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: #16241b; border: 1px solid var(--border-color);">
                  <img src="${crop.npkFlowering.fertilizerImg}" alt="${fertNameFlowering}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <strong style="font-size: 0.82rem; color: var(--text-primary);">
                      ${l === 'te' ? '3. పూత & కాయ దశ:' : (l === 'hi' ? '3. पुष्पन एवं फल चरण:' : '3. Flowering & Yield Phase:')}
                    </strong>
                    <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">NPK ${crop.npkFlowering.n}:${crop.npkFlowering.p}:${crop.npkFlowering.k}</span>
                  </div>
                  <div style="color: var(--primary); font-size: 0.76rem; font-weight: 700; margin-top: 2px;">
                    🌿 ${fertNameFlowering}
                  </div>
                  <div style="color: var(--text-secondary); font-size: 0.73rem; margin-top: 1px;">
                    ${orgFlowering}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    `;
  });

  resultsContainer.innerHTML = html;
}

window.updateAdvisorUI = updateAdvisorUI;
window.switchAdvisorSubTab = switchAdvisorSubTab;
