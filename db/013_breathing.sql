CREATE TABLE IF NOT EXISTS breathing_exercises (
  session_id TEXT PRIMARY KEY REFERENCES experimental_sessions (id) ON DELETE CASCADE,
  instruction TEXT,
  visual TEXT NOT NULL CHECK (visual IN ('square', 'circle', 'wave')),
  cycles INTEGER NOT NULL DEFAULT 1 CHECK (cycles > 0)
);

CREATE TABLE IF NOT EXISTS breathing_phases (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES breathing_exercises (session_id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0),
  label TEXT NOT NULL,
  seconds NUMERIC(5,2) NOT NULL CHECK (seconds > 0),
  kind TEXT NOT NULL CHECK (kind IN ('in', 'in-more', 'hold', 'out', 'wait')),
  target_scale NUMERIC(4,2),
  UNIQUE (session_id, position)
);

CREATE TABLE IF NOT EXISTS breathing_learn_more (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES breathing_exercises (session_id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0),
  title TEXT,
  body TEXT NOT NULL,
  UNIQUE (session_id, position)
);
