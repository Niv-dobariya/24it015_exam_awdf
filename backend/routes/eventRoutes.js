const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authGuard = require('../middleware/authGuard');

// GET /api/v1/events is PUBLIC
router.get('/', eventController.getAllEvents);

// POST /api/v1/events is PROTECTED (requires authGuard)
router.post('/', authGuard, eventController.createEvent);

module.exports = router;
