/**
 * AgriVision - Vernacular Trilingual Speech Engine (Web Speech API)
 * Native Telugu (te-IN), Hindi (hi-IN), and Indian English (en-IN)
 * Speech-to-Text (STT) Recognition & Text-to-Speech (TTS) Synthesis
 */

let speechRecognition = null;
let isListening = false;

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('[AgriVision] Web Speech Recognition API not supported in this browser.');
    return;
  }

  speechRecognition = new SpeechRecognition();
  speechRecognition.continuous = false;
  speechRecognition.interimResults = false;

  speechRecognition.onstart = () => {
    isListening = true;
    updateVoiceUIState();
    const l = STATE.lang;
    const msg = l === 'te' 
      ? 'వాయిస్ వింటోంది... మాట్లాడండి' 
      : (l === 'hi' ? 'आवाज़ सुन रहा है... बोलिए' : 'Listening... Speak command now');
    showToast(msg);
  };

  speechRecognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    processVoiceCommand(transcript);
  };

  speechRecognition.onerror = (event) => {
    console.warn('[AgriVision Speech] Recognition error:', event.error);
    isListening = false;
    updateVoiceUIState();
  };

  speechRecognition.onend = () => {
    isListening = false;
    updateVoiceUIState();
  };
}

function toggleVoiceListening() {
  if (!speechRecognition) {
    initSpeechRecognition();
  }

  if (!speechRecognition) {
    speakFarmStatusOverview();
    return;
  }

  if (isListening) {
    speechRecognition.stop();
  } else {
    // Select speech recognition language
    if (STATE.lang === 'te') speechRecognition.lang = 'te-IN';
    else if (STATE.lang === 'hi') speechRecognition.lang = 'hi-IN';
    else speechRecognition.lang = 'en-IN';

    try {
      speechRecognition.start();
    } catch (e) {
      console.warn('Speech start error:', e);
    }
  }
}

function updateVoiceUIState() {
  const micFab = document.getElementById('voice-mic-fab');
  const statusPill = document.getElementById('voice-status-pill');
  const l = STATE.lang;

  if (micFab) {
    micFab.classList.toggle('active', isListening);
  }
  if (statusPill) {
    statusPill.classList.toggle('recording', isListening);
    const labelEl = statusPill.querySelector('.voice-label');
    if (labelEl) {
      if (isListening) {
        labelEl.textContent = l === 'te' ? 'వింటోంది...' : (l === 'hi' ? 'सुन रहा है...' : 'Listening...');
      } else {
        labelEl.textContent = l === 'te' ? 'వాయిస్ సలహాదారు' : (l === 'hi' ? 'आवाज़ सहायक' : 'Voice Assistant');
      }
    }
  }
}

function processVoiceCommand(cmd) {
  showToast(`🎙️ "${cmd}"`);
  const l = STATE.lang;

  // Farm Status
  if (cmd.includes('స్థితి') || cmd.includes('status') || cmd.includes('తేమ') || cmd.includes('moisture') || cmd.includes('स्थिति') || cmd.includes('नमी')) {
    speakFarmStatusOverview();
  }
  // Pump Control
  else if (cmd.includes('పంప్') || cmd.includes('pump') || cmd.includes('నీరు') || cmd.includes('water') || cmd.includes('पंप') || cmd.includes('पानी')) {
    switchTab('iot');
    const msg = l === 'te' 
      ? `డ్రిప్ పంప్ ప్రస్తుతం ${STATE.telemetry.pump ? 'నడుస్తోంది' : 'నిలిపివేయబడింది'}. నేల తేమ ${STATE.telemetry.moisture} శాతం.`
      : (l === 'hi' ? `ड्रिप पंप वर्तमान में ${STATE.telemetry.pump ? 'चालू है' : 'बंद है'}। मिट्टी की नमी ${STATE.telemetry.moisture} प्रतिशत है।` : `Drip pump is currently ${STATE.telemetry.pump ? 'active' : 'on standby'}. Soil moisture is ${STATE.telemetry.moisture} percent.`);
    speakText(msg);
  }
  // Diseases / Leaf Scanner
  else if (cmd.includes('తెగులు') || cmd.includes('రోగం') || cmd.includes('disease') || cmd.includes('leaf') || cmd.includes('రోగ') || cmd.includes('बीमारी') || cmd.includes('स्कैनर')) {
    switchTab('pathology');
    const msg = l === 'te' 
      ? 'ఆకు తెగుళ్ల స్కానర్ తెరవబడింది.' 
      : (l === 'hi' ? 'पत्ती रोग स्कैनर खोला गया है।' : 'Leaf Disease Scanner opened.');
    speakText(msg);
  }
  // Farm Planner / Blueprint
  else if (cmd.includes('ప్లాన్') || cmd.includes('డిజైన్') || cmd.includes('planner') || cmd.includes('blueprint') || cmd.includes('लेआउट') || cmd.includes('नक्शा')) {
    switchTab('planner');
    const msg = l === 'te' 
      ? '2D మరియు 3D పొలం డిజైనర్ తెరవబడింది.' 
      : (l === 'hi' ? '2D एवं 3D खेत डिज़ाइनर खोला गया।' : 'Farm Designer 2D and 3D studio opened.');
    speakText(msg);
  }
  // Fertilizer / Crops
  else if (cmd.includes('ఎరువులు') || cmd.includes('పంట') || cmd.includes('crop') || cmd.includes('fertilizer') || cmd.includes('फसल') || cmd.includes('खाद')) {
    switchTab('advisor');
    const msg = l === 'te' 
      ? 'పంట మరియు ఎరువుల సలహాదారు తెరవబడింది.' 
      : (l === 'hi' ? 'फसल एवं खाद सलाहकार खोला गया।' : 'Crop and Fertilizer Advisor opened.');
    speakText(msg);
  }
  // Farming Methods
  else if (cmd.includes('పద్ధతులు') || cmd.includes('సేంద్రీయ') || cmd.includes('organic') || cmd.includes('optimizer') || cmd.includes('जैविक') || cmd.includes('पद्धति')) {
    switchTab('optimizer');
    const msg = l === 'te' 
      ? 'వ్యవసాయ పద్ధతుల విశ్లేషణ తెరవబడింది.' 
      : (l === 'hi' ? 'कृषि पद्धति तुलना खोली गई।' : 'Farming Method Optimizer opened.');
    speakText(msg);
  }
  // Profile
  else if (cmd.includes('ప్రొఫైల్') || cmd.includes('profile') || cmd.includes('settings') || cmd.includes('సెట్టింగ్') || cmd.includes('प्रोफ़ाइल')) {
    switchTab('profile');
  }
  else {
    speakFarmStatusOverview();
  }
}

function speakFarmStatusOverview() {
  if (!('speechSynthesis' in window)) {
    showToast('Web Speech API is not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel();
  const parcel = getActiveParcel();
  const moisture = STATE.telemetry.moisture;
  const l = STATE.lang;

  let text = '';
  if (l === 'te') {
    const pumpStatus = STATE.telemetry.pump ? 'నడుస్తోంది' : 'నిలిపివేయబడింది';
    text = `నమస్కారం రైతు సోదరా. మీ క్రియాశీల కమతం ${parcel.nameTe}. ప్రస్తుత నేల తేమ ${moisture} శాతం ఉంది. డ్రిప్ పంప్ ప్రస్తుతం ${pumpStatus}. పొలం వాతావరణం మరియు నేల ఆరోగ్య సూచిక అనుకూలంగా ఉన్నాయి.`;
  } else if (l === 'hi') {
    const pumpStatus = STATE.telemetry.pump ? 'चालू है' : 'बंद है';
    text = `नमस्ते किसान भाई। आपका सक्रिय खेत ${parcel.nameHi || parcel.nameEn} है। वर्तमान मिट्टी की नमी ${moisture} प्रतिशत है। ड्रिप सिंचाई पंप ${pumpStatus}। खेत की पर्यावरणीय स्थिति अनुकूल है।`;
  } else {
    const pumpStatus = STATE.telemetry.pump ? 'is active' : 'is on standby';
    text = `Hello farmer. Active plot is ${parcel.nameEn}. Current soil moisture is ${moisture} percent. Drip irrigation pump ${pumpStatus}. Farm environmental health index is optimal.`;
  }

  speakText(text);
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  if (STATE.lang === 'te') utterance.lang = 'te-IN';
  else if (STATE.lang === 'hi') utterance.lang = 'hi-IN';
  else utterance.lang = 'en-IN';

  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
}

window.initSpeechRecognition = initSpeechRecognition;
window.toggleVoiceListening = toggleVoiceListening;
window.speakFarmStatusOverview = speakFarmStatusOverview;
window.speakText = speakText;
