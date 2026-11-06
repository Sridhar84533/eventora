const db = require('../config/db');

// Helper to ensure organizer_id
const getOrganizerId = async (user_id) => {
  const [rows] = await db.query('SELECT organizer_id FROM organizers WHERE user_id = ?', [user_id]);
  if (rows.length === 0) return null;
  return rows[0].organizer_id;
};

// Organizer Dashboard Overview & Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const organizer_id = await getOrganizerId(user_id);

    if (!organizer_id) {
      return res.status(404).json({ success: false, message: 'Organizer record not found.' });
    }

    // Counts
    const [statsRows] = await db.query(
      `SELECT 
        COUNT(*) AS total_events,
        COALESCE(SUM(CASE WHEN event_status = 'published' THEN 1 ELSE 0 END), 0) AS published_events,
        COALESCE(SUM(CASE WHEN event_status = 'pending' THEN 1 ELSE 0 END), 0) AS pending_events,
        COALESCE(SUM(CASE WHEN event_status = 'draft' THEN 1 ELSE 0 END), 0) AS draft_events,
        COALESCE(SUM(CASE WHEN event_status = 'cancelled' THEN 1 ELSE 0 END), 0) AS cancelled_events
       FROM events
       WHERE organizer_id = ?`,
      [organizer_id]
    );

    // Bookings & Revenue
    const [revRows] = await db.query(
      `SELECT 
        COUNT(b.booking_id) AS total_bookings,
        COALESCE(SUM(CASE WHEN b.booking_status = 'confirmed' THEN b.total_amount ELSE 0 END), 0) AS total_revenue
       FROM bookings b
       JOIN events e ON b.event_id = e.event_id
       WHERE e.organizer_id = ?`,
      [organizer_id]
    );

    // Upcoming Events Count
    const [upcomingRows] = await db.query(
      `SELECT COUNT(*) AS upcoming_events 
       FROM events 
       WHERE organizer_id = ? AND event_status = 'published' AND event_date >= CURDATE()`,
      [organizer_id]
    );

    // Revenue over time (Group by month)
    const [revenueChart] = await db.query(
      `SELECT 
        DATE_FORMAT(b.booking_date, '%b %Y') AS month,
        SUM(b.total_amount) AS revenue,
        COUNT(b.booking_id) AS bookings
       FROM bookings b
       JOIN events e ON b.event_id = e.event_id
       WHERE e.organizer_id = ? AND b.booking_status = 'confirmed'
       GROUP BY DATE_FORMAT(b.booking_date, '%Y-%m'), DATE_FORMAT(b.booking_date, '%b %Y')
       ORDER BY DATE_FORMAT(b.booking_date, '%Y-%m') ASC
       LIMIT 12`,
      [organizer_id]
    );

    // Popular events by bookings
    const [popularEvents] = await db.query(
      `SELECT e.event_id, e.event_name, e.ticket_price, COUNT(b.booking_id) AS total_bookings, COALESCE(SUM(b.total_amount), 0) AS revenue
       FROM events e
       LEFT JOIN bookings b ON e.event_id = b.event_id AND b.booking_status = 'confirmed'
       WHERE e.organizer_id = ?
       GROUP BY e.event_id
       ORDER BY revenue DESC
       LIMIT 5`,
      [organizer_id]
    );

    res.json({
      success: true,
      data: {
        stats: {
          totalEvents: statsRows[0].total_events,
          publishedEvents: statsRows[0].published_events,
          pendingEvents: statsRows[0].pending_events,
          draftEvents: statsRows[0].draft_events,
          cancelledEvents: statsRows[0].cancelled_events,
          totalBookings: revRows[0].total_bookings,
          totalRevenue: parseFloat(revRows[0].total_revenue),
          upcomingEvents: upcomingRows[0].upcoming_events
        },
        revenueChart,
        popularEvents
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving organizer stats.', error: error.message });
  }
};

// Create Event
exports.createEvent = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const user_id = req.user.user_id;
    const organizer_id = await getOrganizerId(user_id);

    if (!organizer_id) {
      await connection.rollback();
      return res.status(403).json({ success: false, message: 'Only registered organizers can create events.' });
    }

    const {
      event_name,
      description,
      event_date,
      start_time,
      end_time,
      ticket_price,
      total_seats,
      venue_id,
      category_ids = [],
      banner_image
    } = req.body;

    if (!event_name || !event_date || !start_time || !end_time || total_seats === undefined) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Event name, date, start/end time, and total seats are required.' });
    }

    const banner = req.file ? `/uploads/banners/${req.file.filename}` : (banner_image || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80');

    // Insert Event with default status 'pending'
    const [eventResult] = await connection.query(
      `INSERT INTO events 
       (organizer_id, venue_id, event_name, description, event_date, start_time, end_time, ticket_price, total_seats, available_seats, event_status, banner_image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        organizer_id,
        venue_id || null,
        event_name,
        description || '',
        event_date,
        start_time,
        end_time,
        ticket_price || 0.00,
        total_seats,
        total_seats, // available_seats initially equal to total_seats
        banner
      ]
    );

    const event_id = eventResult.insertId;

    // Insert categories
    if (Array.isArray(category_ids) && category_ids.length > 0) {
      for (const catId of category_ids) {
        await connection.query(
          'INSERT INTO event_categories (event_id, category_id) VALUES (?, ?)',
          [event_id, catId]
        );
      }
    }

    // Insert primary image into event_images
    await connection.query(
      'INSERT INTO event_images (event_id, image_url, is_primary) VALUES (?, ?, 1)',
      [event_id, banner]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Event created successfully and submitted for admin review!',
      event_id
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create Event Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create event.', error: error.message });
  } finally {
    connection.release();
  }
};

// Edit / Update Event
exports.updateEvent = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const user_id = req.user.user_id;
    const organizer_id = await getOrganizerId(user_id);
    const { id } = req.params;

    const {
      event_name,
      description,
      event_date,
      start_time,
      end_time,
      ticket_price,
      total_seats,
      venue_id,
      category_ids = [],
      event_status,
      banner_image
    } = req.body;

    // Verify ownership
    const [existing] = await connection.query('SELECT * FROM events WHERE event_id = ? AND organizer_id = ?', [id, organizer_id]);
    if (existing.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Event not found or access denied.' });
    }

    const banner = req.file ? `/uploads/banners/${req.file.filename}` : (banner_image || existing[0].banner_image);

    await connection.query(
      `UPDATE events 
       SET event_name = ?, description = ?, event_date = ?, start_time = ?, end_time = ?, ticket_price = ?, total_seats = ?, venue_id = ?, banner_image = ?
       WHERE event_id = ?`,
      [event_name, description, event_date, start_time, end_time, ticket_price, total_seats, venue_id || null, banner, id]
    );

    // Update categories
    if (Array.isArray(category_ids)) {
      await connection.query('DELETE FROM event_categories WHERE event_id = ?', [id]);
      for (const catId of category_ids) {
        await connection.query('INSERT INTO event_categories (event_id, category_id) VALUES (?, ?)', [id, catId]);
      }
    }

    await connection.commit();
    res.json({ success: true, message: 'Event updated successfully!' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: 'Failed to update event.', error: error.message });
  } finally {
    connection.release();
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const organizer_id = await getOrganizerId(user_id);
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM events WHERE event_id = ? AND organizer_id = ?', [id, organizer_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Event not found or access denied.' });
    }

    res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event.', error: error.message });
  }
};

// Get Organizer's Events List
exports.getOrganizerEvents = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const organizer_id = await getOrganizerId(user_id);
    const { status } = req.query;

    let query = `
      SELECT e.*, v.venue_name, v.city AS venue_city,
             (SELECT COUNT(*) FROM bookings b WHERE b.event_id = e.event_id AND b.booking_status = 'confirmed') AS booking_count
      FROM events e
      LEFT JOIN venues v ON e.venue_id = v.venue_id
      WHERE e.organizer_id = ?
    `;

    const params = [organizer_id];
    if (status) {
      query += ` AND e.event_status = ?`;
      params.push(status);
    }

    query += ` ORDER BY e.created_at DESC`;

    const [events] = await db.query(query, params);
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching organizer events.', error: error.message });
  }
};

// Organizer Bookings & Attendees List
exports.getOrganizerBookings = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const organizer_id = await getOrganizerId(user_id);

    const [bookings] = await db.query(
      `SELECT 
        b.booking_id, b.booking_reference, b.number_of_tickets, b.total_amount, b.booking_status, b.booking_date,
        u.full_name AS attendee_name, u.email AS attendee_email, u.phone AS attendee_phone,
        e.event_id, e.event_name, e.event_date
       FROM bookings b
       JOIN users u ON b.user_id = u.user_id
       JOIN events e ON b.event_id = e.event_id
       WHERE e.organizer_id = ?
       ORDER BY b.booking_date DESC`,
      [organizer_id]
    );

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving attendee bookings.', error: error.message });
  }
};

// Manage Event Staff (Add, List, Delete)
exports.getStaff = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const organizer_id = await getOrganizerId(user_id);

    const [staff] = await db.query(
      `SELECT s.*, e.event_name 
       FROM event_staff s
       JOIN events e ON s.event_id = e.event_id
       WHERE e.organizer_id = ?
       ORDER BY s.staff_id DESC`,
      [organizer_id]
    );

    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving staff list.', error: error.message });
  }
};

exports.addStaff = async (req, res) => {
  try {
    const { event_id, staff_name, staff_role, phone, email } = req.body;
    await db.query(
      'INSERT INTO event_staff (event_id, staff_name, staff_role, phone, email, status) VALUES (?, ?, ?, ?, ?, "active")',
      [event_id, staff_name, staff_role, phone || null, email || null]
    );
    res.status(201).json({ success: true, message: 'Staff member added successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding staff member.', error: error.message });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM event_staff WHERE staff_id = ?', [id]);
    res.json({ success: true, message: 'Staff member removed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing staff.', error: error.message });
  }
};
