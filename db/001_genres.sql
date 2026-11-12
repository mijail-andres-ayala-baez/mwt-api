-- Run once in pgAdmin (Query Tool) on the mwt_dev database.
-- Genres are referenced by users, resources, videos and classifications.
CREATE TABLE IF NOT EXISTS genres (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color_code TEXT,
  icon_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
