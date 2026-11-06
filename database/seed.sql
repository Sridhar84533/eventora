-- EVENTORA Seed Data Script

USE event_management;

-- Clear existing data (in proper dependency order)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE favourites;
TRUNCATE TABLE notifications;
TRUNCATE TABLE payments;
TRUNCATE TABLE bookings;
TRUNCATE TABLE event_staff;
TRUNCATE TABLE event_images;
TRUNCATE TABLE event_categories;
TRUNCATE TABLE events;
TRUNCATE TABLE categories;
TRUNCATE TABLE venues;
TRUNCATE TABLE organizers;
TRUNCATE TABLE user_profiles;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Password for all seed users is "password123"
-- Hashed using bcrypt (cost factor 10): $2b$10$E50s1qJk./a5i4tO/.F48eGvO5JqZ5oF12O4M9S7L8bW1y8p9a3m6 (standard hash fallback)
-- Below bcrypt hash represents "Password@123"
SET @default_pass = '$2a$10$76aMevY6Tz6w/b/51Bq3U.x9z/xJvQ2v6Z8z.8F3o2P1v4U.X2M5u';

-- 1. Insert Users (Admin, Organizers, Regular Users)
INSERT INTO users (user_id, full_name, email, password_hash, phone, role, status) VALUES
(1, 'System Admin', 'admin@eventora.com', '$2a$10$76aMevY6Tz6w/b/51Bq3U.x9z/xJvQ2v6Z8z.8F3o2P1v4U.X2M5u', '+19876543210', 'admin', 'active'),
(2, 'Alex Rivera', 'alex.rivera@techpulse.io', '$2a$10$76aMevY6Tz6w/b/51Bq3U.x9z/xJvQ2v6Z8z.8F3o2P1v4U.X2M5u', '+19876543211', 'organizer', 'active'),
(3, 'Sophia Chen', 'sophia@harmonybeats.com', '$2a$10$76aMevY6Tz6w/b/51Bq3U.x9z/xJvQ2v6Z8z.8F3o2P1v4U.X2M5u', '+19876543212', 'organizer', 'active'),
(4, 'Marcus Vance', 'marcus@innovateconf.org', '$2a$10$76aMevY6Tz6w/b/51Bq3U.x9z/xJvQ2v6Z8z.8F3o2P1v4U.X2M5u', '+19876543213', 'organizer', 'active'),
(5, 'John Doe', 'john.doe@gmail.com', '$2a$10$76aMevY6Tz6w/b/51Bq3U.x9z/xJvQ2v6Z8z.8F3o2P1v4U.X2M5u', '+19876543214', 'user', 'active'),
(6, 'Emma Watson', 'emma.w@yahoo.com', '$2a$10$76aMevY6Tz6w/b/51Bq3U.x9z/xJvQ2v6Z8z.8F3o2P1v4U.X2M5u', '+19876543215', 'user', 'active'),
(7, 'David Miller', 'david.m@outlook.com', '$2a$10$76aMevY6Tz6w/b/51Bq3U.x9z/xJvQ2v6Z8z.8F3o2P1v4U.X2M5u', '+19876543216', 'user', 'active');

-- 2. Insert User Profiles
INSERT INTO user_profiles (profile_id, user_id, date_of_birth, gender, address, city, state, pincode, profile_image) VALUES
(1, 1, '1988-04-12', 'Male', '100 Admin Plaza, Suite 400', 'San Francisco', 'California', '94105', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'),
(2, 2, '1990-08-25', 'Male', '45 Innovation Way', 'Austin', 'Texas', '78701', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'),
(3, 3, '1992-11-03', 'Female', '88 Melody Avenue', 'New York', 'New York', '10001', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'),
(4, 4, '1985-01-19', 'Male', '12 Enterprise Blvd', 'Chicago', 'Illinois', '60601', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'),
(5, 5, '1995-06-15', 'Male', '742 Evergreen Terrace', 'Seattle', 'Washington', '98101', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80'),
(6, 6, '1997-02-28', 'Female', '350 Broadway', 'New York', 'New York', '10013', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'),
(7, 7, '1993-09-10', 'Male', '500 Tech Hill Road', 'San Jose', 'California', '95110', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80');

-- 3. Insert Organizers
INSERT INTO organizers (organizer_id, user_id, organization_name, organization_description, contact_email, contact_phone, website, verification_status) VALUES
(1, 2, 'TechPulse Events Global', 'Leading organizer of global developer summits, AI conferences, and tech expos.', 'contact@techpulse.io', '+19876543211', 'https://techpulse.io', 'verified'),
(2, 3, 'Harmony Beats Entertainment', 'Premier live music event management and concert promoter across North America.', 'info@harmonybeats.com', '+19876543212', 'https://harmonybeats.com', 'verified'),
(3, 4, 'Innovate & Venture Forum', 'Connecting startup founders, enterprise leaders, and VC investors worldwide.', 'events@innovateconf.org', '+19876543213', 'https://innovateconf.org', 'verified');

-- 4. Insert Venues
INSERT INTO venues (venue_id, venue_name, address, city, state, pincode, capacity, description, image_url, status) VALUES
(1, 'Metropolitan Convention Center', '100 Convention Center Way', 'San Francisco', 'California', '94103', 5000, 'State-of-the-art convention facility featuring 5 large auditoriums and high-speed fiber connectivity.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80', 'active'),
(2, 'Grand Symphony Hall', '450 Music Row Boulevard', 'New York', 'New York', '10023', 2500, 'Acoustically engineered concert venue with multi-tier seating and world-class sound tech.', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', 'active'),
(3, 'Silicon Valley Tech Arena', '700 Innovation Parkway', 'San Jose', 'California', '95134', 3500, 'Modern indoor stadium built specifically for tech keynotes, product debuts, and hackathons.', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80', 'active'),
(4, 'Austin Riverside Amphitheater', '1200 Lakefront Drive', 'Austin', 'Texas', '78704', 8000, 'Scenic outdoor amphitheater overlooking the river, perfect for festivals and summer concerts.', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', 'active'),
(5, 'Chicago Enterprise Expo Center', '330 Lake Shore Drive', 'Chicago', 'Illinois', '60611', 4000, 'Spacious exhibition center featuring modular halls, breakout rooms, and executive lounge access.', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80', 'active');

-- 5. Insert Categories
INSERT INTO categories (category_id, category_name, description, status) VALUES
(1, 'Technology & AI', 'Developer conferences, AI workshops, cybersecurity summits, and cloud expos.', 'active'),
(2, 'Music & Concerts', 'Live pop, rock, electronic, jazz, and classical orchestra performances.', 'active'),
(3, 'Business & Startup', 'Entrepreneurship workshops, investment pitches, leadership summits, and networking.', 'active'),
(4, 'Design & Creativity', 'UI/UX design forums, digital art exhibitions, design thinking bootcamps.', 'active'),
(5, 'Health & Wellness', 'Yoga retreats, mental wellness seminars, fitness expos, and holistic health.', 'active'),
(6, 'Food & Culinary', 'Gourmet food festivals, wine tastings, masterchef workshops, and street food galas.', 'active');

-- 6. Insert Events
INSERT INTO events (event_id, organizer_id, venue_id, event_name, description, event_date, start_time, end_time, ticket_price, total_seats, available_seats, event_status, banner_image) VALUES
(1, 1, 1, 'Global AI & Cloud Summit 2026', 'Join over 3,000 AI researchers, software architects, and tech executives for three days of keynotes, hands-on workshops, and networking.', '2026-09-15', '09:00:00', '18:00:00', 299.00, 3000, 2840, 'published', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80'),
(2, 2, 2, 'Symphony Under the Stars', 'Experience a magical evening with the Philharmonic Orchestra playing timeless classical masterpieces and modern cinematic scores.', '2026-09-20', '19:30:00', '22:30:00', 85.00, 2500, 2380, 'published', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80'),
(3, 3, 3, 'Silicon Founders Pitch & Expo', 'Top 50 startups present their disruptive ideas to global VCs, angel investors, and enterprise partners.', '2026-10-05', '10:00:00', '17:00:00', 149.00, 1500, 1420, 'published', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80'),
(4, 1, 3, 'Fullstack Web Developers Conference', 'Deep dive into React, Next.js, Node.js, and modern distributed cloud architecture with industry core team contributors.', '2026-10-18', '08:30:00', '17:30:00', 199.00, 2000, 1950, 'published', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'),
(5, 2, 4, 'Austin Live Music & Arts Festival', 'A multi-stage outdoor weekend festival showcasing independent indie bands, electronic DJs, and live mural paintings.', '2026-11-01', '14:00:00', '23:00:00', 120.00, 5000, 4800, 'published', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80'),
(6, 3, 5, 'NextGen UI/UX Design Masterclass', 'Master design systems, micro-interactions, spatial UI, and AI-assisted prototyping tools.', '2026-11-12', '09:30:00', '16:30:00', 175.00, 800, 800, 'pending', 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80');

-- 7. Insert Event Categories
INSERT INTO event_categories (event_id, category_id) VALUES
(1, 1), (1, 3),
(2, 2),
(3, 3), (3, 1),
(4, 1), (4, 4),
(5, 2),
(6, 4);

-- 8. Insert Event Images
INSERT INTO event_images (image_id, event_id, image_url, is_primary) VALUES
(1, 1, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80', 1),
(2, 1, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80', 0),
(3, 2, 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80', 1),
(4, 3, 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80', 1);

-- 9. Insert Event Staff
INSERT INTO event_staff (staff_id, event_id, staff_name, staff_role, phone, email, status) VALUES
(1, 1, 'Sarah Jenkins', 'Event Coordinator', '+19876543250', 'sarah.j@techpulse.io', 'active'),
(2, 1, 'Robert Lang', 'Technical Lead', '+19876543251', 'robert.l@techpulse.io', 'active'),
(3, 2, 'David Vance', 'Stage Manager', '+19876543252', 'david@harmonybeats.com', 'active'),
(4, 3, 'Elena Rostova', 'Guest Relations', '+19876543253', 'elena@innovateconf.org', 'active');

-- 10. Insert Bookings
INSERT INTO bookings (booking_id, user_id, event_id, booking_reference, number_of_tickets, total_amount, booking_status, booking_date) VALUES
(1, 5, 1, 'EVT-2026-982101', 2, 598.00, 'confirmed', '2026-08-01 10:15:00'),
(2, 6, 2, 'EVT-2026-982102', 3, 255.00, 'confirmed', '2026-08-02 14:22:00'),
(3, 7, 3, 'EVT-2026-982103', 1, 149.00, 'confirmed', '2026-08-03 16:05:00'),
(4, 5, 2, 'EVT-2026-982104', 2, 170.00, 'confirmed', '2026-08-05 11:30:00');

-- 11. Insert Payments
INSERT INTO payments (payment_id, booking_id, transaction_id, amount, payment_method, payment_status, payment_date) VALUES
(1, 1, 'TXN-9988112233', 598.00, 'credit_card', 'completed', '2026-08-01 10:15:30'),
(2, 2, 'TXN-9988112234', 255.00, 'upi', 'completed', '2026-08-02 14:22:45'),
(3, 3, 'TXN-9988112235', 149.00, 'net_banking', 'completed', '2026-08-03 16:05:20'),
(4, 4, 'TXN-9988112236', 170.00, 'credit_card', 'completed', '2026-08-05 11:30:15');

-- 12. Insert Notifications
INSERT INTO notifications (notification_id, user_id, title, message, notification_type, is_read) VALUES
(1, 5, 'Booking Confirmed!', 'Your tickets for Global AI & Cloud Summit 2026 have been issued. Reference: EVT-2026-982101', 'booking', 1),
(2, 6, 'Ticket Purchase Successful', 'You have booked 3 tickets for Symphony Under the Stars.', 'booking', 0),
(3, 5, 'Event Reminder', 'Symphony Under the Stars is coming up on September 20, 2026.', 'event_update', 0),
(4, 2, 'New Event Submission', 'Your event NextGen UI/UX Design Masterclass is under review by system admin.', 'system', 0);

-- 13. Insert Favourites
INSERT INTO favourites (favourite_id, user_id, event_id) VALUES
(1, 5, 1),
(2, 5, 2),
(3, 6, 3);
