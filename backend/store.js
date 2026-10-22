/**
 * In-memory fallback data store for EventHub
 * Used when a live MongoDB instance is not connected, ensuring the application
 * remains testable and responsive during local demonstrations.
 */
const bcrypt = require('bcryptjs');

let attendees = [
  {
    _id: '64f1a2b3c4d5e6f7a8b9c001',
    name: 'John Doe',
    email: 'attendee@eventhub.com',
    phone: '9876543210',
    role: 'attendee',
    password: 'password123'
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c002',
    name: 'Sarah Connor',
    email: 'organizer@eventhub.com',
    phone: '9876543211',
    role: 'organizer',
    password: 'password123'
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c003',
    name: 'Admin User',
    email: 'admin@eventhub.com',
    phone: '9876543212',
    role: 'admin',
    password: 'password123'
  }
];

let events = [
  {
    _id: '64f1a2b3c4d5e6f7a8b9e001',
    title: 'CHARUSAT TechFest 2026',
    category: 'Technology',
    date: new Date('2026-09-15T10:00:00.000Z'),
    venue: 'CSPIT Auditorium, CHARUSAT',
    ticketsAvailable: 150
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9e002',
    title: 'Full Stack React & Express Workshop',
    category: 'Workshop',
    date: new Date('2026-10-05T09:30:00.000Z'),
    venue: 'IT Building - Lab 301',
    ticketsAvailable: 45
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9e003',
    title: 'AI & Machine Learning Colloquium',
    category: 'Conference',
    date: new Date('2026-11-12T11:00:00.000Z'),
    venue: 'Main Seminar Hall',
    ticketsAvailable: 0 // Sold out test case!
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9e004',
    title: 'Annual Cultural Music Night',
    category: 'Entertainment',
    date: new Date('2026-12-24T18:00:00.000Z'),
    venue: 'Open Air Amphitheatre',
    ticketsAvailable: 250
  }
];

let tickets = [
  {
    _id: '64f1a2b3c4d5e6f7a8b9t001',
    attendeeId: '64f1a2b3c4d5e6f7a8b9c001',
    eventId: '64f1a2b3c4d5e6f7a8b9e001',
    quantity: 2,
    bookingDate: new Date(),
    status: 'booked'
  }
];

module.exports = {
  attendees,
  events,
  tickets
};
