const db = require('../config/db');

// Create new booking with MySQL Transaction & Referential Integrity
exports.createBooking = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const user_id = req.user.user_id;
    const { event_id, number_of_tickets, payment_method = 'credit_card' } = req.body;

    if (!event_id || !number_of_tickets || number_of_tickets <= 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Valid event ID and ticket count are required.' });
    }

    // Check event status and available seats (FOR UPDATE to prevent race conditions)
    const [events] = await connection.query(
      'SELECT event_id, event_name, ticket_price, available_seats, event_status FROM events WHERE event_id = ? FOR UPDATE',
      [event_id]
    );

    if (events.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const event = events[0];

    if (event.event_status !== 'published') {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Tickets cannot be booked for unpublished events.' });
    }

    if (event.available_seats < number_of_tickets) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: `Only ${event.available_seats} ticket(s) left available.` 
      });
    }

    const total_amount = parseFloat((event.ticket_price * number_of_tickets).toFixed(2));
    const booking_reference = 'EVT-' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);

    // 1. Insert Booking Record
    const [bookingResult] = await connection.query(
      `INSERT INTO bookings 
       (user_id, event_id, booking_reference, number_of_tickets, total_amount, booking_status) 
       VALUES (?, ?, ?, ?, ?, 'confirmed')`,
      [user_id, event_id, booking_reference, number_of_tickets, total_amount]
    );

    const booking_id = bookingResult.insertId;

    // 2. Decrement Available Seats in Events Table
    await connection.query(
      'UPDATE events SET available_seats = available_seats - ? WHERE event_id = ?',
      [number_of_tickets, event_id]
    );

    // 3. Create Payment Record
    const transaction_id = 'TXN-' + Date.now() + Math.floor(100 + Math.random() * 900);
    await connection.query(
      `INSERT INTO payments 
       (booking_id, transaction_id, amount, payment_method, payment_status) 
       VALUES (?, ?, ?, ?, 'completed')`,
      [booking_id, transaction_id, total_amount, payment_method]
    );

    // 4. Create Notification
    await connection.query(
      `INSERT INTO notifications 
       (user_id, title, message, notification_type) 
       VALUES (?, ?, ?, 'booking')`,
      [
        user_id,
        'Booking Confirmed!',
        `Your booking for "${event.event_name}" (${number_of_tickets} ticket(s)) has been confirmed. Ref: ${booking_reference}`
      ]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully!',
      booking: {
        booking_id,
        booking_reference,
        event_name: event.event_name,
        number_of_tickets,
        total_amount,
        transaction_id
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Booking Error:', error);
    res.status(500).json({ success: false, message: 'Failed to process booking.', error: error.message });
  } finally {
    connection.release();
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const [bookings] = await db.query(
      `SELECT 
        b.booking_id,
        b.booking_reference,
        b.number_of_tickets,
        b.total_amount,
        b.booking_status,
        b.booking_date,
        e.event_id,
        e.event_name,
        e.event_date,
        e.start_time,
        e.end_time,
        e.banner_image,
        v.venue_name,
        v.address AS venue_address,
        v.city AS venue_city,
        p.transaction_id,
        p.payment_method,
        p.payment_status
       FROM bookings b
       JOIN events e ON b.event_id = e.event_id
       LEFT JOIN venues v ON e.venue_id = v.venue_id
       LEFT JOIN payments p ON b.booking_id = p.booking_id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC`,
      [user_id]
    );

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving user bookings.', error: error.message });
  }
};

// Get ticket details for printing / PDF view
exports.getTicketDetails = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const [bookings] = await db.query(
      `SELECT 
        b.booking_id,
        b.booking_reference,
        b.number_of_tickets,
        b.total_amount,
        b.booking_status,
        b.booking_date,
        u.full_name AS user_name,
        u.email AS user_email,
        u.phone AS user_phone,
        e.event_id,
        e.event_name,
        e.description AS event_description,
        e.event_date,
        e.start_time,
        e.end_time,
        e.banner_image,
        v.venue_name,
        v.address AS venue_address,
        v.city AS venue_city,
        v.state AS venue_state,
        o.organization_name,
        p.transaction_id,
        p.payment_method,
        p.payment_date
       FROM bookings b
       JOIN users u ON b.user_id = u.user_id
       JOIN events e ON b.event_id = e.event_id
       JOIN organizers o ON e.organizer_id = o.organizer_id
       LEFT JOIN venues v ON e.venue_id = v.venue_id
       LEFT JOIN payments p ON b.booking_id = p.booking_id
       WHERE b.booking_id = ? AND (b.user_id = ? OR ? = 'admin')`,
      [id, user_id, req.user.role]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'Ticket not found or access denied.' });
    }

    res.json({
      success: true,
      data: bookings[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving ticket details.', error: error.message });
  }
};

// Cancel booking (restores available seats)
exports.cancelBooking = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const user_id = req.user.user_id;
    const { id } = req.params;

    const [bookings] = await connection.query(
      'SELECT booking_id, event_id, number_of_tickets, booking_status FROM bookings WHERE booking_id = ? AND user_id = ?',
      [id, user_id]
    );

    if (bookings.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const booking = bookings[0];
    if (booking.booking_status === 'cancelled') {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    // 1. Update status to cancelled
    await connection.query('UPDATE bookings SET booking_status = "cancelled" WHERE booking_id = ?', [id]);

    // 2. Restore available_seats in events table
    await connection.query('UPDATE events SET available_seats = available_seats + ? WHERE event_id = ?', [booking.number_of_tickets, booking.event_id]);

    // 3. Update payment status to refunded
    await connection.query('UPDATE payments SET payment_status = "refunded" WHERE booking_id = ?', [id]);

    // 4. Create Notification
    await connection.query(
      `INSERT INTO notifications (user_id, title, message, notification_type) VALUES (?, 'Booking Cancelled', 'Your booking has been successfully cancelled and refund initiated.', 'booking')`,
      [user_id]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Booking cancelled successfully and available seats updated.'
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: 'Failed to cancel booking.', error: error.message });
  } finally {
    connection.release();
  }
};
