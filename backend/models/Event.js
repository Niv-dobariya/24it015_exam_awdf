const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    },
    date: {
      type: Date,
      required: [true, 'Event date is required']
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true
    },
    ticketsAvailable: {
      type: Number,
      required: [true, 'Tickets available count is required'],
      min: [0, 'ticketsAvailable cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Event', eventSchema);
