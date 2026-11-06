const db = require('../config/db');

// Get all published events with filters & pagination
exports.getAllEvents = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      city, 
      date, 
      min_price, 
      max_price, 
      sort_by = 'event_date', 
      order = 'ASC',
      page = 1,
      limit = 12
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT 
        e.event_id,
        e.event_name,
        e.description,
        e.event_date,
        e.start_time,
        e.end_time,
        e.ticket_price,
        e.total_seats,
        e.available_seats,
        e.event_status,
        e.banner_image,
        e.created_at,
        o.organizer_id,
        o.organization_name,
        v.venue_id,
        v.venue_name,
        v.city AS venue_city,
        v.state AS venue_state,
        v.address AS venue_address,
        GROUP_CONCAT(DISTINCT c.category_name SEPARATOR ', ') AS category_names
      FROM events e
      JOIN organizers o ON e.organizer_id = o.organizer_id
      LEFT JOIN venues v ON e.venue_id = v.venue_id
      LEFT JOIN event_categories ec ON e.event_id = ec.event_id
      LEFT JOIN categories c ON ec.category_id = c.category_id
      WHERE e.event_status = 'published'
    `;

    const queryParams = [];

    if (search) {
      query += ` AND (e.event_name LIKE ? OR e.description LIKE ? OR v.venue_name LIKE ? OR v.city LIKE ?)`;
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (category) {
      query += ` AND c.category_name = ?`;
      queryParams.push(category);
    }

    if (city) {
      query += ` AND v.city = ?`;
      queryParams.push(city);
    }

    if (date) {
      query += ` AND e.event_date = ?`;
      queryParams.push(date);
    }

    if (min_price) {
      query += ` AND e.ticket_price >= ?`;
      queryParams.push(parseFloat(min_price));
    }

    if (max_price) {
      query += ` AND e.ticket_price <= ?`;
      queryParams.push(parseFloat(max_price));
    }

    query += ` GROUP BY e.event_id`;

    // Sorting
    const validSortColumns = ['event_date', 'ticket_price', 'event_name', 'created_at'];
    const sortCol = validSortColumns.includes(sort_by) ? `e.${sort_by}` : 'e.event_date';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${sortCol} ${sortOrder}`;

    // Get total count first
    const [countRows] = await db.query(`SELECT COUNT(DISTINCT e.event_id) AS total FROM events e WHERE e.event_status = 'published'`);
    const totalEvents = countRows[0].total;

    // Apply pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limitNum, offset);

    const [events] = await db.query(query, queryParams);

    res.json({
      success: true,
      data: events,
      pagination: {
        total: totalEvents,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalEvents / limitNum)
      }
    });
  } catch (error) {
    console.error('Fetch Events Error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving events list.', error: error.message });
  }
};

// Get single event details by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const [events] = await db.query(
      `SELECT 
        e.*,
        o.organizer_id,
        o.organization_name,
        o.organization_description,
        o.contact_email,
        o.contact_phone,
        o.website,
        v.venue_id,
        v.venue_name,
        v.address AS venue_address,
        v.city AS venue_city,
        v.state AS venue_state,
        v.capacity AS venue_capacity,
        v.image_url AS venue_image
       FROM events e
       JOIN organizers o ON e.organizer_id = o.organizer_id
       LEFT JOIN venues v ON e.venue_id = v.venue_id
       WHERE e.event_id = ?`,
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const event = events[0];

    // Fetch event categories
    const [categories] = await db.query(
      `SELECT c.category_id, c.category_name 
       FROM categories c
       JOIN event_categories ec ON c.category_id = ec.category_id
       WHERE ec.event_id = ?`,
      [id]
    );

    // Fetch gallery images
    const [images] = await db.query(
      'SELECT image_id, image_url, is_primary FROM event_images WHERE event_id = ?',
      [id]
    );

    // Fetch public staff list
    const [staff] = await db.query(
      'SELECT staff_id, staff_name, staff_role FROM event_staff WHERE event_id = ? AND status = "active"',
      [id]
    );

    // Fetch related events in same category
    let relatedEvents = [];
    if (categories.length > 0) {
      const catId = categories[0].category_id;
      const [related] = await db.query(
        `SELECT e.event_id, e.event_name, e.event_date, e.ticket_price, e.banner_image, v.city AS venue_city
         FROM events e
         JOIN event_categories ec ON e.event_id = ec.event_id
         LEFT JOIN venues v ON e.venue_id = v.venue_id
         WHERE ec.category_id = ? AND e.event_id != ? AND e.event_status = 'published'
         LIMIT 4`,
        [catId, id]
      );
      relatedEvents = related;
    }

    res.json({
      success: true,
      data: {
        ...event,
        categories,
        images,
        staff,
        relatedEvents
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving event details.', error: error.message });
  }
};

// Featured & Upcoming Events for Home Page
exports.getHomeOverview = async (req, res) => {
  try {
    const [featured] = await db.query(
      `SELECT e.event_id, e.event_name, e.description, e.event_date, e.start_time, e.ticket_price, e.available_seats, e.banner_image, v.venue_name, v.city AS venue_city
       FROM events e
       LEFT JOIN venues v ON e.venue_id = v.venue_id
       WHERE e.event_status = 'published'
       ORDER BY e.created_at DESC
       LIMIT 6`
    );

    const [upcoming] = await db.query(
      `SELECT e.event_id, e.event_name, e.event_date, e.start_time, e.ticket_price, e.banner_image, v.city AS venue_city
       FROM events e
       LEFT JOIN venues v ON e.venue_id = v.venue_id
       WHERE e.event_status = 'published' AND e.event_date >= CURDATE()
       ORDER BY e.event_date ASC
       LIMIT 8`
    );

    const [categories] = await db.query(
      `SELECT c.category_id, c.category_name, c.description, COUNT(ec.event_id) AS event_count
       FROM categories c
       LEFT JOIN event_categories ec ON c.category_id = ec.category_id
       WHERE c.status = 'active'
       GROUP BY c.category_id`
    );

    const [venues] = await db.query(
      `SELECT venue_id, venue_name, city, state, capacity, image_url
       FROM venues
       WHERE status = 'active'
       LIMIT 6`
    );

    const [statsRows] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM events WHERE event_status = 'published') AS total_events,
        (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_users,
        (SELECT COUNT(*) FROM organizers) AS total_organizers,
        (SELECT COALESCE(SUM(number_of_tickets), 0) FROM bookings WHERE booking_status = 'confirmed') AS total_tickets_sold
    `);

    res.json({
      success: true,
      data: {
        featured,
        upcoming,
        categories,
        venues,
        stats: statsRows[0]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving home overview.', error: error.message });
  }
};
