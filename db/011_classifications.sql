-- Run once in pgAdmin (Query Tool) on the mwt_dev database.
-- Requires 001_genres.sql and 003_users.sql. Result of a user's level questionnaire.
CREATE TABLE IF NOT EXISTS classifications (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  assigned_level TEXT,
  score INTEGER CHECK (score >= 0),
  max_score INTEGER CHECK (max_score >= 0),
  percentage NUMERIC(5, 2) CHECK (percentage BETWEEN 0 AND 100),
  answers JSONB,
  selected_instrument TEXT,
  selected_genre_id INTEGER REFERENCES genres (id) ON DELETE SET NULL,
  recommendations JSONB,
  classified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS classifications_user_id_idx ON classifications (user_id);
