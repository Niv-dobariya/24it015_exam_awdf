const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const fallbackStore = require('../store');

/**
 * POST /api/v1/tickets
 * Book tickets for an event (Protected)
 * Validates ticketsAvailable >= quantity (returns 400 if not),
 * creates Ticket document, and decrements ticketsAvailable on Event.
 */
exports.bookTicket = async (req, res, next) => {
  try {
    const { eventId, quantity } = req.body;
    const attendeeId = req.user.id;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'eventId is required'
      });
    }

    const numQuantity = Number(quantity);
    if (!numQuantity || numQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'quantity must be at least 1'
      });
    }

    // Live MongoDB Connection Handler
    if (mongoose.connection.readyState === 1) {
      // Step 1: Check event existence and availability using findById
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      // Step 2: Validate remaining tickets against requested quantity
      if (event.ticketsAvailable < numQuantity) {
        return res.status(400).json({
          success: false,
          message: `Validation Error: Not enough tickets available. Requested: ${numQuantity}, Available: ${event.ticketsAvailable}`
        });
      }

      // Step 3: Create ticket
      const ticket = await Ticket.create({
        attendeeId,
        eventId,
        quantity: numQuantity,
        bookingDate: new Date(),
        status: 'booked'
      });

      // Step 4: Decrement ticketsAvailable using findByIdAndUpdate
      const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { $inc: { ticketsAvailable: -numQuantity } },
        { new: true, runValidators: true }
      );

      // Populate for clean response
      const populatedTicket = await Ticket.findById(ticket._id)
        .populate('attendeeId', 'name email')
        .populate('eventId', 'title date venue');

      return res.status(201).json({
        success: true,
        message: 'Ticket booked successfully',
        ticket: populatedTicket,
        remainingTickets: updatedEvent.ticketsAvailable
      });
    }

    // Fallback store handler
    const event = fallbackStore.events.find((e) => e._id.toString() === eventId.toString());
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.ticketsAvailable < numQuantity) {
      return res.status(400).json({
        success: false,
        message: `Validation Error: Not enough tickets available. Requested: ${numQuantity}, Available: ${event.ticketsAvailable}`
      });
    }

    event.ticketsAvailable -= numQuantity;

    const newTicket = {
      _id: 'tkt_' + Date.now(),
      attendeeId: {
        _id: attendeeId,
        name: req.user.name,
        email: req.user.email
      },
      eventId: {
        _id: event._id,
        title: event.title,
        date: event.date,
        venue: event.venue
      },
      quantity: numQuantity,
      bookingDate: new Date(),
      status: 'booked'
    };

    fallbackStore.tickets.push(newTicket);

    res.status(201).json({
      success: true,
      message: 'Ticket booked successfully',
      ticket: newTicket,
      remainingTickets: event.ticketsAvailable
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/tickets/my
 * Return the logged-in attendee's own tickets (Protected)
 * Uses .populate('attendeeId', 'name email') and .populate('eventId', 'title date venue')
 */
exports.getMyTickets = async (req, res, next) => {
  try {
    const attendeeId = req.user.id;

    if (mongoose.connection.readyState === 1) {
      const tickets = await Ticket.find({ attendeeId })
        .populate('attendeeId', 'name email')
        .populate('eventId', 'title date venue')
        .sort({ bookingDate: -1 });

      return res.status(200).json({
        success: true,
        count: tickets.length,
        data: tickets
      });
    }

    // Fallback store
    const myTickets = fallbackStore.tickets.filter((t) => {
      const attId = t.attendeeId?._id || t.attendeeId;
      return attId.toString() === attendeeId.toString();
    });

    res.status(200).json({
      success: true,
      count: myTickets.length,
      data: myTickets
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/tickets/:id/status
 * Update ticket status (Protected)
 * Allowed statuses: booked | cancelled | used
 */
exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['booked', 'cancelled', 'used'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: '${status}'. Allowed values are: ${allowedStatuses.join(', ')}`
      });
    }

    if (mongoose.connection.readyState === 1) {
      const ticket = await Ticket.findById(id);
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
      }

      const previousStatus = ticket.status;
      ticket.status = status;
      await ticket.save();

      // If cancelled, restore the event's available tickets
      if (previousStatus !== 'cancelled' && status === 'cancelled') {
        await Event.findByIdAndUpdate(ticket.eventId, {
          $inc: { ticketsAvailable: ticket.quantity }
        });
      }

      const updated = await Ticket.findById(ticket._id)
        .populate('attendeeId', 'name email')
        .populate('eventId', 'title date venue');

      return res.status(200).json({
        success: true,
        message: `Ticket status successfully updated to '${status}'`,
        data: updated
      });
    }

    // Fallback store
    const ticket = fallbackStore.tickets.find((t) => t._id.toString() === id.toString());
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const prev = ticket.status;
    ticket.status = status;

    if (prev !== 'cancelled' && status === 'cancelled') {
      const evId = ticket.eventId?._id || ticket.eventId;
      const targetEvent = fallbackStore.events.find((e) => e._id.toString() === evId.toString());
      if (targetEvent) {
        targetEvent.ticketsAvailable += ticket.quantity;
      }
    }

    res.status(200).json({
      success: true,
      message: `Ticket status successfully updated to '${status}'`,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};
