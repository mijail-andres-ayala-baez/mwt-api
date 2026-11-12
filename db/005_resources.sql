-- Run once in pgAdmin (Query Tool) on the mwt_dev database. Requires 001_genres.sql.
-- Learning resources (documents, sheet music...) that users can open.
CREATE TABLE IF NOT EXISTS resources (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size_bytes BIGINT CHECK (file_size_bytes >= 0),
  file_type TEXT,
  difficulty_level TEXT,
  genre_id INTEGER REFERENCES genres (id) ON DELETE SET NULL,
  instrument TEXT,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
