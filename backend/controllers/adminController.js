const db = require('../config/db');

// Admin Dashboard Overview & Charts
exports.getDashboardStats = async (req, res) => {
  try {
    const [counts] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_users,
        (SELECT COUNT(*) FROM organizers) AS total_organizers,
        (SELECT COUNT(*) FROM events) AS total_events,
        (SELECT COUNT(*) FROM events WHERE event_status = 'pending') AS pending_events,
        (SELECT COUNT(*) FROM events WHERE event_status = 'published') AS approved_events,
        (SELECT COUNT(*) FROM bookings) AS total_bookings,
        (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE booking_status = 'confirmed') AS total_revenue,
        (SELECT COUNT(*) FROM venues) AS total_venues
    `);

    // Monthly User Registration Chart Data
    const [userRegChart] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%b %Y') AS month, COUNT(*) AS count
      FROM users
      GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b %Y')
      ORDER BY DATE_FORMAT(created_at, '%Y-%m') ASC
      LIMIT 12
    `);

    // Revenue & Bookings Chart Data
    const [revenueChart] = await db.query(`
      SELECT 
        DATE_FORMAT(booking_date, '%b %Y') AS month,
        SUM(total_amount) AS revenue,
        COUNT(booking_id) AS bookings
      FROM bookings
      WHERE booking_status = 'confirmed'
      GROUP BY DATE_FORMAT(booking_date, '%Y-%m'), DATE_FORMAT(booking_date, '%b %Y')
      ORDER BY DATE_FORMAT(booking_date, '%Y-%m') ASC
      LIMIT 12
    `);

    // Popular categories
    const [popularCategories] = await db.query(`
      SELECT c.category_name, COUNT(ec.event_id) AS event_count
      FROM categories c
      LEFT JOIN event_categories ec ON c.category_id = ec.category_id
      GROUP BY c.category_id
      ORDER BY event_count DESC
    `);

    res.json({
      success: true,
      data: {
        stats: counts[0],
        charts: {
          userRegistrations: userRegChart,
          revenue: revenueChart,
          popularCategories
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving admin stats.', error: error.message });
  }
};

// User Management
exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT u.user_id, u.full_name, u.email, u.phone, u.role, u.status, u.created_at,
             COUNT(b.booking_id) AS total_bookings
      FROM users u
      LEFT JOIN bookings b ON u.user_id = b.user_id
      GROUP BY u.user_id
      ORDER BY u.created_at DESC
    `);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving users list.', error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, role } = req.body;
    await db.query('UPDATE users SET status = ?, role = ? WHERE user_id = ?', [status, role, id]);
    res.json({ success: true, message: 'User updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user.', error: error.message });
  }
};

// Organizer Management
exports.getOrganizers = async (req, res) => {
  try {
    const [organizers] = await db.query(`
      SELECT o.*, u.full_name, u.email, u.phone,
             (SELECT COUNT(*) FROM events e WHERE e.organizer_id = o.organizer_id) AS total_events
      FROM organizers o
      JOIN users u ON o.user_id = u.user_id
      ORDER BY o.created_at DESC
    `);
    res.json({ success: true, data: organizers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving organizers.', error: error.message });
  }
};

exports.updateOrganizerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { verification_status } = req.body;
    await db.query('UPDATE organizers SET verification_status = ? WHERE organizer_id = ?', [verification_status, id]);
    res.json({ success: true, message: 'Organizer verification status updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating organizer status.', error: error.message });
  }
};

// Event Approval / Rejection Flow
exports.getAllEventsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT e.*, o.organization_name, v.venue_name, v.city AS venue_city
      FROM events e
      JOIN organizers o ON e.organizer_id = o.organizer_id
      LEFT JOIN venues v ON e.venue_id = v.venue_id
    `;
    const params = [];
    if (status) {
      query += ` WHERE e.event_status = ?`;
      params.push(status);
    }
    query += ` ORDER BY e.created_at DESC`;

    const [events] = await db.query(query, params);
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving events.', error: error.message });
  }
};

exports.approveOrRejectEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { event_status } = req.body; // 'published' or 'rejected'

    if (!['published', 'rejected', 'cancelled'].includes(event_status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update.' });
    }

    // Call stored procedure or direct UPDATE query
    await db.query('CALL sp_approve_event(?, ?)', [id, event_status]);

    // Send notification to organizer
    const [events] = await db.query('SELECT organizer_id, event_name FROM events WHERE event_id = ?', [id]);
    if (events.length > 0) {
      const [orgs] = await db.query('SELECT user_id FROM organizers WHERE organizer_id = ?', [events[0].organizer_id]);
      if (orgs.length > 0) {
        await db.query(
          `INSERT INTO notifications (user_id, title, message, notification_type) 
           VALUES (?, ?, ?, 'system')`,
          [
            orgs[0].user_id,
            `Event Status Updated: ${event_status.toUpperCase()}`,
            `Your event "${events[0].event_name}" has been ${event_status === 'published' ? 'APPROVED and published' : 'REJECTED'} by system admin.`
          ]
        );
      }
    }

    res.json({ success: true, message: `Event has been ${event_status}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating event status.', error: error.message });
  }
};

// All Bookings & Payments
exports.getAllBookingsAdmin = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, u.full_name AS user_name, u.email AS user_email, e.event_name, p.transaction_id, p.payment_method, p.payment_status
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN events e ON b.event_id = e.event_id
      LEFT JOIN payments p ON b.booking_id = p.booking_id
      ORDER BY b.booking_date DESC
    `);
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving bookings.', error: error.message });
  }
};

// Reports & Analytics
exports.getAnalyticsReport = async (req, res) => {
  try {
    const [revenueByEvent] = await db.query(`
      SELECT e.event_id, e.event_name, o.organization_name, COUNT(b.booking_id) AS tickets_sold, COALESCE(SUM(b.total_amount), 0) AS total_revenue
      FROM events e
      JOIN organizers o ON e.organizer_id = o.organizer_id
      LEFT JOIN bookings b ON e.event_id = b.event_id AND b.booking_status = 'confirmed'
      GROUP BY e.event_id
      ORDER BY total_revenue DESC
    `);

    res.json({
      success: true,
      data: {
        revenueByEvent
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching analytical report.', error: error.message });
  }
};
