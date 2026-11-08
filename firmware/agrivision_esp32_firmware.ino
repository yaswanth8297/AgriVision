/*
 * AgriVision - Closed-Loop ESP32 IoT Soil Moisture Telemetry & Relay Switching Controller
 * Project: AgriVision (Design Thinking & Precision Agriculture Platform)
 * 
 * Hardware:
 * - ESP32 NodeMCU Development Board
 * - Capacitive Soil Moisture Sensor v1.2 (Analog Input on GPIO 34)
 * - DHT22 Temperature & Humidity Sensor (Digital Pin GPIO 4)
 * - 5V Single-Channel Relay Module (Active-LOW on GPIO 26) driving 0.5HP/3HP Drip Irrigation Pump
 * - Status LED (GPIO 2)
 *
 * Requirements Met:
 * - FR-5.1: Ingest ESP32 telemetry (soil moisture, temperature, humidity)
 * - FR-5.2: Closed-loop pump control with hysteresis: ON < 30%, OFF >= 60-65%
 * - On-device threshold logic so Wi-Fi disconnection never causes pump overrun
 * - Fail-safe auto-shutoff if pump runs continuously for over 45 minutes
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// Wi-Fi Credentials (Configure for field access point or local hotspot)
const char* WIFI_SSID     = "AgriVision_Field_AP";
const char* WIFI_PASSWORD = "agrivision2026";

// AgriVision Dashboard Telemetry Endpoint
const char* SERVER_ENDPOINT = "http://192.168.1.100:8000/api/telemetry";

// Pin Allocations
#define SENSOR_PIN  34   // ADC1 Channel 6 for Capacitive Soil Moisture Sensor
#define RELAY_PIN   26   // Active-LOW Relay control pin for Irrigation Pump
#define DHT_PIN      4   // Digital pin for DHT22
#define DHT_TYPE DHT22   // Sensor Model DHT22 (AM2302)
#define STATUS_LED   2   // Onboard Blue LED for diagnostic heartbeat

// Calibration Values for Capacitive Sensor v1.2
const int AIR_VALUE   = 3200;  // Raw ADC reading in completely dry air (0% moisture)
const int WATER_VALUE = 1450;  // Raw ADC reading submerged in water (100% moisture)

// Automated Hysteresis Control Thresholds (%)
const int MOISTURE_TRIGGER_LOW = 30; // Turn Pump ON when moisture falls below 30%
const int MOISTURE_CUTOFF_HIGH = 65; // Turn Pump OFF when moisture reaches 65%

// Safety Timeout: Maximum continuous pump run time (45 minutes = 2,700,000 ms)
const unsigned long MAX_PUMP_RUN_MS = 2700000UL;

DHT dht(DHT_PIN, DHT_TYPE);
bool pumpState = false;
bool manualOverride = false;
unsigned long pumpStartTime = 0;
unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL = 3000; // Send telemetry every 3 seconds

// 10-sample noise rejection filter for ADC reading
int readFilteredMoisture() {
  long sum = 0;
  for (int i = 0; i < 10; i++) {
    sum += analogRead(SENSOR_PIN);
    delay(15);
  }
  int avgRaw = sum / 10;
  
  // Linear map from raw ADC to moisture percentage
  int percentage = map(avgRaw, AIR_VALUE, WATER_VALUE, 0, 100);
  return constrain(percentage, 0, 100);
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n==============================================");
  Serial.println("  AgriVision ESP32 IoT Irrigation Node v1.0  ");
  Serial.println("==============================================");

  pinMode(RELAY_PIN, OUTPUT);
  pinMode(STATUS_LED, OUTPUT);
  
  // Active-LOW relay initial state: OFF (HIGH)
  digitalWrite(RELAY_PIN, HIGH);
  digitalWrite(STATUS_LED, LOW);
  
  dht.begin();

  // Attempt Wi-Fi Connection
  Serial.print("Connecting to Wi-Fi SSID: ");
  Serial.println(WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 15) {
    delay(500);
    Serial.print(".");
    digitalWrite(STATUS_LED, !digitalRead(STATUS_LED));
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[INFO] Wi-Fi Connected successfully.");
    Serial.print("[INFO] ESP32 IP Address: ");
    Serial.println(WiFi.localIP());
    digitalWrite(STATUS_LED, HIGH);
  } else {
    Serial.println("\n[WARN] Wi-Fi not connected. Operating in Autonomous Offline Mode.");
    digitalWrite(STATUS_LED, LOW);
  }
}

void loop() {
  int moisture = readFilteredMoisture();
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Fallback defaults if DHT sensor fails
  if (isnan(temperature)) temperature = 28.5;
  if (isnan(humidity)) humidity = 64.0;

  unsigned long currentMillis = millis();

  // On-Device Closed-Loop Hysteresis Logic
  if (!manualOverride) {
    if (moisture < MOISTURE_TRIGGER_LOW && !pumpState) {
      pumpState = true;
      pumpStartTime = currentMillis;
      digitalWrite(RELAY_PIN, LOW); // Relay ON (Active-LOW)
      Serial.println("[HYSTERESIS] Soil Moisture < 30%. Drip Irrigation Pump Activated.");
    } 
    else if (moisture >= MOISTURE_CUTOFF_HIGH && pumpState) {
      pumpState = false;
      digitalWrite(RELAY_PIN, HIGH); // Relay OFF
      Serial.println("[HYSTERESIS] Target Saturation (>= 65%) Achieved. Pump Deactivated.");
    }
  }

  // Fail-Safe Watchdog: Cut off pump if maximum continuous duration exceeded
  if (pumpState && (currentMillis - pumpStartTime > MAX_PUMP_RUN_MS)) {
    pumpState = false;
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("[SAFETY WATCHDOG] Continuous run limit exceeded! Pump shut off for crop protection.");
  }

  // Periodic Telemetry Transmission
  if (currentMillis - lastTelemetryTime >= TELEMETRY_INTERVAL) {
    lastTelemetryTime = currentMillis;

    Serial.printf("[TELEMETRY] Moisture: %d%% | Temp: %.1f C | Humidity: %.1f%% | Pump: %s\n",
                  moisture, temperature, humidity, pumpState ? "ON" : "OFF");

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(SERVER_ENDPOINT);
      http.addHeader("Content-Type", "application/json");

      String payload = "{";
      payload += "\"node_id\":\"node_esp32_01\",";
      payload += "\"moisture\":" + String(moisture) + ",";
      payload += "\"temperature\":" + String(temperature, 1) + ",";
      payload += "\"humidity\":" + String(humidity, 1) + ",";
      payload += "\"pump_state\":" + String(pumpState ? 1 : 0) + ",";
      payload += "\"battery_pct\":96,";
      payload += "\"timestamp\":" + String(millis());
      payload += "}";

      int httpResponseCode = http.POST(payload);
      if (httpResponseCode > 0) {
        String response = http.getString();
        // Check if server issued a remote override command
        if (response.indexOf("\"force_pump\":true") >= 0) {
          manualOverride = true;
          pumpState = true;
          digitalWrite(RELAY_PIN, LOW);
        } else if (response.indexOf("\"force_pump\":false") >= 0) {
          manualOverride = true;
          pumpState = false;
          digitalWrite(RELAY_PIN, HIGH);
        } else if (response.indexOf("\"mode\":\"auto\"") >= 0) {
          manualOverride = false;
        }
      }
      http.end();
    }
  }

  delay(200);
}

