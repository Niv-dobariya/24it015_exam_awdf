const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authGuard = require('../middleware/authGuard');

// All ticket routes require authentication
router.use(authGuard);

// POST /api/v1/tickets
router.post('/', ticketController.bookTicket);

// GET /api/v1/tickets/my
router.get('/my', ticketController.getMyTickets);

// PATCH /api/v1/tickets/:id/status
router.patch('/:id/status', ticketController.updateTicketStatus);

module.exports = router;
