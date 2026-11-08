-- AgriVision Relational Database Schema (SQLite / PostgreSQL)
-- Core Data Model derived from AgriVision PRD v1.0 & Project Report Section 6

-- 1. Users & Authentication Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(30) DEFAULT 'farmer', -- 'farmer', 'agronomist', 'fpo_admin'
    village VARCHAR(100),
    mandal VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Andhra Pradesh',
    kvk_center VARCHAR(150),
    default_lang VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Farm Plots (Parcels) Table
CREATE TABLE IF NOT EXISTS farm_plots (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    name VARCHAR(150) NOT NULL,
    acres DECIMAL(6, 2) NOT NULL,
    length_meters INTEGER NOT NULL,
    width_meters INTEGER NOT NULL,
    soil_type VARCHAR(50) NOT NULL,       -- 'red_loam', 'black_clay', 'alluvial', 'laterite'
    water_source VARCHAR(50) NOT NULL,    -- 'borewell', 'limited_borewell', 'canal', 'rainfed'
    borewell_yield_lph INTEGER DEFAULT 2400,
    farming_method VARCHAR(50) DEFAULT 'integrated', -- 'organic', 'conventional', 'integrated'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Farm Blueprint Entities (Crops, Orchards, Polyhouses, Ponds)
CREATE TABLE IF NOT EXISTS farm_entities (
    id VARCHAR(64) PRIMARY KEY,
    plot_id VARCHAR(64) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,     -- 'crop', 'orchard', 'greenhouse', 'pond', 'road'
    name_en VARCHAR(150) NOT NULL,
    name_te VARCHAR(150),
    name_hi VARCHAR(150),
    x_pos DECIMAL(8, 2) NOT NULL,
    y_pos DECIMAL(8, 2) NOT NULL,
    width DECIMAL(8, 2) NOT NULL,
    height DECIMAL(8, 2) NOT NULL,
    spacing DECIMAL(6, 2),                -- species spacing in meters for orchards
    crop_variety VARCHAR(100),
    metadata_json TEXT,
    FOREIGN KEY (plot_id) REFERENCES farm_plots(id) ON DELETE CASCADE
);

-- 4. ESP32 IoT Sensor Telemetry & Actuation Logs
CREATE TABLE IF NOT EXISTS iot_telemetry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id VARCHAR(64) NOT NULL,
    plot_id VARCHAR(64),
    soil_moisture_pct INTEGER NOT NULL,
    soil_temp_c DECIMAL(5, 2) NOT NULL,
    air_humidity_pct INTEGER NOT NULL,
    tank_level_pct INTEGER,
    pump_state BOOLEAN NOT NULL,
    power_active BOOLEAN DEFAULT 1,
    battery_pct INTEGER DEFAULT 95,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Leaf Pathology Scan Logs
CREATE TABLE IF NOT EXISTS pathology_scans (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    crop VARCHAR(100) NOT NULL,
    disease_id VARCHAR(100) NOT NULL,
    disease_name VARCHAR(150) NOT NULL,
    confidence_pct DECIMAL(5, 2) NOT NULL,
    image_url TEXT,
    remedy_org TEXT,
    remedy_chem TEXT,
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indices for Fast Geospatial & Telemetry Lookups
CREATE INDEX IF NOT EXISTS idx_plots_user ON farm_plots(user_id);
CREATE INDEX IF NOT EXISTS idx_entities_plot ON farm_entities(plot_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_node_time ON iot_telemetry(node_id, recorded_at);

