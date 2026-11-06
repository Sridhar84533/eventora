require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

async function addMoreEvents() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    database: process.env.DB_NAME || 'event_management',
    multipleStatements: true
  });

  try {
    console.log('🔌 Connected to database...');

    // ─── 1. Ensure Indian venues exist ─────────────────────────────────────────
    console.log('\n🏟️  Upserting Indian venues...');
    await conn.query(`
      INSERT IGNORE INTO venues (venue_name, address, city, state, pincode, capacity, description, image_url, status) VALUES
      ('Tech Hub Arena',           '456 IT Park, Whitefield',       'Bengaluru',  'Karnataka',    '560066', 2000,  'State-of-the-art arena for technology and music events.',       'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80', 'active'),
      ('Grand Convention Center',  '123 MG Road',                   'Mumbai',     'Maharashtra',  '400001', 5000,  'Premier convention center in the heart of Mumbai.',              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80', 'active'),
      ('Cultural Palace',          '789 Cultural Street, Connaught','Delhi',       'Delhi',        '110001', 3000,  'Historic palace with modern event amenities.',                   'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', 'active'),
      ('Sports Complex',           '321 Stadium Road, Anna Nagar',  'Chennai',    'Tamil Nadu',   '600040', 10000, 'Multi-purpose sports and entertainment complex.',                 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80', 'active'),
      ('Jawaharlal Nehru Stadium', '1 JLN Marg',                    'Hyderabad',  'Telangana',    '500001', 8000,  'Iconic stadium hosting major concerts and sporting events.',       'https://images.unsplash.com/photo-1461695008884-244cb4543d74?auto=format&fit=crop&w=800&q=80', 'active'),
      ('Science City Auditorium',  'Science City Road, Kolkata',    'Kolkata',    'West Bengal',  '700046', 2500,  'Modern auditorium within Kolkata Science City complex.',          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', 'active'),
      ('BIEC Expo Centre',         'Tumkur Road, Yeshwantpur',      'Bengaluru',  'Karnataka',    '560022', 6000,  'Bengaluru International Exhibition Centre for large-scale expos.','https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80', 'active'),
      ('Rajiv Gandhi Indoor Stadium','Kozhikode Road',              'Kochi',      'Kerala',       '682017', 4000,  'Premier indoor stadium for concerts and entertainment events.',   'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80', 'active')
    `);
    console.log('✅ Venues ready.');

    // ─── 2. Ensure categories exist ────────────────────────────────────────────
    console.log('\n🏷️  Upserting categories...');
    await conn.query(`
      INSERT IGNORE INTO categories (category_name, description, status) VALUES
      ('Music',           'Live concerts, festivals, and performances',               'active'),
      ('Technology',      'Tech conferences, hackathons, and workshops',              'active'),
      ('Business',        'Business summits, networking events, and seminars',        'active'),
      ('Sports',          'Sporting events, marathons, and tournaments',              'active'),
      ('Arts & Culture',  'Art exhibitions, theatre, and cultural programs',          'active'),
      ('Food & Drink',    'Food festivals, wine tastings, and culinary events',       'active'),
      ('Education',       'Workshops, training sessions, and webinars',              'active'),
      ('Entertainment',   'Movies, comedy shows, and gaming events',                 'active')
    `);
    console.log('✅ Categories ready.');

    // ─── 3. Fetch IDs we will need ──────────────────────────────────────────────
    const [venueRows] = await conn.query(`SELECT venue_id, venue_name, city FROM venues`);
    const [catRows]   = await conn.query(`SELECT category_id, category_name FROM categories`);
    const [orgRows]   = await conn.query(`SELECT organizer_id FROM organizers LIMIT 3`);

    const venueMap = {};
    venueRows.forEach(v => { venueMap[`${v.venue_name}|${v.city}`] = v.venue_id; });

    const catMap = {};
    catRows.forEach(c => { catMap[c.category_name] = c.category_id; });

    const organizers = orgRows.map(o => o.organizer_id);
    if (organizers.length === 0) throw new Error('No organizers found. Run setupDatabase.js first.');

    // Helper to get a venue id
    const venue = (name, city) => venueMap[`${name}|${city}`];

    // ─── 4. Insert 10 new rich events ──────────────────────────────────────────
    console.log('\n🎉 Inserting 10 new events...');

    const events = [
      {
        organizer_id:     organizers[0 % organizers.length],
        venue_name:       'Tech Hub Arena',    venue_city: 'Bengaluru',
        event_name:       'Bengaluru Music Festival 2026',
        description:      'The biggest multi-genre music festival in South India. Featuring top Bollywood playback singers, indie artists, and international DJs across three stages for one epic night.',
        event_date:       '2026-08-14', start_time: '20:00:00', end_time: '23:59:00',
        ticket_price:     500.00, total_seats: 2000, available_seats: 1750,
        event_status:     'published',
        banner_image:     'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
        categories:       ['Music']
      },
      {
        organizer_id:     organizers[1 % organizers.length],
        venue_name:       'Grand Convention Center', venue_city: 'Mumbai',
        event_name:       'Mumbai Tech Summit 2026',
        description:      'India\'s premier tech summit bringing together 5,000+ engineers, startup founders, and investors for two days of cutting-edge talks on AI, Cloud, and Web3.',
        event_date:       '2026-09-10', start_time: '09:00:00', end_time: '18:00:00',
        ticket_price:     1200.00, total_seats: 3000, available_seats: 2400,
        event_status:     'published',
        banner_image:     'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        categories:       ['Technology', 'Business']
      },
      {
        organizer_id:     organizers[2 % organizers.length],
        venue_name:       'Cultural Palace', venue_city: 'Delhi',
        event_name:       'Delhi International Art & Culture Expo',
        description:      'A vibrant 3-day celebration of Indian and global art forms — live painting, classical dance, photography exhibitions, and theatrical performances from 50 artists.',
        event_date:       '2026-10-01', start_time: '10:00:00', end_time: '20:00:00',
        ticket_price:     350.00, total_seats: 1500, available_seats: 1200,
        event_status:     'published',
        banner_image:     'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
        categories:       ['Arts & Culture']
      },
      {
        organizer_id:     organizers[0 % organizers.length],
        venue_name:       'Sports Complex', venue_city: 'Chennai',
        event_name:       'Chennai Premier Marathon 2026',
        description:      'Run through the heart of Chennai in this iconic annual marathon. Categories: Full Marathon (42km), Half Marathon (21km), and 10km Fun Run. Open to all fitness levels.',
        event_date:       '2026-09-25', start_time: '05:30:00', end_time: '12:00:00',
        ticket_price:     800.00, total_seats: 5000, available_seats: 4200,
        event_status:     'published',
        banner_image:     'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
        categories:       ['Sports']
      },
      {
        organizer_id:     organizers[1 % organizers.length],
        venue_name:       'Jawaharlal Nehru Stadium', venue_city: 'Hyderabad',
        event_name:       'Hyderabad Food & Drink Festival',
        description:      'Savour the best of Hyderabadi cuisine and global flavours. 100+ stalls, celebrity chef cook-offs, biryani competition, wine pairing evenings, and live cooking demos.',
        event_date:       '2026-11-05', start_time: '12:00:00', end_time: '22:00:00',
        ticket_price:     250.00, total_seats: 6000, available_seats: 5500,
        event_status:     'published',
        banner_image:     'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
        categories:       ['Food & Drink']
      },
      {
        organizer_id:     organizers[2 % organizers.length],
        venue_name:       'Science City Auditorium', venue_city: 'Kolkata',
        event_name:       'Kolkata EdTech & Innovation Conference',
        description:      'India\'s fastest-growing education technology conference. Sessions on AI in education, gamified learning, NEP 2020 implementation, and EdTech startup pitches.',
        event_date:       '2026-10-20', start_time: '09:30:00', end_time: '17:30:00',
        ticket_price:     450.00, total_seats: 1000, available_seats: 850,
        event_status:     'published',
        banner_image:     'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
        categories:       ['Education', 'Technology']
      },
      {
        organizer_id:     organizers[0 % organizers.length],
        venue_name:       'BIEC Expo Centre', venue_city: 'Bengaluru',
        event_name:       'Bengaluru Startup & Investor Expo 2026',
        description:      'The most exclusive startup pitch event in Karnataka. 200 curated startups present to 500+ VCs and angel investors across AI, HealthTech, CleanTech, and FinTech verticals.',
        event_date:       '2026-11-20', start_time: '10:00:00', end_time: '19:00:00',
        ticket_price:     999.00, total_seats: 2500, available_seats: 2100,
        event_status:     'published',
        banner_image:     'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
        categories:       ['Business', 'Technology']
      },
      {
        organizer_id:     organizers[1 % organizers.length],
        venue_name:       'Rajiv Gandhi Indoor Stadium', venue_city: 'Kochi',
        event_name:       'Kochi Comedy & Entertainment Night',
        description:      'A spectacular evening of stand-up comedy, mimicry, and sketch performances by Kerala\'s top comedians and surprise celebrity guests. A night of non-stop laughter!',
        event_date:       '2026-12-05', start_time: '18:00:00', end_time: '22:00:00',
        ticket_price:     600.00, total_seats: 1500, available_seats: 1300,
        event_status:     'published',
        banner_image:     'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1200&q=80',
        categories:       ['Entertainment']
      },
      {
        organizer_id:     organizers[2 % organizers.length],
        venue_name:       'Grand Convention Center', venue_city: 'Mumbai',
        event_name:       'Mumbai Jazz & Blues Festival',
        description:      'Three nights of world-class jazz and blues under the stars. Featuring Grammy-nominated artists, emerging Indian jazz talent, saxophone battles, and blues jam sessions.',
        event_date:       '2026-12-18', start_time: '19:00:00', end_time: '23:30:00',
        ticket_price:     750.00, total_seats: 2000, available_seats: 1800,
        event_status:     'published',
        banner_image:     'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80',
        categories:       ['Music']
      },
      {
        organizer_id:     organizers[0 % organizers.length],
        venue_name:       'Cultural Palace', venue_city: 'Delhi',
        event_name:       'Delhi Wellness & Yoga Retreat 2026',
        description:      'A transformative two-day retreat featuring 40+ wellness workshops — yoga, meditation, Ayurveda consultations, breathwork sessions, and holistic nutrition masterclasses.',
        event_date:       '2026-12-26', start_time: '07:00:00', end_time: '18:00:00',
        ticket_price:     1500.00, total_seats: 500, available_seats: 420,
        event_status:     'published',
        banner_image:     'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
        categories:       ['Education']
      }
    ];

    for (const ev of events) {
      const venueId = venue(ev.venue_name, ev.venue_city);
      if (!venueId) {
        console.warn(`  ⚠️  Venue not found: ${ev.venue_name}, ${ev.venue_city} — skipping "${ev.event_name}"`);
        continue;
      }

      // Skip if event name already exists
      const [existing] = await conn.query(`SELECT event_id FROM events WHERE event_name = ? LIMIT 1`, [ev.event_name]);
      if (existing.length > 0) {
        console.log(`  ⏭️  Already exists: "${ev.event_name}"`);
        continue;
      }

      const [result] = await conn.query(`
        INSERT INTO events (organizer_id, venue_id, event_name, description, event_date, start_time, end_time,
          ticket_price, total_seats, available_seats, event_status, banner_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ev.organizer_id, venueId, ev.event_name, ev.description, ev.event_date,
         ev.start_time, ev.end_time, ev.ticket_price, ev.total_seats, ev.available_seats,
         ev.event_status, ev.banner_image]
      );
      const eventId = result.insertId;

      // Link categories
      for (const catName of ev.categories) {
        const catId = catMap[catName];
        if (catId) {
          await conn.query(`INSERT IGNORE INTO event_categories (event_id, category_id) VALUES (?, ?)`, [eventId, catId]);
        }
      }

      // Insert primary image
      await conn.query(`INSERT INTO event_images (event_id, image_url, is_primary) VALUES (?, ?, 1)`,
        [eventId, ev.banner_image]);

      console.log(`  ✅ Added: "${ev.event_name}" [ID: ${eventId}]`);
    }

    console.log('\n🎊 All events added successfully!');
    console.log('   Restart your backend server to reflect the changes.\n');

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

addMoreEvents();

