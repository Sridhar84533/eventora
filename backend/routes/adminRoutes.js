const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.use(verifyToken, checkRole('admin'));

router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUserStatus);

router.get('/organizers', adminController.getOrganizers);
router.put('/organizers/:id', adminController.updateOrganizerStatus);

router.get('/events', adminController.getAllEventsAdmin);
router.put('/events/:id/status', adminController.approveOrRejectEvent);

router.get('/bookings', adminController.getAllBookingsAdmin);
router.get('/analytics-report', adminController.getAnalyticsReport);

module.exports = router;
