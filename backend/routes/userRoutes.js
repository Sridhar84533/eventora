const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

const upload = require('../middleware/upload');

router.use(verifyToken);

router.get('/dashboard-stats', userController.getDashboardStats);
router.post('/profile', userController.updateProfile);
router.post('/upload-avatar', upload.single('avatar'), userController.uploadAvatar);
router.post('/favourite', userController.toggleFavourite);
router.get('/favourites', userController.getFavourites);
router.get('/notifications', userController.getNotifications);
router.put('/notifications/:id/read', userController.markNotificationRead);

module.exports = router;
