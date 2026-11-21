const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

const MAX_GUESTS_PER_SLOT = 40; // total seats available at one date + time

function todayString() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const { name, phone, date, time, guests, notes = '' } = req.body || {};

    if (!name || !phone || !date || !time || !guests) {
      return res.status(400).json({ error: 'Please fill in all the required fields' });
    }
    if (!/^[0-9+\-\s]{8,15}$/.test(String(phone))) {
      return res.status(400).json({ error: 'Please enter a valid phone number' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
      return res.status(400).json({ error: 'Invalid date or time' });
    }
    if (date < todayString()) {
      return res.status(400).json({ error: 'Please choose today or a future date' });
    }
    const guestCount = parseInt(guests, 10);
    if (!(guestCount >= 1 && guestCount <= 12)) {
      return res.status(400).json({ error: 'We can book 1 to 12 guests online. Call us for bigger groups.' });
    }

    const existing = await Booking.find({ date, time, status: 'Confirmed' }).lean();
    const seated = existing.reduce((sum, b) => sum + b.guests, 0);
    if (seated + guestCount > MAX_GUESTS_PER_SLOT) {
      return res.status(409).json({ error: 'Sorry, that time slot is full. Please pick another time.' });
    }

    const booking = await Booking.create({
      name: String(name).trim().slice(0, 80),
      phone: String(phone).trim(),
      date,
      time,
      guests: guestCount,
      notes: String(notes).slice(0, 300),
    });

    res.status(201).json({
      bookingId: booking._id,
      message: `Table for ${guestCount} booked on ${date} at ${time}.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not book your table. Please try again.' });
  }
});

module.exports = router;
