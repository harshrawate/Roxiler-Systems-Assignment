require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/db');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {

    await db.query('SELECT NOW()');
    console.log('✅ Database connected successfully');

    const sql = fs.readFileSync(path.join(__dirname, 'migrations/001_init.sql'), 'utf8');
    await db.query(sql);
    console.log('✅ Database schema and test data verified');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (err) {
    console.error('❌ Startup failed:', err.message);
    process.exit(1);
  }
}

startServer();
