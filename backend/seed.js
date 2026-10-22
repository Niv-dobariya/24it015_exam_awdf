require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Attendee = require('./models/Attendee');
const Event = require('./models/Event');
const Ticket = require('./models/Ticket');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub';

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections
    await Attendee.deleteMany({});
    await Event.deleteMany({});
    await Ticket.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    // Seed Attendees
    const hashedPassword = await bcrypt.hash('password123', 10);

    const attendeeUser = await Attendee.create({
      name: 'John Doe',
      email: 'attendee@eventhub.com',
      phone: '9876543210',
      role: 'attendee',
      password: hashedPassword
    });

    const organizerUser = await Attendee.create({
      name: 'Sarah Connor',
      email: 'organizer@eventhub.com',
      phone: '9876543211',
      role: 'organizer',
      password: hashedPassword
    });

    const adminUser = await Attendee.create({
      name: 'Admin User',
      email: 'admin@eventhub.com',
      phone: '9876543212',
      role: 'admin',
      password: hashedPassword
    });

    console.log('[Seed] Seeded Attendees (Attendee, Organizer, Admin).');

    // Seed Events
    const events = await Event.create([
      {
        title: 'CHARUSAT TechFest 2026',
        category: 'Technology',
        date: new Date('2026-09-15T10:00:00.000Z'),
        venue: 'CSPIT Auditorium, CHARUSAT',
        ticketsAvailable: 150
      },
      {
        title: 'Full Stack React & Express Workshop',
        category: 'Workshop',
        date: new Date('2026-10-05T09:30:00.000Z'),
        venue: 'IT Building - Lab 301',
        ticketsAvailable: 45
      },
      {
        title: 'AI & Machine Learning Colloquium',
        category: 'Conference',
        date: new Date('2026-11-12T11:00:00.000Z'),
        venue: 'Main Seminar Hall',
        ticketsAvailable: 0 // Sold out test case!
      },
      {
        title: 'Annual Cultural Music Night',
        category: 'Entertainment',
        date: new Date('2026-12-24T18:00:00.000Z'),
        venue: 'Open Air Amphitheatre',
        ticketsAvailable: 250
      }
    ]);

    console.log('[Seed] Seeded Events (including 1 Sold Out event to test UI).');

    // Seed Ticket for attendee
    await Ticket.create({
      attendeeId: attendeeUser._id,
      eventId: events[0]._id,
      quantity: 2,
      bookingDate: new Date(),
      status: 'booked'
    });

    console.log('[Seed] Seeded initial Ticket.');
    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
}

seedData();
