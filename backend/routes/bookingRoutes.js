const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getUserBookings);
router.get('/ticket/:id', bookingController.getTicketDetails);
router.post('/cancel/:id', bookingController.cancelBooking);

module.exports = router;
