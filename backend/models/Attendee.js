const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Attendee name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Attendee email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: {
        values: ['attendee', 'organizer', 'admin'],
        message: '{VALUE} is not a valid role. Allowed: attendee, organizer, admin'
      },
      default: 'attendee'
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Attendee', attendeeSchema);
