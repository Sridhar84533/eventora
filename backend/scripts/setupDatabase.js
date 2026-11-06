require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

async function initDB() {
  console.log('🔌 Connecting to MySQL host...');

  const rootConn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    multipleStatements: true
  });

  try {
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'event_management'}\`;`);
    console.log(`✅ Database '${process.env.DB_NAME || 'event_management'}' ready.`);
  } finally {
    await rootConn.end();
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    database: process.env.DB_NAME || 'event_management',
    multipleStatements: true
  });

  try {
    console.log('\n📋 Creating tables...');

    const tableStatements = [
      `CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('user', 'organizer', 'admin') DEFAULT 'user',
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

      `CREATE TABLE IF NOT EXISTS user_profiles (
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

      `CREATE TABLE IF NOT EXISTS organizers (
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

      `CREATE TABLE IF NOT EXISTS venues (
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

      `CREATE TABLE IF NOT EXISTS categories (
        category_id INT AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

      `CREATE TABLE IF NOT EXISTS events (
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

      `CREATE TABLE IF NOT EXISTS event_categories (
        event_id INT NOT NULL,
        category_id INT NOT NULL,
        PRIMARY KEY (event_id, category_id),
        FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

      `CREATE TABLE IF NOT EXISTS event_images (
        image_id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        is_primary TINYINT(1) DEFAULT 0,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

      `CREATE TABLE IF NOT EXISTS event_staff (
        staff_id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        staff_name VARCHAR(100) NOT NULL,
        staff_role VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100),
        status ENUM('active', 'inactive') DEFAULT 'active',
        FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

      `CREATE TABLE IF NOT EXISTS bookings (
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

      `CREATE TABLE IF NOT EXISTS payments (
        payment_id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        transaction_id VARCHAR(100) NOT NULL UNIQUE,
        amount DECIMAL(10,2) NOT NULL,
        payment_method ENUM('credit_card', 'debit_card', 'upi', 'net_banking', 'wallet') NOT NULL,
        payment_status ENUM('completed', 'pending', 'failed', 'refunded') DEFAULT 'completed',
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

      `CREATE TABLE IF NOT EXISTS notifications (
        notification_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(150) NOT NULL,
        message TEXT NOT NULL,
        notification_type ENUM('booking', 'event_update', 'system', 'payment') DEFAULT 'system',
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

      `CREATE TABLE IF NOT EXISTS favourites (
        favourite_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        event_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY user_event_fav (user_id, event_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
    ];

    for (const sql of tableStatements) {
      await conn.query(sql);
    }
    console.log('✅ All 13 tables created successfully!');

    // --- VIEWS ---
    console.log('\n👁️  Creating views...');

    await conn.query(`CREATE OR REPLACE VIEW vw_event_summary AS
      SELECT 
        e.event_id, e.event_name, e.description, e.event_date, e.start_time, e.end_time,
        e.ticket_price, e.total_seats, e.available_seats, e.event_status, e.banner_image, e.created_at,
        o.organizer_id, o.organization_name,
        v.venue_id, v.venue_name, v.city AS venue_city, v.state AS venue_state,
        v.address AS venue_address, v.capacity AS venue_capacity
      FROM events e
      JOIN organizers o ON e.organizer_id = o.organizer_id
      LEFT JOIN venues v ON e.venue_id = v.venue_id`);

    await conn.query(`CREATE OR REPLACE VIEW vw_organizer_revenue AS
      SELECT 
        o.organizer_id, o.organization_name,
        COUNT(DISTINCT e.event_id) AS total_events,
        COALESCE(SUM(b.number_of_tickets), 0) AS tickets_sold,
        COALESCE(SUM(CASE WHEN b.booking_status = 'confirmed' THEN b.total_amount ELSE 0 END), 0) AS total_revenue
      FROM organizers o
      LEFT JOIN events e ON o.organizer_id = e.organizer_id
      LEFT JOIN bookings b ON e.event_id = b.event_id
      GROUP BY o.organizer_id, o.organization_name`);

    await conn.query(`CREATE OR REPLACE VIEW vw_user_booking_details AS
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
      LEFT JOIN payments p ON b.booking_id = p.booking_id`);

    console.log('✅ 3 views created successfully!');

    // --- STORED FUNCTION ---
    console.log('\n⚙️  Creating stored function...');
    await conn.query(`DROP FUNCTION IF EXISTS fn_calculate_event_revenue`);
    await conn.query(`CREATE FUNCTION fn_calculate_event_revenue(p_event_id INT) 
      RETURNS DECIMAL(10,2)
      DETERMINISTIC
      READS SQL DATA
      BEGIN
        DECLARE v_revenue DECIMAL(10,2);
        SELECT COALESCE(SUM(total_amount), 0.00) INTO v_revenue
        FROM bookings
        WHERE event_id = p_event_id AND booking_status = 'confirmed';
        RETURN v_revenue;
      END`);
    console.log('✅ Stored function created!');

    // --- STORED PROCEDURE ---
    console.log('\n⚙️  Creating stored procedure...');
    await conn.query(`DROP PROCEDURE IF EXISTS sp_approve_event`);
    await conn.query(`CREATE PROCEDURE sp_approve_event(IN p_event_id INT, IN p_status VARCHAR(20))
      BEGIN
        UPDATE events SET event_status = p_status WHERE event_id = p_event_id;
      END`);
    console.log('✅ Stored procedure created!');

    // --- SEED DATA ---
    console.log('\n🌱 Seeding default data...');

    const bcrypt = require('bcryptjs');
    const adminHash = await bcrypt.hash('admin123', 10);
    const orgHash   = await bcrypt.hash('org123', 10);
    const userHash  = await bcrypt.hash('user123', 10);

    // Default admin & users
    await conn.query(`INSERT IGNORE INTO users (full_name, email, password_hash, phone, role, status)
      VALUES 
        ('Admin User', 'admin@eventora.com', ?, '9000000001', 'admin', 'active'),
        ('Demo Organizer', 'organizer@eventora.com', ?, '9000000002', 'organizer', 'active'),
        ('Demo User', 'user@eventora.com', ?, '9000000003', 'user', 'active')`,
      [adminHash, orgHash, userHash]);

    // Organizer profile
    await conn.query(`INSERT IGNORE INTO organizers (user_id, organization_name, organization_description, contact_email, contact_phone, verification_status)
      SELECT user_id, 'Eventora Events Co.', 'Premier event management company', 'organizer@eventora.com', '9000000002', 'verified'
      FROM users WHERE email = 'organizer@eventora.com'`);

    // User profiles
    await conn.query(`INSERT IGNORE INTO user_profiles (user_id, city, state)
      SELECT user_id, 'Mumbai', 'Maharashtra' FROM users WHERE email IN ('admin@eventora.com','user@eventora.com')`);

    // Categories (8 Default Domains)
    await conn.query(`INSERT IGNORE INTO categories (category_name, description) VALUES
      ('Music', 'Live concerts, festivals, and performances'),
      ('Technology', 'Tech conferences, hackathons, and workshops'),
      ('Business', 'Business summits, networking events, and seminars'),
      ('Sports', 'Sporting events, marathons, and tournaments'),
      ('Arts & Culture', 'Art exhibitions, theatre, and cultural programs'),
      ('Food & Drink', 'Food festivals, wine tastings, and culinary events'),
      ('Education', 'Workshops, training sessions, and webinars'),
      ('Entertainment', 'Movies, comedy shows, and gaming events')`);

    // Venues
    await conn.query(`INSERT IGNORE INTO venues (venue_name, address, city, state, pincode, capacity, description, status) VALUES
      ('Grand Convention Center', '123 MG Road', 'Mumbai', 'Maharashtra', '400001', 5000, 'Premier convention center in the heart of Mumbai', 'active'),
      ('Tech Hub Arena', '456 IT Park', 'Bengaluru', 'Karnataka', '560001', 2000, 'State-of-the-art arena for technology events', 'active'),
      ('Cultural Palace', '789 Cultural Street', 'Delhi', 'Delhi', '110001', 3000, 'Historic palace with modern amenities', 'active'),
      ('Sports Complex', '321 Stadium Road', 'Chennai', 'Tamil Nadu', '600001', 10000, 'Multi-purpose sports complex', 'active')`);

    console.log('✅ Seed data inserted successfully!');

    console.log('\n🎉 ============================================');
    console.log('   EVENTORA DATABASE SETUP COMPLETE!');
    console.log('==============================================\n');

  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

initDB();
