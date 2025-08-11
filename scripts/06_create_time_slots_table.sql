-- Create time slots table for managing court availability
CREATE TABLE IF NOT EXISTS time_slots (
    id SERIAL PRIMARY KEY,
    court_id INTEGER REFERENCES courts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_blocked BOOLEAN DEFAULT FALSE, -- For maintenance or owner blocking
    block_reason VARCHAR(255),
    price_override DECIMAL(10,2), -- Override default court price for special occasions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_time_slots_court ON time_slots(court_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_date ON time_slots(date);
CREATE INDEX IF NOT EXISTS idx_time_slots_available ON time_slots(is_available);

-- Ensure no overlapping time slots for same court
CREATE UNIQUE INDEX IF NOT EXISTS idx_time_slots_unique 
ON time_slots(court_id, date, start_time, end_time);
