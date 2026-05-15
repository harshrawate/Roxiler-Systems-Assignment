const db = require('../config/db');

const ALLOWED_STORE_SORT = ['name', 'email', 'address', 'avg_rating'];

const getStores = async (userId, { name, address, sortBy = 'name', order = 'asc' }) => {
  const col = ALLOWED_STORE_SORT.includes(sortBy) ? sortBy : 'name';
  const dir = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const conditions = [];
  const params = [userId];

  if (name) { params.push(`%${name}%`); conditions.push(`s.name ILIKE $${params.length}`); }
  if (address) { params.push(`%${address}%`); conditions.push(`s.address ILIKE $${params.length}`); }

  const where = conditions.length ? `AND ${conditions.join(' AND ')}` : '';

  const orderClause =
    col === 'avg_rating'
      ? `ORDER BY avg_rating ${dir} NULLS LAST`
      : `ORDER BY s.${col} ${dir}`;

  const result = await db.query(
    `SELECT
       s.id, s.name, s.email, s.address,
       ROUND(AVG(r.rating)::numeric, 2) AS avg_rating,
       ur.id       AS user_rating_id,
       ur.rating   AS user_rating
     FROM stores s
     LEFT JOIN ratings r  ON r.store_id = s.id
     LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $1
     WHERE 1=1 ${where}
     GROUP BY s.id, ur.id, ur.rating
     ${orderClause}`,
    params
  );
  return result.rows;
};

const submitRating = async (userId, { store_id, rating }) => {
  const existing = await db.query(
    'SELECT id FROM ratings WHERE store_id = $1 AND user_id = $2',
    [store_id, userId]
  );
  if (existing.rows.length > 0) {
    const err = new Error('You have already rated this store. Use update instead.');
    err.statusCode = 409;
    throw err;
  }

  const result = await db.query(
    `INSERT INTO ratings (store_id, user_id, rating)
     VALUES ($1, $2, $3) RETURNING id, store_id, user_id, rating`,
    [store_id, userId, rating]
  );
  return result.rows[0];
};

const updateRating = async (userId, ratingId, { rating }) => {
  const existing = await db.query(
    'SELECT id FROM ratings WHERE id = $1 AND user_id = $2',
    [ratingId, userId]
  );
  if (existing.rows.length === 0) {
    const err = new Error('Rating not found or not owned by you');
    err.statusCode = 404;
    throw err;
  }

  const result = await db.query(
    `UPDATE ratings SET rating = $1, updated_at = NOW()
     WHERE id = $2 RETURNING id, store_id, user_id, rating`,
    [rating, ratingId]
  );
  return result.rows[0];
};

module.exports = { getStores, submitRating, updateRating };
