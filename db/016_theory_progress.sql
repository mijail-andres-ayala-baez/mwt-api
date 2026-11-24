-- Run once on the mwt_dev database (pgAdmin Query Tool, psql or Docker).
-- Requires 001_genres.sql and 003_users.sql.
-- How far each user has unlocked in each genre. progress looks like 1.1.1.
CREATE TABLE IF NOT EXISTS theory_progress (
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  genre_id INTEGER NOT NULL REFERENCES genres (id) ON DELETE CASCADE,
  progress TEXT NOT NULL CHECK (progress ~ '^[0-9]+(\.[0-9]+)*$'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, genre_id)
);
