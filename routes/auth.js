const express = require('express');
const User = require('../models/User');
const { hashPassword, verifyPassword, makeToken, readToken, parseCookies } = require('../lib/security');

const router = express.Router();

const COOKIE = 'sunny_session';
const MAX_AGE = 7 * 24 * 60 * 60; // stay logged in for 7 days

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9+\-\s]{8,15}$/;

function setLoginCookie(res, userId) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE}=${makeToken(userId, MAX_AGE)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}${secure}`);
}

function clearLoginCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}

// Other routes use this to find out who is logged in (returns the user id or null)
function getUserId(req) {
  return readToken(parseCookies(req.headers.cookie)[COOKIE]);
}

/* Simple protection against password guessing: 8 tries per 15 minutes per IP + email */
const attempts = new Map();
const WINDOW = 15 * 60 * 1000;
const MAX_TRIES = 8;

function tooManyTries(key) {
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((t) => now - t < WINDOW);
  attempts.set(key, recent);
  if (attempts.size > 5000) attempts.clear();
  return recent.length >= MAX_TRIES;
}
function noteFailure(key) {
  attempts.set(key, [...(attempts.get(key) || []), Date.now()]);
}

// A fake hash so a wrong email takes about as long as a wrong password
const dummyHash = hashPassword('not-a-real-password');

function publicUser(u) {
  return { id: String(u._id), name: u.name, email: u.email, phone: u.phone || '' };
}

// POST /api/auth/signup  { name, email, phone, password }
router.post('/signup', async (req, res) => {
  try {
    const { name = '', email = '', phone = '', password = '' } = req.body || {};
    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone).trim();

    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({ error: 'Please enter your name' });
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    if (cleanPhone && !PHONE_RE.test(cleanPhone)) {
      return res.status(400).json({ error: 'Please enter a valid phone number' });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (password.length > 100) {
      return res.status(400).json({ error: 'Password is too long' });
    }

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash: await hashPassword(password),
    });

    setLoginCookie(res, user._id);
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists. Try logging in.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Could not create your account. Please try again.' });
  }
});

// POST /api/auth/login  { email, password }
router.post('/login', async (req, res) => {
  try {
    const email = String((req.body && req.body.email) || '').trim().toLowerCase();
    const password = String((req.body && req.body.password) || '');
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter your email and password' });
    }

    const key = `${req.ip}|${email}`;
    if (tooManyTries(key)) {
      return res.status(429).json({ error: 'Too many attempts. Please wait a few minutes and try again.' });
    }

    const user = await User.findOne({ email });
    const ok = user
      ? await verifyPassword(password, user.passwordHash)
      : (await verifyPassword(password, await dummyHash), false);

    if (!ok) {
      noteFailure(key);
      return res.status(401).json({ error: 'Wrong email or password' });
    }

    attempts.delete(key);
    setLoginCookie(res, user._id);
    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not log you in. Please try again.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  clearLoginCookie(res);
  res.json({ ok: true });
});

// GET /api/auth/me  -> { user } or { user: null }
router.get('/me', async (req, res) => {
  try {
    const id = getUserId(req);
    if (!id) return res.json({ user: null });
    const user = await User.findById(id).lean();
    if (!user) {
      clearLoginCookie(res);
      return res.json({ user: null });
    }
    res.json({ user: publicUser(user) });
  } catch {
    res.json({ user: null });
  }
});

module.exports = router;
module.exports.getUserId = getUserId;
