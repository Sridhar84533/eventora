const db = require('../config/db');

// Get User Dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // Total Bookings, Amount Spent, Cancelled Count
    const [bookingStats] = await db.query(
      `SELECT 
        COUNT(*) AS total_bookings,
        COALESCE(SUM(CASE WHEN booking_status = 'confirmed' THEN total_amount ELSE 0 END), 0) AS total_spent,
        COALESCE(SUM(CASE WHEN booking_status = 'cancelled' THEN 1 ELSE 0 END), 0) AS cancelled_bookings
       FROM bookings
       WHERE user_id = ?`,
      [user_id]
    );

    // Upcoming Events count
    const [upcomingStats] = await db.query(
      `SELECT COUNT(DISTINCT b.booking_id) AS upcoming_events
       FROM bookings b
       JOIN events e ON b.event_id = e.event_id
       WHERE b.user_id = ? AND b.booking_status = 'confirmed' AND e.event_date >= CURDATE()`,
      [user_id]
    );

    // Completed Events count
    const [completedStats] = await db.query(
      `SELECT COUNT(DISTINCT b.booking_id) AS completed_events
       FROM bookings b
       JOIN events e ON b.event_id = e.event_id
       WHERE b.user_id = ? AND b.booking_status = 'confirmed' AND e.event_date < CURDATE()`,
      [user_id]
    );

    // Recent Bookings list
    const [recentBookings] = await db.query(
      `SELECT b.booking_id, b.booking_reference, b.number_of_tickets, b.total_amount, b.booking_status, b.booking_date, e.event_name, e.event_date, e.banner_image
       FROM bookings b
       JOIN events e ON b.event_id = e.event_id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC
       LIMIT 5`,
      [user_id]
    );

    res.json({
      success: true,
      data: {
        stats: {
          totalBookings: bookingStats[0].total_bookings,
          totalSpent: parseFloat(bookingStats[0].total_spent),
          cancelledBookings: bookingStats[0].cancelled_bookings,
          upcomingEvents: upcomingStats[0].upcoming_events,
          completedEvents: completedStats[0].completed_events
        },
        recentBookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user dashboard stats.', error: error.message });
  }
};

// Update profile details
exports.updateProfile = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const user_id = req.user.user_id;
    const { full_name, phone, date_of_birth, gender, address, city, state, pincode, profile_image } = req.body;

    // Update users table
    await connection.query('UPDATE users SET full_name = ?, phone = ? WHERE user_id = ?', [full_name, phone, user_id]);

    // Upsert user_profiles
    const [existing] = await connection.query('SELECT profile_id FROM user_profiles WHERE user_id = ?', [user_id]);
    if (existing.length > 0) {
      await connection.query(
        `UPDATE user_profiles 
         SET date_of_birth = ?, gender = ?, address = ?, city = ?, state = ?, pincode = ?, profile_image = ?
         WHERE user_id = ?`,
        [date_of_birth, gender, address, city, state, pincode, profile_image, user_id]
      );
    } else {
      await connection.query(
        `INSERT INTO user_profiles (user_id, date_of_birth, gender, address, city, state, pincode, profile_image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, date_of_birth, gender, address, city, state, pincode, profile_image]
      );
    }

    await connection.commit();
    res.json({ success: true, message: 'Profile updated successfully!' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: 'Failed to update profile.', error: error.message });
  } finally {
    connection.release();
  }
};

// Upload Avatar Image
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }
    const avatarUrl = `/uploads/profile_pictures/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Avatar uploaded successfully!',
      url: avatarUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload avatar image.', error: error.message });
  }
};

// Favourites: Toggle favourite event
exports.toggleFavourite = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { event_id } = req.body;

    const [existing] = await db.query('SELECT favourite_id FROM favourites WHERE user_id = ? AND event_id = ?', [user_id, event_id]);

    if (existing.length > 0) {
      await db.query('DELETE FROM favourites WHERE favourite_id = ?', [existing[0].favourite_id]);
      return res.json({ success: true, is_favourite: false, message: 'Removed from favourites.' });
    } else {
      await db.query('INSERT INTO favourites (user_id, event_id) VALUES (?, ?)', [user_id, event_id]);
      return res.json({ success: true, is_favourite: true, message: 'Added to favourites!' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error toggling favourite.', error: error.message });
  }
};

// Get User's Favourites List
exports.getFavourites = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const [favourites] = await db.query(
      `SELECT e.event_id, e.event_name, e.event_date, e.start_time, e.ticket_price, e.banner_image, e.available_seats, v.venue_name, v.city AS venue_city
       FROM favourites f
       JOIN events e ON f.event_id = e.event_id
       LEFT JOIN venues v ON e.venue_id = v.venue_id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [user_id]
    );

    res.json({ success: true, data: favourites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving favourites.', error: error.message });
  }
};

// Get User Notifications
exports.getNotifications = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const [notifications] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving notifications.', error: error.message });
  }
};

// Mark Notification as Read
exports.markNotificationRead = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;
    await db.query('UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?', [id, user_id]);
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating notification.', error: error.message });
  }
};
