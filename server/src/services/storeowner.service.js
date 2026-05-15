const db = require('../config/db');

const getDashboard = async (ownerId) => {

  const storeResult = await db.query(
    `SELECT s.id, s.name, s.email, s.address,
            ROUND(AVG(r.rating)::numeric, 2) AS avg_rating,
            COUNT(r.id) AS total_ratings
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.owner_id = $1
     GROUP BY s.id`,
    [ownerId]
  );

  if (storeResult.rows.length === 0) {
    return { store: null, raters: [], avg_rating: null };
  }

  const store = storeResult.rows[0];

  const ratersResult = await db.query(
    `SELECT u.id, u.name, u.email, r.rating, r.updated_at
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = $1
     ORDER BY r.updated_at DESC`,
    [store.id]
  );

  return {
    store,
    raters: ratersResult.rows,
    avg_rating: store.avg_rating,
  };
};

module.exports = { getDashboard };
