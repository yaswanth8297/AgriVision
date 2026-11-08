# 🌱 AgriVision – Mobile Farm Planner & IoT Platform (v1.4.0)

> **PRD v1.0 Production Implementation**  
> Mobile-First 9:16 Aspect Ratio Architecture, Real-Life Visualizations, AI Advisory & Hardware IoT Integration.  
> Derived from the AgriVision Product Requirements Document and the B.Tech CSE Design Thinking Project (Dr. L. Bullayya College of Engineering).

---

## 🚀 Overview

AgriVision is an accessible, web- and IoT-integrated farm planning platform designed for smallholder farmers to design, simulate, and optimize their agricultural land in **photorealistic 2D and 3D** before investing real capital.

### 🌟 Key Features

1. **📱 Mobile-First 9:16 Aspect Ratio Interface:**
   - Standard smartphone 9:16 aspect ratio enclosure with live status bar clock, battery, and 5G indicators.
   - Refined, minimalist **52px fixed bottom navigation bar** with simple micro-typography and balanced icons.
   - Segmented control for seamless switching between **🗺️ 2D Blueprint** and **🌐 3D WebGL** scenes.

2. **🌾 Real-Life Crop & Fertilizer Photography:**
   - **Real Crop Images (`images/crops/`):** High-resolution photography of Guntur Hope Chili, Taiwan Pink Guava, Finger Millet (Ragi), Banganapalli Mango, and BPT 5204 Samba Paddy.
   - **Real Fertilizer Images (`images/fertilizers/`):** High-resolution photography of Organic Vermicompost/FYM, Neem Cake bio-manure, Chemical NPK granules (19:19:19/DAP/MOP), and Fermented Jeevamrutham bio-liquid.
   - **Stage-Wise Fertilizer Schedule:** ICAR basal, vegetative, and flowering stages featuring thumbnail imagery and dosage per acre.
   - **Interactive Fertilizer Visual Guide:** Dedicated catalog with dosage instructions, microbial benefits, and ICAR guidelines.

3. **⚙️ Dedicated Settings & Configuration Hub:**
   - Quick-access gear icon (`⚙️`) in top header and 7th bottom navigation tab.
   - **Farmer Profile & Identity:** Name, mobile number, village, district, assigned KVK research station.
   - **Land & Irrigation System:** Measurement units (Acres, Hectares, Guntas, Cents), delivery system (Drip, Sprinkler, Furrow), pump rating (HP), borewell depth.
   - **Smart Pump Automation Limits:** Soil moisture triggers (Auto-ON `<30%`, Auto-OFF `>=65%`).
   - **ESP32 IoT Calibration:** Wi-Fi Node IP, telemetry interval, capacitive Air ADC (`3200`) and Water ADC (`1450`).
   - **Data Backup & Export:** One-click JSON export and LocalDB persistence.

4. **🔐 Authentication & Database Architecture:**
   - **Login & Sign-Up Interface:** Dedicated modal with **1-tap auto-filled demo accounts** for Farmer Apparao, Farmer Lakshmi, and KVK Agronomist Dr. Rao.
   - **Relational Schema (`data/schema.sql`):** Relational tables with indexes for users, farm plots, blueprint entities, IoT telemetry records, and pathology scans.
   - **Persistence (`data/database.json` & `js/db.js`):** Client-side IndexedDB & LocalStorage engine with REST endpoints.

5. **🌐 Full Trilingual Accessibility:**
   - Defaulted to **English (`en`)** with instant, zero-leakage switching to **Telugu (`te`)** and **Hindi (`hi`)**.
   - Integrated Web Speech API speech-to-text recognition and text-to-speech audio feedback.

6. **🌿 Photorealistic 2D & 3D Blueprints:**
   - **2D Canvas:** Real-life loam soil, 5m CAD grid, crushed gravel access road, striped vegetable beds, glazed polyhouses with internal rows, water ripples, and layered tree canopies with species fruit accents.
   - **3D WebGL (Three.js):** Raised cultivation mounds, procedural terrain, translucent greenhouse with interior beds, water pond with depth, perimeter wooden fence, and soft shadows.

7. **💧 Closed-Loop ESP32 IoT Irrigation:**
   - Continuous soil moisture telemetry with automated hysteresis pump control.
   - Production Arduino C++ firmware (`firmware/agrivision_esp32_firmware.ino`) with capacitive sensor filtering and watchdog fail-safes.

8. **🔬 Neural Leaf Disease Scanner & Weather Calendar:**
   - MobileNetV2 leaf disease scanner with diagnostic confidence scores and dual organic/chemical ICAR remedies.
   - Regional 5-day weather forecasts and seasonal crop calendar.

---

## 📦 Directory Structure

```
AGRIVISIONPROJECT/
├── index.html                   # Master mobile 9:16 layout with pre-rendered crops & settings
├── manifest.json                # PWA Web App Manifest for mobile installation
├── sw.js                        # PWA Service Worker (v1.4.0) with offline image caching
├── server.ps1                   # Zero-dependency local multi-threaded HTTP server in PowerShell
├── start_server.bat             # 1-Click launcher to run local server and open default browser
├── README.md                    # Project documentation and user guide
├── css/
│   └── styles.css               # Design system with 9:16 smartphone shell, high contrast & sleek nav
├── data/
│   ├── database.json            # Seed database records (demo accounts, farm plots, telemetry)
│   └── schema.sql               # Full relational SQL schema (SQLite/PostgreSQL compatible)
├── firmware/
│   └── agrivision_esp32_firmware.ino # Production Arduino C++ firmware for ESP32, capacitive sensor & relay
├── icons/
│   ├── icon-192.png             # PWA 192x192 app icon
│   └── icon-512.png             # PWA 512x512 app icon
├── images/
│   ├── crops/
│   │   ├── chili.jpg            # Real-life Guntur Hope Chili photograph
│   │   ├── guava.jpg            # Real-life Taiwan Pink Guava photograph
│   │   ├── mango.jpg            # Real-life Banganapalli Mango photograph
│   │   ├── millet.jpg           # Real-life Finger Millet (Ragi) photograph
│   │   └── paddy.jpg            # Real-life BPT 5204 Samba Paddy photograph
│   └── fertilizers/
│       ├── jeevamrutham.jpg     # Real-life Jeevamrutham bio-liquid photograph
│       ├── neem_cake.jpg        # Real-life Organic Neem Cake bio-manure photograph
│       ├── npk_granules.jpg     # Real-life Chemical NPK mineral granules photograph
│       └── vermicompost.jpg     # Real-life Organic Vermicompost / FYM photograph
├── js/
│   ├── app.js                   # Master state orchestrator, trilingual translation engine (EN, TE, HI)
│   ├── auth.js                  # Authentication controller & 1-tap demo account auto-fill
│   ├── crop_advisor.js          # Module 3: AI Crop & Fertilizer Advisor with real-life imagery
│   ├── db.js                    # Local database manager (IndexedDB / LocalStorage)
│   ├── disease_scanner.js       # Module 4: MobileNetV2 leaf disease scanner
│   ├── iot_controller.js        # Module 5: Closed-loop ESP32 IoT telemetry & hysteresis pump
│   ├── method_optimizer.js      # Module 2: Organic vs Conventional vs Integrated comparison
│   ├── planner2d.js             # Module 1: Real-life 2D SVG canvas blueprint & collision engine
│   ├── planner3d.js             # Module 1: Real-life Three.js 3D WebGL scene & OrbitControls
│   ├── profile.js               # Module 7: Settings & Farmer Profile Manager
│   ├── telugu_voice.js          # Trilingual speech recognition & synthesis
│   └── weather_calendar.js      # Module 6: Regional 5-day weather & seasonal agricultural tasks
└── libs/
    ├── three.min.js             # Three.js 3D WebGL runtime (bundled locally for 100% offline support)
    └── OrbitControls.js         # Three.js OrbitControls for 360-degree rotation, pan, and zoom
```

---

## ⚡ How to Run

### Option 1: One-Click Quick Launch
Double-click [`start_server.bat`](file:///c:/Users/vijay/OneDrive/Documents/AGRIVISIONPROJECT/start_server.bat) in the project root. This starts the local server and automatically launches AgriVision in your browser at `http://localhost:8080/`.

### Option 2: PowerShell Terminal
Open PowerShell in this directory and execute:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Then visit `http://localhost:8080` in Chrome, Edge, or Firefox.
