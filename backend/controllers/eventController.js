const mongoose = require('mongoose');
const Event = require('../models/Event');
const fallbackStore = require('../store');

/**
 * GET /api/v1/events
 * Public endpoint to list all events
 */
exports.getAllEvents = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const events = await Event.find().sort({ date: 1 });
      return res.status(200).json({
        success: true,
        count: events.length,
        data: events
      });
    }

    // Fallback store
    res.status(200).json({
      success: true,
      count: fallbackStore.events.length,
      data: fallbackStore.events
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/events
 * Create a new event (used by organizer panel or seeding)
 */
exports.createEvent = async (req, res, next) => {
  try {
    const { title, category, date, venue, ticketsAvailable } = req.body;

    if (mongoose.connection.readyState === 1) {
      const event = await Event.create({
        title,
        category,
        date,
        venue,
        ticketsAvailable: Number(ticketsAvailable)
      });

      return res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: event
      });
    }

    // Fallback store
    const newEvent = {
      _id: 'ev_' + Date.now(),
      title,
      category: category || 'General',
      date: new Date(date),
      venue,
      ticketsAvailable: Number(ticketsAvailable)
    };

    fallbackStore.events.push(newEvent);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
  } catch (error) {
    next(error);
  }
};
