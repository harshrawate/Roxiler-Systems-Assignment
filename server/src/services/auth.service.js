const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const SALT_ROUNDS = 10;

const register = async ({ name, email, password, address }) => {
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await db.query(
    `INSERT INTO users (name, email, password, address, role)
     VALUES ($1, $2, $3, $4, 'user') RETURNING id, name, email, address, role`,
    [name, email, hashed, address || null]
  );
  return result.rows[0];
};

const login = async ({ email, password }) => {
  const result = await db.query(
    'SELECT id, name, email, address, role, password FROM users WHERE email = $1',
    [email]
  );
  if (result.rows.length === 0) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  return { token, user: payload };
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const result = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
  if (result.rows.length === 0) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const match = await bcrypt.compare(currentPassword, result.rows[0].password);
  if (!match) {
    const err = new Error('Current password is incorrect');
    err.statusCode = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, userId]);
};

module.exports = { register, login, changePassword };
