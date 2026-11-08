/**
 * AgriVision - Local & Offline Database Manager (IndexedDB / LocalStorage Engine)
 * Manages users, authentication sessions, farm parcels, and IoT telemetry records
 */

const DB = {
  dbName: 'AgriVision_DB',
  version: 1,
  dbInstance: null,

  // Initialize and Seed Database
  init: async function() {
    return new Promise((resolve) => {
      // Check if users already exist in localStorage
      let users = localStorage.getItem('agrivision_users');
      let plots = localStorage.getItem('agrivision_plots');

      if (!users || !plots) {
        // Seed default demo database
        const seedUsers = [
          {
            id: 'usr_apparao',
            name: 'Apparao Nimmana',
            email: 'apparao@agrivision.in',
            password: 'farmer123',
            phone: '+91 98480 22338',
            role: 'farmer',
            village: 'Anakapalli Rural',
            district: 'Visakhapatnam',
            state: 'Andhra Pradesh',
            kvkCenter: 'KVK Kondempudi, Anakapalli',
            defaultLang: 'en',
            avatar: '👨‍🌾'
          },
          {
            id: 'usr_lakshmi',
            name: 'Lakshmi Penumatsa',
            email: 'lakshmi@agrivision.in',
            password: 'farmer123',
            phone: '+91 94901 55678',
            role: 'farmer',
            village: 'Bhogapuram',
            district: 'Vizianagaram',
            state: 'Andhra Pradesh',
            kvkCenter: 'KVK Vizianagaram',
            defaultLang: 'en',
            avatar: '👩‍🌾'
          },
          {
            id: 'usr_kvk_expert',
            name: 'Dr. K. Rao (Agronomist)',
            email: 'kvk.expert@agrivision.in',
            password: 'expert123',
            phone: '+91 89127 44321',
            role: 'agronomist',
            village: 'Kondempudi Research Station',
            district: 'Visakhapatnam',
            state: 'Andhra Pradesh',
            kvkCenter: 'ICAR - Central KVK Anakapalli',
            defaultLang: 'en',
            avatar: '🔬'
          }
        ];

        const seedPlots = [
          {
            id: 'plot_apparao_01',
            userId: 'usr_apparao',
            nameEn: 'Apparao Plot 1 (Anakapalli)',
            nameTe: 'అప్పారావు పొలం 1 (అనకాపల్లి)',
            nameHi: 'अप्पाराव खेत 1 (अनकापल्ली)',
            acres: 2.5,
            L: 100,
            W: 80,
            soilType: 'red_loam',
            waterSource: 'borewell',
            borewellYieldLph: 2400,
            crop: 'guava_veg',
            farmingMethod: 'integrated',
            objs: [
              { id: 'pond_1', type: 'pond', nameEn: 'Rainwater Retention Pond', nameTe: 'వర్షపు నీటి నిల్వ కుంట', nameHi: 'वर्षा जल संचयन तालाब', x: 74, y: 56, w: 20, h: 18 },
              { id: 'gh_1', type: 'greenhouse', nameEn: 'Polyhouse Greenhouse', nameTe: 'పాలీహౌస్ గ్రీన్‌హౌస్', nameHi: 'पॉलीहाउस ग्रीनहाउस', x: 6, y: 6, w: 22, h: 14 },
              { id: 'crop_1', type: 'crop', nameEn: 'High-Yield Chili Beds', nameTe: 'మిరప & కూరగాయల బెడ్లు', nameHi: 'मिर्च एवं सब्जी की क्यारियां', x: 6, y: 24, w: 32, h: 48, crop: 'chili' },
              { id: 'orchard_1', type: 'orchard', nameEn: 'Taiwan Guava Orchard (3m)', nameTe: 'జామ పండ్ల తోట (3మీ గ్రిడ్)', nameHi: 'अमरूद का बाग (3 मी. ग्रिड)', x: 42, y: 6, w: 52, h: 46, spacing: 3, crop: 'guava' }
            ]
          },
          {
            id: 'plot_lakshmi_01',
            userId: 'usr_lakshmi',
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
              { id: 'pond_dry', type: 'pond', nameEn: 'Farm Pond Catchment', nameTe: 'చెరువు నిల్వ గుంట', nameHi: 'खेत तालाब जलाशय', x: 105, y: 80, w: 26, h: 26 },
              { id: 'orchard_mango', type: 'orchard', nameEn: 'Mango Orchard (6m Grid)', nameTe: 'మామిడి తోట (6మీ స్పేసింగ్)', nameHi: 'आम का बाग (6 मी. ग्रिड)', x: 8, y: 8, w: 70, h: 95, spacing: 6, crop: 'mango' },
              { id: 'crop_millet', type: 'crop', nameEn: 'Finger Millet Zone', nameTe: 'రాగి / చిరుధాన్యాల జోన్', nameHi: 'रागी / मोटा अनाज क्षेत्र', x: 84, y: 8, w: 46, h: 65, crop: 'millet' }
            ]
          }
        ];

        localStorage.setItem('agrivision_users', JSON.stringify(seedUsers));
        localStorage.setItem('agrivision_plots', JSON.stringify(seedPlots));
      }

      console.log('[AgriVision DB] Database initialized and verified.');
      resolve(true);
    });
  },

  // Get all users
  getUsers: function() {
    const raw = localStorage.getItem('agrivision_users');
    return raw ? JSON.parse(raw) : [];
  },

  // Authenticate user login
  login: function(identifier, password) {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();
    
    const user = users.find(u => 
      (u.email.toLowerCase() === cleanId || u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')) &&
      u.password === password
    );

    if (user) {
      this.setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials. Please check your email/phone and password.' };
  },

  // Register a new user
  signup: function(userData) {
    const users = this.getUsers();
    const cleanEmail = userData.email.trim().toLowerCase();
    
    // Check if user already exists
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists!' };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      phone: userData.phone.trim(),
      role: userData.role || 'farmer',
      village: userData.village || 'Anakapalli',
      district: userData.district || 'Visakhapatnam',
      state: 'Andhra Pradesh',
      kvkCenter: userData.kvkCenter || 'KVK Anakapalli',
      defaultLang: STATE.lang || 'en',
      avatar: userData.role === 'agronomist' ? '🔬' : '👨‍🌾'
    };

    users.push(newUser);
    localStorage.setItem('agrivision_users', JSON.stringify(users));

    // Create an initial starter farm plot for the new farmer
    const plots = this.getPlots();
    const newPlot = {
      id: 'plot_' + newUser.id,
      userId: newUser.id,
      nameEn: `${newUser.name}'s Farm Plot`,
      nameTe: `${newUser.name} వ్యవసాయ క్షేత్రం`,
      nameHi: `${newUser.name} का खेत`,
      acres: 2.0,
      L: 100,
      W: 80,
      soilType: 'red_loam',
      waterSource: 'borewell',
      borewellYieldLph: 2200,
      crop: 'chili',
      farmingMethod: 'integrated',
      objs: [
        { id: 'pond_init', type: 'pond', nameEn: 'Retention Pond', nameTe: 'కుంట', nameHi: 'तालाब', x: 74, y: 56, w: 20, h: 18 },
        { id: 'gh_init', type: 'greenhouse', nameEn: 'Polyhouse', nameTe: 'పాలీహౌస్', nameHi: 'पॉलीहाउस', x: 6, y: 6, w: 22, h: 14 },
        { id: 'crop_init', type: 'crop', nameEn: 'Vegetable Beds', nameTe: 'కూరగాయలు', nameHi: 'सब्जी', x: 6, y: 24, w: 32, h: 48, crop: 'chili' }
      ]
    };
    plots.push(newPlot);
    localStorage.setItem('agrivision_plots', JSON.stringify(plots));

    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  // Session Management
  getCurrentUser: function() {
    const raw = localStorage.getItem('agrivision_current_user');
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUser: function(user) {
    if (user) {
      localStorage.setItem('agrivision_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agrivision_current_user');
    }
  },

  logout: function() {
    this.setCurrentUser(null);
  },

  // Plots Management
  getPlots: function() {
    const raw = localStorage.getItem('agrivision_plots');
    return raw ? JSON.parse(raw) : [];
  },

  getUserPlots: function(userId) {
    const plots = this.getPlots();
    return plots.filter(p => p.userId === userId);
  },

  savePlot: function(plot) {
    const plots = this.getPlots();
    const idx = plots.findIndex(p => p.id === plot.id);
    if (idx >= 0) {
      plots[idx] = plot;
    } else {
      plots.push(plot);
    }
    localStorage.setItem('agrivision_plots', JSON.stringify(plots));
  }
};

window.DB = DB;

