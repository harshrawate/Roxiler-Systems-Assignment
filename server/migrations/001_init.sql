-- ============================================================
-- Store Rating Platform — Initial Schema
-- ============================================================

-- Users table (stores all roles: admin, user, store_owner)
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(60)  NOT NULL CHECK (char_length(name) >= 20),
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  address    VARCHAR(400),
  role       VARCHAR(20)  NOT NULL CHECK (role IN ('admin', 'user', 'store_owner')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(60)  NOT NULL CHECK (char_length(name) >= 20),
  email      VARCHAR(255) NOT NULL UNIQUE,
  address    VARCHAR(400),
  owner_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Ratings table (one rating per user per store)
CREATE TABLE IF NOT EXISTS ratings (
  id         SERIAL PRIMARY KEY,
  store_id   INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (store_id, user_id)
);

-- ============================================================
-- Seed: Default System Administrator
-- Password: Admin@1234  (bcrypt hash below)
-- ============================================================
INSERT INTO users (name, email, password, address, role)
VALUES (
  'System Administrator User',
  'admin@platform.com',
  '$2a$10$UpMQz0ceTTg7lg.gwNbXTeJDTlsu41c2FUboI9/qN5MfvQuTEgcgC',
  'Platform Headquarters Address',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- Seed: 3 Normal Test Users
-- Password for all: Admin@1234
-- ============================================================
INSERT INTO users (name, email, password, address, role)
VALUES 
  ('Normal Test User Account 1', 'user1@platform.com', '$2a$10$UpMQz0ceTTg7lg.gwNbXTeJDTlsu41c2FUboI9/qN5MfvQuTEgcgC', 'Test Address 1', 'user'),
  ('Normal Test User Account 2', 'user2@platform.com', '$2a$10$UpMQz0ceTTg7lg.gwNbXTeJDTlsu41c2FUboI9/qN5MfvQuTEgcgC', 'Test Address 2', 'user'),
  ('Normal Test User Account 3', 'user3@platform.com', '$2a$10$UpMQz0ceTTg7lg.gwNbXTeJDTlsu41c2FUboI9/qN5MfvQuTEgcgC', 'Test Address 3', 'user')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- Seed: 2 Store Owner Accounts
-- Password for all: Admin@1234
-- ============================================================
INSERT INTO users (name, email, password, address, role)
VALUES 
  ('Store Owner Account Number 1', 'owner1@platform.com', '$2a$10$UpMQz0ceTTg7lg.gwNbXTeJDTlsu41c2FUboI9/qN5MfvQuTEgcgC', 'Owner Address 1', 'store_owner'),
  ('Store Owner Account Number 2', 'owner2@platform.com', '$2a$10$UpMQz0ceTTg7lg.gwNbXTeJDTlsu41c2FUboI9/qN5MfvQuTEgcgC', 'Owner Address 2', 'store_owner')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- Seed: 2 Stores (Linked to the above store owners)
-- ============================================================
INSERT INTO stores (name, email, address, owner_id)
VALUES 
  ('Awesome Tech Store Location 1', 'store1@platform.com', 'Store Address 1', (SELECT id FROM users WHERE email = 'owner1@platform.com')),
  ('Super Fresh Groceries Market', 'store2@platform.com', 'Store Address 2', (SELECT id FROM users WHERE email = 'owner2@platform.com'))
ON CONFLICT (email) DO NOTHING;
