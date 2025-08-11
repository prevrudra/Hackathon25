-- Create courts table for individual courts within venues
CREATE TABLE IF NOT EXISTS courts (
    id SERIAL PRIMARY KEY,
    venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sport_type VARCHAR(100) NOT NULL,
    price_per_hour DECIMAL(10,2) NOT NULL,
    description TEXT,
    images TEXT[], -- Array of court-specific images
    operating_hours JSONB, -- Store operating hours as JSON
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_courts_venue ON courts(venue_id);
CREATE INDEX IF NOT EXISTS idx_courts_sport ON courts(sport_type);
CREATE INDEX IF NOT EXISTS idx_courts_active ON courts(is_active);
