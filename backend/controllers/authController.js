const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Attendee = require('../models/Attendee');
const fallbackStore = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'eventhub-secret-key-charusat-itue301';

/**
 * POST /api/v1/auth/login
 * Authenticate attendee and issue JWT token
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if live MongoDB connection is ready
    if (mongoose.connection.readyState === 1) {
      const attendee = await Attendee.findOne({ email: cleanEmail });
      if (!attendee) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Attendee not found.'
        });
      }

      const isMatch = await bcrypt.compare(password, attendee.password).catch(() => false);
      const directMatch = attendee.password === password;

      if (!isMatch && !directMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Incorrect password.'
        });
      }

      const payload = {
        id: attendee._id.toString(),
        name: attendee.name,
        email: attendee.email,
        role: attendee.role
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        attendee: payload
      });
    }

    // Fallback in-memory verification
    const found = fallbackStore.attendees.find((a) => a.email.toLowerCase() === cleanEmail);
    if (!found) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Attendee not found.'
      });
    }

    if (found.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    const payload = {
      id: found._id,
      name: found.name,
      email: found.email,
      role: found.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      attendee: payload
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, role, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const existing = await Attendee.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Email is already registered'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const attendee = await Attendee.create({
        name,
        email: cleanEmail,
        phone,
        role: role || 'attendee',
        password: hashedPassword
      });

      const payload = {
        id: attendee._id.toString(),
        name: attendee.name,
        email: attendee.email,
        role: attendee.role
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

      return res.status(201).json({
        success: true,
        message: 'Attendee registered successfully',
        token,
        attendee: payload
      });
    }

    // Fallback store
    const existing = fallbackStore.attendees.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered'
      });
    }

    const newAttendee = {
      _id: 'att_' + Date.now(),
      name,
      email: cleanEmail,
      phone,
      role: role || 'attendee',
      password
    };

    fallbackStore.attendees.push(newAttendee);

    const payload = {
      id: newAttendee._id,
      name: newAttendee.name,
      email: newAttendee.email,
      role: newAttendee.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

    res.status(201).json({
      success: true,
      message: 'Attendee registered successfully',
      token,
      attendee: payload
    });
  } catch (error) {
    next(error);
  }
};
