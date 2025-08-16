-- Additional Test Data - 5 entries per table for testing
-- This script adds 5 new entries to each major table

-- Add 5 more users (3 facility owners, 2 regular users)
-- Removed hardcoded quickcourt.com users

-- Add 5 more venues
INSERT INTO venues (owner_id, name, description, address, city, state, postal_code, phone, email, sports_supported, amenities, rating, total_reviews, status) VALUES
((SELECT id FROM users WHERE email = 'owner21@quickcourt.com'), 'SportsMania Gurgaon', 'Ultra-modern sports facility with international standards', '555 Cyber Hub, DLF Phase 2', 'Gurgaon', 'Haryana', '122002', '+91-9876543401', 'info@sportsmania.com', ARRAY['Badminton', 'Table Tennis', 'Squash', 'Basketball'], ARRAY['Parking', 'Changing Rooms', 'Cafeteria', 'Air Conditioning', 'Equipment Rental', 'Pro Shop', 'Physiotherapy'], 4.7, 89, 'approved'),

((SELECT id FROM users WHERE email = 'owner22@quickcourt.com'), 'Ace Sports Academy Lucknow', 'Professional training academy with coaching facilities', '777 Gomti Nagar Extension', 'Lucknow', 'Uttar Pradesh', '226010', '+91-9876543402', 'academy@acesports.com', ARRAY['Badminton', 'Table Tennis'], ARRAY['Parking', 'Changing Rooms', 'Coaching Available', 'Equipment Rental', 'Air Conditioning'], 4.6, 67, 'approved'),

((SELECT id FROM users WHERE email = 'owner23@quickcourt.com'), 'Megaplex Sports Center', 'Largest sports complex in the region', '888 Sector 18', 'Noida', 'Uttar Pradesh', '201301', '+91-9876543403', 'mega@sports.com', ARRAY['Badminton', 'Table Tennis', 'Tennis', 'Squash', 'Basketball'], ARRAY['Parking', 'Changing Rooms', 'Cafeteria', 'Air Conditioning', 'Equipment Rental', 'Swimming Pool', 'Gym'], 4.8, 156, 'approved'),

((SELECT id FROM users WHERE email = 'owner21@quickcourt.com'), 'Riverside Sports Club', 'Scenic sports facility by the river', '999 Riverfront Road', 'Ahmedabad', 'Gujarat', '380009', '+91-9876543404', 'riverside@club.com', ARRAY['Badminton', 'Table Tennis', 'Tennis'], ARRAY['Parking', 'Changing Rooms', 'Cafeteria', 'Equipment Rental', 'River View'], 4.4, 92, 'approved'),

((SELECT id FROM users WHERE email = 'owner22@quickcourt.com'), 'Thunder Sports Arena', 'High-energy sports destination', '101 IT Park Road', 'Chandigarh', 'Chandigarh', '160101', '+91-9876543405', 'thunder@arena.com', ARRAY['Badminton', 'Table Tennis', 'Squash'], ARRAY['Parking', 'Changing Rooms', 'Cafeteria', 'Air Conditioning', 'Equipment Rental', 'DJ/Music System'], 4.5, 78, 'approved');

-- Add 5 more courts (distributed across the new venues)
INSERT INTO courts (venue_id, name, sport_type, price_per_hour, description, operating_hours, is_active) VALUES
-- SportsMania Gurgaon courts
((SELECT id FROM venues WHERE name = 'SportsMania Gurgaon'), 'Premium Court 1', 'Badminton', 1500.00, 'International standard badminton court with LED lighting', '{"monday": {"open": "05:00", "close": "23:00"}, "tuesday": {"open": "05:00", "close": "23:00"}, "wednesday": {"open": "05:00", "close": "23:00"}, "thursday": {"open": "05:00", "close": "23:00"}, "friday": {"open": "05:00", "close": "23:00"}, "saturday": {"open": "05:00", "close": "24:00"}, "sunday": {"open": "06:00", "close": "22:00"}}', TRUE),

-- Ace Sports Academy Lucknow court
((SELECT id FROM venues WHERE name = 'Ace Sports Academy Lucknow'), 'Training Court A', 'Badminton', 800.00, 'Professional training court with video analysis setup', '{"monday": {"open": "06:00", "close": "21:00"}, "tuesday": {"open": "06:00", "close": "21:00"}, "wednesday": {"open": "06:00", "close": "21:00"}, "thursday": {"open": "06:00", "close": "21:00"}, "friday": {"open": "06:00", "close": "21:00"}, "saturday": {"open": "07:00", "close": "20:00"}, "sunday": {"open": "08:00", "close": "19:00"}}', TRUE),

-- Megaplex Sports Center court
((SELECT id FROM venues WHERE name = 'Megaplex Sports Center'), 'Mega Court 1', 'Table Tennis', 600.00, 'Tournament-grade table tennis table with professional lighting', '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}, "wednesday": {"open": "06:00", "close": "22:00"}, "thursday": {"open": "06:00", "close": "22:00"}, "friday": {"open": "06:00", "close": "22:00"}, "saturday": {"open": "06:00", "close": "23:00"}, "sunday": {"open": "07:00", "close": "21:00"}}', TRUE),

-- Riverside Sports Club court
((SELECT id FROM venues WHERE name = 'Riverside Sports Club'), 'Riverside Court 1', 'Tennis', 2000.00, 'Outdoor tennis court with river view', '{"monday": {"open": "07:00", "close": "20:00"}, "tuesday": {"open": "07:00", "close": "20:00"}, "wednesday": {"open": "07:00", "close": "20:00"}, "thursday": {"open": "07:00", "close": "20:00"}, "friday": {"open": "07:00", "close": "20:00"}, "saturday": {"open": "07:00", "close": "21:00"}, "sunday": {"open": "08:00", "close": "19:00"}}', TRUE),

-- Thunder Sports Arena court
((SELECT id FROM venues WHERE name = 'Thunder Sports Arena'), 'Thunder Court 1', 'Squash', 1200.00, 'Climate-controlled squash court with sound system', '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}, "wednesday": {"open": "06:00", "close": "22:00"}, "thursday": {"open": "06:00", "close": "22:00"}, "friday": {"open": "06:00", "close": "22:00"}, "saturday": {"open": "06:00", "close": "23:00"}, "sunday": {"open": "07:00", "close": "21:00"}}', TRUE);

-- Add 5 more bookings
INSERT INTO bookings (user_id, court_id, venue_id, booking_date, start_time, end_time, duration_hours, price_per_hour, total_amount, status, payment_status, created_at) VALUES
-- Booking by user51
((SELECT id FROM users WHERE email = 'user51@quickcourt.com'), 
 (SELECT id FROM courts WHERE name = 'Premium Court 1' AND venue_id = (SELECT id FROM venues WHERE name = 'SportsMania Gurgaon')), 
 (SELECT id FROM venues WHERE name = 'SportsMania Gurgaon'), 
 CURRENT_DATE + INTERVAL '2 days', '18:00', '19:00', 1.0, 1500.00, 1500.00, 'confirmed', 'paid', CURRENT_TIMESTAMP),

-- Booking by user52
((SELECT id FROM users WHERE email = 'user52@quickcourt.com'), 
 (SELECT id FROM courts WHERE name = 'Training Court A' AND venue_id = (SELECT id FROM venues WHERE name = 'Ace Sports Academy Lucknow')), 
 (SELECT id FROM venues WHERE name = 'Ace Sports Academy Lucknow'), 
 CURRENT_DATE + INTERVAL '3 days', '17:00', '18:00', 1.0, 800.00, 800.00, 'confirmed', 'paid', CURRENT_TIMESTAMP),

-- Booking by user51 for 2 hours
((SELECT id FROM users WHERE email = 'user51@quickcourt.com'), 
 (SELECT id FROM courts WHERE name = 'Mega Court 1' AND venue_id = (SELECT id FROM venues WHERE name = 'Megaplex Sports Center')), 
 (SELECT id FROM venues WHERE name = 'Megaplex Sports Center'), 
 CURRENT_DATE + INTERVAL '4 days', '19:00', '21:00', 2.0, 600.00, 1200.00, 'confirmed', 'paid', CURRENT_TIMESTAMP),

-- Pending booking by user52
((SELECT id FROM users WHERE email = 'user52@quickcourt.com'), 
 (SELECT id FROM courts WHERE name = 'Riverside Court 1' AND venue_id = (SELECT id FROM venues WHERE name = 'Riverside Sports Club')), 
 (SELECT id FROM venues WHERE name = 'Riverside Sports Club'), 
 CURRENT_DATE + INTERVAL '5 days', '16:00', '17:00', 1.0, 2000.00, 2000.00, 'pending', 'pending', CURRENT_TIMESTAMP),

-- Weekend booking by user51
((SELECT id FROM users WHERE email = 'user51@quickcourt.com'), 
 (SELECT id FROM courts WHERE name = 'Thunder Court 1' AND venue_id = (SELECT id FROM venues WHERE name = 'Thunder Sports Arena')), 
 (SELECT id FROM venues WHERE name = 'Thunder Sports Arena'), 
 CURRENT_DATE + INTERVAL '6 days', '20:00', '21:00', 1.0, 1200.00, 1200.00, 'confirmed', 'paid', CURRENT_TIMESTAMP);

-- Add 5 more reviews
INSERT INTO reviews (user_id, venue_id, rating, title, comment, is_verified, created_at) VALUES
-- Review by user51 for SportsMania Gurgaon
((SELECT id FROM users WHERE email = 'user51@quickcourt.com'), 
 (SELECT id FROM venues WHERE name = 'SportsMania Gurgaon'), 
 5, 'Outstanding Facility!', 'Absolutely amazing experience! The courts are world-class and the staff is very professional. The LED lighting makes playing even better in the evening. Highly recommended!', TRUE, CURRENT_TIMESTAMP),

-- Review by user52 for Ace Sports Academy
((SELECT id FROM users WHERE email = 'user52@quickcourt.com'), 
 (SELECT id FROM venues WHERE name = 'Ace Sports Academy Lucknow'), 
 4, 'Great for Training', 'Excellent coaching facilities and the video analysis feature is really helpful for improving technique. The trainers are very knowledgeable. Good value for money.', TRUE, CURRENT_TIMESTAMP),

-- Review by user51 for Megaplex Sports Center
((SELECT id FROM users WHERE email = 'user51@quickcourt.com'), 
 (SELECT id FROM venues WHERE name = 'Megaplex Sports Center'), 
 5, 'Mega Experience!', 'This place lives up to its name! Huge facility with so many options. The table tennis tables are tournament grade. Love the additional amenities like swimming pool and gym.', TRUE, CURRENT_TIMESTAMP),

-- Review by user52 for Riverside Sports Club
((SELECT id FROM users WHERE email = 'user52@quickcourt.com'), 
 (SELECT id FROM venues WHERE name = 'Riverside Sports Club'), 
 4, 'Beautiful Location', 'Playing tennis with a river view is just magical! The courts are well-maintained and the ambiance is perfect for a relaxing game. Great for weekend activities.', TRUE, CURRENT_TIMESTAMP),

-- Review by user51 for Thunder Sports Arena
((SELECT id FROM users WHERE email = 'user51@quickcourt.com'), 
 (SELECT id FROM venues WHERE name = 'Thunder Sports Arena'), 
 4, 'High Energy Vibes', 'The music system and overall energy of this place is fantastic! Great for those who like playing in an energetic environment. The squash court is top-notch.', TRUE, CURRENT_TIMESTAMP);

-- Update venue ratings and review counts based on new reviews
UPDATE venues SET 
    total_reviews = total_reviews + 1,
    rating = CASE 
        WHEN name = 'SportsMania Gurgaon' THEN ((rating * total_reviews + 5) / (total_reviews + 1))
        WHEN name = 'Ace Sports Academy Lucknow' THEN ((rating * total_reviews + 4) / (total_reviews + 1))
        WHEN name = 'Megaplex Sports Center' THEN ((rating * total_reviews + 5) / (total_reviews + 1))
        WHEN name = 'Riverside Sports Club' THEN ((rating * total_reviews + 4) / (total_reviews + 1))
        WHEN name = 'Thunder Sports Arena' THEN ((rating * total_reviews + 4) / (total_reviews + 1))
        ELSE rating
    END
WHERE name IN ('SportsMania Gurgaon', 'Ace Sports Academy Lucknow', 'Megaplex Sports Center', 'Riverside Sports Club', 'Thunder Sports Arena');

-- Add 5 time slots for the new courts
INSERT INTO time_slots (court_id, slot_date, start_time, end_time, is_available, price, created_at) VALUES
-- Time slots for Premium Court 1 (SportsMania Gurgaon)
((SELECT id FROM courts WHERE name = 'Premium Court 1' AND venue_id = (SELECT id FROM venues WHERE name = 'SportsMania Gurgaon')), 
 CURRENT_DATE + INTERVAL '7 days', '09:00', '10:00', TRUE, 1500.00, CURRENT_TIMESTAMP),

-- Time slots for Training Court A (Ace Sports Academy)
((SELECT id FROM courts WHERE name = 'Training Court A' AND venue_id = (SELECT id FROM venues WHERE name = 'Ace Sports Academy Lucknow')), 
 CURRENT_DATE + INTERVAL '7 days', '10:00', '11:00', TRUE, 800.00, CURRENT_TIMESTAMP),

-- Time slots for Mega Court 1 (Megaplex Sports Center)
((SELECT id FROM courts WHERE name = 'Mega Court 1' AND venue_id = (SELECT id FROM venues WHERE name = 'Megaplex Sports Center')), 
 CURRENT_DATE + INTERVAL '7 days', '15:00', '16:00', TRUE, 600.00, CURRENT_TIMESTAMP),

-- Time slots for Riverside Court 1 (Riverside Sports Club)
((SELECT id FROM courts WHERE name = 'Riverside Court 1' AND venue_id = (SELECT id FROM venues WHERE name = 'Riverside Sports Club')), 
 CURRENT_DATE + INTERVAL '7 days', '11:00', '12:00', TRUE, 2000.00, CURRENT_TIMESTAMP),

-- Time slots for Thunder Court 1 (Thunder Sports Arena)
((SELECT id FROM courts WHERE name = 'Thunder Court 1' AND venue_id = (SELECT id FROM venues WHERE name = 'Thunder Sports Arena')), 
 CURRENT_DATE + INTERVAL '7 days', '14:00', '15:00', TRUE, 1200.00, CURRENT_TIMESTAMP);

-- Summary of added data
SELECT 'Test data added successfully!' as message;
SELECT 'Added:' as summary;
SELECT '- 5 new users (3 facility owners, 2 regular users)' as users_added;
SELECT '- 5 new venues across different cities' as venues_added;
SELECT '- 5 new courts (different sports types)' as courts_added;
SELECT '- 5 new bookings (various statuses and dates)' as bookings_added;
SELECT '- 5 new reviews with ratings' as reviews_added;
SELECT '- 5 new time slots for upcoming week' as time_slots_added;
