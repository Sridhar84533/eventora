const express = require('express');
const router = express.Router();
const cvController = require('../controllers/categoryVenueController');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/categories', cvController.getAllCategories);
router.get('/venues', cvController.getAllVenues);

// Admin protected routes
router.post('/categories', verifyToken, checkRole('admin'), cvController.createCategory);
router.put('/categories/:id', verifyToken, checkRole('admin'), cvController.updateCategory);
router.delete('/categories/:id', verifyToken, checkRole('admin'), cvController.deleteCategory);

router.post('/venues', verifyToken, checkRole('admin'), upload.single('image_url'), cvController.createVenue);
router.put('/venues/:id', verifyToken, checkRole('admin'), upload.single('image_url'), cvController.updateVenue);
router.delete('/venues/:id', verifyToken, checkRole('admin'), cvController.deleteVenue);

module.exports = router;
