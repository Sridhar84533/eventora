-- =================================================================
-- EVENTORA - Event Management System Database SQL Script
-- Database Name: event_management
-- Supported DBMS: MySQL 8.0+ / MariaDB
-- =================================================================

CREATE DATABASE IF NOT EXISTS event_management;
USE event_management;

-- Disable foreign key checks during creation/drop if needed
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------
-- 1. Users Table
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'organizer', 'admin') DEFAULT 'user',
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 2. User Profiles Table (1:1 with users)
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS user_profiles;
CREATE TABLE user_profiles (
  profile_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  date_of_birth DATE,
  gender VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(20),
  profile_image VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 3. Organizers Table (1:1 with users)
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS organizers;
CREATE TABLE organizers (
  organizer_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  organization_name VARCHAR(150) NOT NULL,
  organization_description TEXT,
  contact_email VARCHAR(100),
  contact_phone VARCHAR(20),
  website VARCHAR(255),
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'verified',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 4. Venues Table
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS venues;
CREATE TABLE venues (
  venue_id INT AUTO_INCREMENT PRIMARY KEY,
  venue_name VARCHAR(150) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(20),
  capacity INT NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 5. Categories Table
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 6. Events Table
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS events;
CREATE TABLE events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  organizer_id INT NOT NULL,
  venue_id INT,
  event_name VARCHAR(200) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_seats INT NOT NULL,
  available_seats INT NOT NULL,
  event_status ENUM('draft', 'pending', 'published', 'rejected', 'cancelled', 'completed') DEFAULT 'pending',
  banner_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES organizers(organizer_id) ON DELETE CASCADE,
  FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 7. Event Categories (N:M Junction Table)
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS event_categories;
CREATE TABLE event_categories (
  event_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (event_id, category_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 8. Event Images Table (1:N with events)
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS event_images;
CREATE TABLE event_images (
  image_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_primary TINYINT(1) DEFAULT 0,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 9. Event Staff Table (1:N with events)
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS event_staff;
CREATE TABLE event_staff (
  staff_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  staff_name VARCHAR(100) NOT NULL,
  staff_role VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  status ENUM('active', 'inactive') DEFAULT 'active',
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 10. Bookings Table (1:N with users, 1:N with events)
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  booking_reference VARCHAR(50) NOT NULL UNIQUE,
  number_of_tickets INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_status ENUM('confirmed', 'pending', 'cancelled') DEFAULT 'confirmed',
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 11. Payments Table (1:1 with bookings)
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  transaction_id VARCHAR(100) NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('credit_card', 'debit_card', 'upi', 'net_banking', 'wallet') NOT NULL,
  payment_status ENUM('completed', 'pending', 'failed', 'refunded') DEFAULT 'completed',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 12. Notifications Table (1:N with users)
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  notification_type ENUM('booking', 'event_update', 'system', 'payment') DEFAULT 'system',
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 13. Favourites Table (User Event Bookmarks)
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS favourites;
CREATE TABLE favourites (
  favourite_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY user_event_fav (user_id, event_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- =================================================================
-- VIEWS
-- =================================================================

-- View 1: Event Summary View with Venue and Organizer Details
CREATE OR REPLACE VIEW vw_event_summary AS
SELECT 
  e.event_id, e.event_name, e.description, e.event_date, e.start_time, e.end_time,
  e.ticket_price, e.total_seats, e.available_seats, e.event_status, e.banner_image, e.created_at,
  o.organizer_id, o.organization_name,
  v.venue_id, v.venue_name, v.city AS venue_city, v.state AS venue_state,
  v.address AS venue_address, v.capacity AS venue_capacity
FROM events e
JOIN organizers o ON e.organizer_id = o.organizer_id
LEFT JOIN venues v ON e.venue_id = v.venue_id;

-- View 2: Organizer Revenue View
CREATE OR REPLACE VIEW vw_organizer_revenue AS
SELECT 
  o.organizer_id, o.organization_name,
  COUNT(DISTINCT e.event_id) AS total_events,
  COALESCE(SUM(b.number_of_tickets), 0) AS tickets_sold,
  COALESCE(SUM(CASE WHEN b.booking_status = 'confirmed' THEN b.total_amount ELSE 0 END), 0) AS total_revenue
FROM organizers o
LEFT JOIN events e ON o.organizer_id = e.organizer_id
LEFT JOIN bookings b ON e.event_id = b.event_id
GROUP BY o.organizer_id, o.organization_name;

-- View 3: Detailed User Booking View
CREATE OR REPLACE VIEW vw_user_booking_details AS
SELECT 
  b.booking_id, b.booking_reference, b.user_id,
  u.full_name AS user_name, u.email AS user_email,
  e.event_id, e.event_name, e.event_date, e.start_time, e.banner_image,
  v.venue_name, v.city AS venue_city,
  b.number_of_tickets, b.total_amount, b.booking_status, b.booking_date,
  p.transaction_id, p.payment_method, p.payment_status
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN events e ON b.event_id = e.event_id
LEFT JOIN venues v ON e.venue_id = v.venue_id
LEFT JOIN payments p ON b.booking_id = p.booking_id;

-- =================================================================
-- SAMPLE SEED DATA
-- =================================================================

-- Default Password for seed users is "Password@123" (bcrypt hashed)
-- Admin: admin@eventora.com / admin123
-- Organizer: organizer@eventora.com / org123
-- User: user@eventora.com / user123

INSERT INTO users (user_id, full_name, email, password_hash, phone, role, status) VALUES
(1, 'System Admin', 'admin@eventora.com', '$2a$10$76aMevY6Tz6w/b/51Bq3U.x9z/xJvQ2v6Z8z.8F3o2P1v4U.X2M5u', '9000000001', 'admin', 'active'),
(2, 'Demo Organizer', 'organizer@eventora.com', '$2a$10$76aMevY6Tz6w/b/51Bq3U.x9z/xJvQ2v6Z8z.8F3o2P1v4U.X2M5u', '9000000002', 'organizer', 'active'),
(3, 'Demo User', 'user@eventora.com', '$2a$10$76aMevY6Tz6w/b/51Bq3U.x9z/xJvQ2v6Z8z.8F3o2P1v4U.X2M5u', '9000000003', 'user', 'active')
ON DUPLICATE KEY UPDATE status='active';

INSERT INTO user_profiles (profile_id, user_id, date_of_birth, gender, address, city, state, pincode) VALUES
(1, 1, '1988-04-12', 'Male', '100 Admin Plaza', 'Mumbai', 'Maharashtra', '400001'),
(2, 2, '1990-08-25', 'Male', '45 Tech Way', 'Bengaluru', 'Karnataka', '560001'),
(3, 3, '1995-06-15', 'Male', '742 Evergreen Street', 'Delhi', 'Delhi', '110001')
ON DUPLICATE KEY UPDATE city=VALUES(city);

INSERT INTO organizers (organizer_id, user_id, organization_name, organization_description, contact_email, contact_phone, verification_status) VALUES
(1, 2, 'Eventora Events Co.', 'Premier event management and production company.', 'organizer@eventora.com', '9000000002', 'verified')
ON DUPLICATE KEY UPDATE organization_name=VALUES(organization_name);

INSERT INTO categories (category_id, category_name, description, status) VALUES
(1, 'Music', 'Live concerts, music festivals, and acoustic performances', 'active'),
(2, 'Technology', 'Tech summits, hackathons, and software engineering bootcamps', 'active'),
(3, 'Business', 'Corporate leadership summits, venture pitches, and networking', 'active'),
(4, 'Sports', 'Marathons, tournaments, and sporting expos', 'active'),
(5, 'Arts & Culture', 'Art exhibitions, theatrical plays, and cultural galas', 'active'),
(6, 'Food & Drink', 'Food truck festivals, culinary workshops, and wine tasting', 'active')
ON DUPLICATE KEY UPDATE description=VALUES(description);

INSERT INTO venues (venue_id, venue_name, address, city, state, pincode, capacity, description, status) VALUES
(1, 'Grand Convention Center', '123 MG Road', 'Mumbai', 'Maharashtra', '400001', 5000, 'Premier convention center in downtown Mumbai', 'active'),
(2, 'Tech Hub Arena', '456 IT Park Boulevard', 'Bengaluru', 'Karnataka', '560001', 2000, 'State-of-the-art arena for technology conventions', 'active'),
(3, 'Cultural Palace Hall', '789 Heritage Road', 'Delhi', 'Delhi', '110001', 3000, 'Historic venue with modern acoustics and multi-tier seating', 'active')
ON DUPLICATE KEY UPDATE venue_name=VALUES(venue_name);

INSERT INTO events (event_id, organizer_id, venue_id, event_name, description, event_date, start_time, end_time, ticket_price, total_seats, available_seats, event_status, banner_image) VALUES
(1, 1, 1, 'Eventora Grand Music Festival 2026', 'A spectacular music festival featuring top artists, light shows, and food stalls from across India.', '2026-10-15', '16:00:00', '23:00:00', 999.00, 2000, 1980, 'published', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80'),
(2, 1, 2, 'National Tech Summit 2026', 'India\'s largest technology conference with keynotes, hands-on workshops, AI demos and networking.', '2026-11-20', '09:00:00', '18:00:00', 2499.00, 1000, 990, 'published', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80')
ON DUPLICATE KEY UPDATE event_name=VALUES(event_name);

INSERT INTO event_categories (event_id, category_id) VALUES
(1, 1), (2, 2)
ON DUPLICATE KEY UPDATE event_id=VALUES(event_id);
