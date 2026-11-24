-- Run once on the mwt_dev database (pgAdmin Query Tool, psql or Docker).
-- Requires 001_genres.sql and 003_users.sql.
-- Latest result of each activity or question, one row per user and item.
-- item_id is the key of the activity or question defined in the front-end.
CREATE TABLE IF NOT EXISTS theory_results (
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  genre_id INTEGER NOT NULL REFERENCES genres (id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('activity', 'question')),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  correct BOOLEAN,
  answer JSONB,
  score INTEGER CHECK (score >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, genre_id, item_id)
);
