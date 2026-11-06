const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(verifyToken, checkRole('organizer', 'admin'));

router.get('/dashboard-stats', organizerController.getDashboardStats);
router.get('/events', organizerController.getOrganizerEvents);
router.post('/events', upload.single('banner_image'), organizerController.createEvent);
router.put('/events/:id', upload.single('banner_image'), organizerController.updateEvent);
router.delete('/events/:id', organizerController.deleteEvent);

router.get('/bookings', organizerController.getOrganizerBookings);
router.get('/staff', organizerController.getStaff);
router.post('/staff', organizerController.addStaff);
router.delete('/staff/:id', organizerController.deleteStaff);

module.exports = router;
