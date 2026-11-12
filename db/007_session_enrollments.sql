-- Run once in pgAdmin (Query Tool) on the mwt_dev database.
-- Requires 003_users.sql and 004_sessions.sql. A user signing up for a live session.
CREATE TABLE IF NOT EXISTS session_enrollments (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  session_id INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE,
  enrollment_number INTEGER,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unenrolled_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'enrolled',
  attendance_status TEXT,
  feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
  feedback_comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS session_enrollments_user_id_idx ON session_enrollments (user_id);
CREATE INDEX IF NOT EXISTS session_enrollments_session_id_idx ON session_enrollments (session_id);
