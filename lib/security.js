/* Password hashing and login-cookie helpers.
   Uses only Node's built-in crypto module, so no extra packages are needed. */
const crypto = require('crypto');
const { promisify } = require('util');

const scrypt = promisify(crypto.scrypt);

let SECRET = process.env.SESSION_SECRET;
if (!SECRET || SECRET.length < 16) {
  SECRET = crypto.randomBytes(32).toString('hex');
  console.warn(
    'SESSION_SECRET is not set in .env (or is too short). Using a temporary one, so everyone is logged out whenever the server restarts.'
  );
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `${salt.toString('hex')}:${key.toString('hex')}`;
}

async function verifyPassword(password, stored) {
  const [saltHex, keyHex] = String(stored).split(':');
  if (!saltHex || !keyHex) return false;
  const expected = Buffer.from(keyHex, 'hex');
  const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

function sign(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
}

// A login token is: base64(json {id, exp}) + "." + signature
function makeToken(userId, maxAgeSeconds) {
  const payload = Buffer.from(JSON.stringify({ id: String(userId), exp: Date.now() + maxAgeSeconds * 1000 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

// Returns the user id if the token is genuine and not expired, otherwise null
function readToken(token) {
  if (typeof token !== 'string') return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!data.id || typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    return data.id;
  } catch {
    return null;
  }
}

function parseCookies(header) {
  const out = {};
  String(header || '')
    .split(';')
    .forEach((part) => {
      const i = part.indexOf('=');
      if (i === -1) return;
      out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
    });
  return out;
}

module.exports = { hashPassword, verifyPassword, makeToken, readToken, parseCookies };
