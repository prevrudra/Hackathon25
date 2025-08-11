-- Insert sample admin user
INSERT INTO users (email, password_hash, full_name, role, is_verified, is_active) VALUES
('admin@quickcourt.com', '$2b$10$example_hash', 'QuickCourt Admin', 'admin', TRUE, TRUE),
('owner@example.com', '$2b$10$example_hash', 'John Smith', 'facility_owner', TRUE, TRUE),
('user@example.com', '$2b$10$example_hash', 'Jane Doe', 'user', TRUE, TRUE);

-- Insert sample venues
INSERT INTO venues (owner_id, name, description, address, city, state, sports_supported, amenities, status) VALUES
(2, 'Elite Sports Complex', 'Premium sports facility with modern amenities', '123 Sports Ave', 'Mumbai', 'Maharashtra', 
 ARRAY['Badminton', 'Table Tennis', 'Squash'], 
 ARRAY['Parking', 'Changing Rooms', 'Cafeteria', 'Air Conditioning'], 'approved'),
(2, 'City Badminton Center', 'Dedicated badminton facility with professional courts', '456 Court Street', 'Delhi', 'Delhi',
 ARRAY['Badminton'], 
 ARRAY['Parking', 'Changing Rooms', 'Equipment Rental'], 'approved');

-- Insert sample courts
INSERT INTO courts (venue_id, name, sport_type, price_per_hour, operating_hours) VALUES
(1, 'Court A1', 'Badminton', 800.00, '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}}'),
(1, 'Court A2', 'Badminton', 800.00, '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}}'),
(1, 'TT Table 1', 'Table Tennis', 400.00, '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}}'),
(2, 'Premium Court 1', 'Badminton', 1000.00, '{"monday": {"open": "05:00", "close": "23:00"}, "tuesday": {"open": "05:00", "close": "23:00"}}'),
(2, 'Premium Court 2', 'Badminton', 1000.00, '{"monday": {"open": "05:00", "close": "23:00"}, "tuesday": {"open": "05:00", "close": "23:00"}}');

-- Insert sample bookings
INSERT INTO bookings (user_id, court_id, venue_id, booking_date, start_time, end_time, duration_hours, price_per_hour, total_amount, status, payment_status) VALUES
(3, 1, 1, CURRENT_DATE + INTERVAL '1 day', '18:00', '19:00', 1.0, 800.00, 800.00, 'confirmed', 'paid'),
(3, 2, 1, CURRENT_DATE + INTERVAL '2 days', '19:00', '20:00', 1.0, 800.00, 800.00, 'confirmed', 'paid');

-- Insert sample reviews
INSERT INTO reviews (user_id, venue_id, rating, title, comment, is_verified) VALUES
(3, 1, 5, 'Excellent facility!', 'Great courts and amazing service. Highly recommended!', TRUE),
(3, 2, 4, 'Good experience', 'Nice courts but could use better parking facilities.', TRUE);
