-- Run once on the mwt_dev database (pgAdmin Query Tool, psql or Docker).
-- Requires 003_users.sql and 012_experimental_sessions.sql.
-- One row each time a user does a session. The final feedback lives in the same row
-- (feeling_after and would_repeat stay empty if the user skips the feedback).
CREATE TABLE IF NOT EXISTS session_attempts (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  session_id TEXT NOT NULL REFERENCES experimental_sessions (id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  score INTEGER CHECK (score >= 0),
  details JSONB,
  feeling_after TEXT,
  would_repeat BOOLEAN,
  CHECK (finished_at IS NULL OR finished_at >= started_at)
);

CREATE INDEX IF NOT EXISTS session_attempts_user_id_idx ON session_attempts (user_id);
CREATE INDEX IF NOT EXISTS session_attempts_session_id_idx ON session_attempts (session_id);
