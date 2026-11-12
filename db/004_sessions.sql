-- Run once in pgAdmin (Query Tool) on the mwt_dev database.
-- Requires 002_teachers.sql. Live sessions given by a teacher.
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  teacher_id INTEGER NOT NULL REFERENCES teachers (id),
  max_students INTEGER NOT NULL CHECK (max_students >= 1),
  min_students INTEGER NOT NULL DEFAULT 1 CHECK (min_students >= 1),
  current_students INTEGER NOT NULL DEFAULT 0 CHECK (current_students >= 0),
  status TEXT NOT NULL DEFAULT 'scheduled',
  session_type TEXT,
  level INTEGER,
  scheduled_date TIMESTAMPTZ NOT NULL,
  meeting_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (min_students <= max_students)
);
