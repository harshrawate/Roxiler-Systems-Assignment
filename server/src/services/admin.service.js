const bcrypt = require('bcryptjs');
const db = require('../config/db');

const SALT_ROUNDS = 10;

const ALLOWED_USER_SORT = ['name', 'email', 'address', 'role', 'created_at'];
const ALLOWED_STORE_SORT = ['name', 'email', 'address', 'avg_rating', 'created_at'];

const getDashboardStats = async () => {
  const [users, stores, ratings] = await Promise.all([
    db.query("SELECT COUNT(*) FROM users WHERE role != 'admin'"),
    db.query('SELECT COUNT(*) FROM stores'),
    db.query('SELECT COUNT(*) FROM ratings'),
  ]);
  return {
    totalUsers: parseInt(users.rows[0].count),
    totalStores: parseInt(stores.rows[0].count),
    totalRatings: parseInt(ratings.rows[0].count),
  };
};

const getUsers = async ({ name, email, address, role, sortBy = 'name', order = 'asc' }) => {
  const col = ALLOWED_USER_SORT.includes(sortBy) ? sortBy : 'name';
  const dir = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const conditions = [];
  const params = [];

  if (name) { params.push(`%${name}%`); conditions.push(`u.name ILIKE $${params.length}`); }
  if (email) { params.push(`%${email}%`); conditions.push(`u.email ILIKE $${params.length}`); }
  if (address) { params.push(`%${address}%`); conditions.push(`u.address ILIKE $${params.length}`); }
  if (role) { params.push(role); conditions.push(`u.role = $${params.length}`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await db.query(
    `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at
     FROM users u
     ${where}
     ORDER BY u.${col} ${dir}`,
    params
  );
  return result.rows;
};

const getUserById = async (id) => {
  const result = await db.query(
    `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at
     FROM users u WHERE u.id = $1`,
    [id]
  );
  if (result.rows.length === 0) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const user = result.rows[0];

  if (user.role === 'store_owner') {
    const storeResult = await db.query(
      `SELECT s.id, s.name, s.email, s.address,
              ROUND(AVG(r.rating)::numeric, 2) AS avg_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = $1
       GROUP BY s.id`,
      [id]
    );
    user.stores = storeResult.rows;
    user.avg_rating =
      storeResult.rows.length > 0
        ? storeResult.rows.reduce((sum, s) => sum + parseFloat(s.avg_rating || 0), 0) /
          storeResult.rows.length
        : null;
  }

  return user;
};

const addUser = async ({ name, email, password, address, role }) => {
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await db.query(
    `INSERT INTO users (name, email, password, address, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, address, role`,
    [name, email, hashed, address || null, role]
  );
  return result.rows[0];
};

const getStores = async ({ name, email, address, sortBy = 'name', order = 'asc' }) => {
  const col = ALLOWED_STORE_SORT.includes(sortBy) ? sortBy : 'name';
  const dir = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const conditions = [];
  const params = [];

  if (name) { params.push(`%${name}%`); conditions.push(`s.name ILIKE $${params.length}`); }
  if (email) { params.push(`%${email}%`); conditions.push(`s.email ILIKE $${params.length}`); }
  if (address) { params.push(`%${address}%`); conditions.push(`s.address ILIKE $${params.length}`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const orderClause =
    col === 'avg_rating'
      ? `ORDER BY avg_rating ${dir} NULLS LAST`
      : `ORDER BY s.${col} ${dir}`;

  const result = await db.query(
    `SELECT s.id, s.name, s.email, s.address, s.created_at,
            u.name AS owner_name,
            ROUND(AVG(r.rating)::numeric, 2) AS avg_rating
     FROM stores s
     LEFT JOIN users u ON u.id = s.owner_id
     LEFT JOIN ratings r ON r.store_id = s.id
     ${where}
     GROUP BY s.id, u.name
     ${orderClause}`,
    params
  );
  return result.rows;
};

const addStore = async ({ name, email, address, owner_id }) => {
  const existing = await db.query('SELECT id FROM stores WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    const err = new Error('Store email already exists');
    err.statusCode = 409;
    throw err;
  }

  if (owner_id) {
    const ownerCheck = await db.query(
      "SELECT id FROM users WHERE id = $1 AND role = 'store_owner'",
      [owner_id]
    );
    if (ownerCheck.rows.length === 0) {
      const err = new Error('Owner must be a valid store_owner user');
      err.statusCode = 400;
      throw err;
    }
  }

  const result = await db.query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, address, owner_id`,
    [name, email, address || null, owner_id || null]
  );
  return result.rows[0];
};

module.exports = { getDashboardStats, getUsers, getUserById, addUser, getStores, addStore };
