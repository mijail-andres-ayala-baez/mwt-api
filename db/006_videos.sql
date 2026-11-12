-- Run once in pgAdmin (Query Tool) on the mwt_dev database. Requires 001_genres.sql.
CREATE TABLE IF NOT EXISTS videos (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_minutes INTEGER CHECK (duration_minutes >= 0),
  difficulty_level TEXT,
  genre_id INTEGER REFERENCES genres (id) ON DELETE SET NULL,
  instrument TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  attachments_count INTEGER NOT NULL DEFAULT 0 CHECK (attachments_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
