-- Run once in pgAdmin (Query Tool) on the mwt_dev database.
-- Requires 003_users.sql and 004_sessions.sql. Files a user uploads for a session.
CREATE TABLE IF NOT EXISTS user_sessions (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  file_url TEXT,
  file_type TEXT,
  file_size_bytes BIGINT CHECK (file_size_bytes >= 0),
  upload_status TEXT NOT NULL DEFAULT 'pending',
  activity_type TEXT,
  original_filename TEXT,
  mime_type TEXT,
  duration_seconds INTEGER CHECK (duration_seconds >= 0),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx ON user_sessions (user_id);
CREATE INDEX IF NOT EXISTS user_sessions_session_id_idx ON user_sessions (session_id);
