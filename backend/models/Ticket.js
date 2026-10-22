const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    attendeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attendee',
      required: [true, 'attendeeId is required']
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'eventId is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Ticket quantity is required'],
      min: [1, 'quantity must be at least 1']
    },
    bookingDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: {
        values: ['booked', 'cancelled', 'used'],
        message: '{VALUE} is not a valid ticket status. Allowed: booked, cancelled, used'
      },
      default: 'booked'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
