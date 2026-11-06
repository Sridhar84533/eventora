const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getAllEvents);
router.get('/home-overview', eventController.getHomeOverview);
router.get('/:id', eventController.getEventById);

module.exports = router;
