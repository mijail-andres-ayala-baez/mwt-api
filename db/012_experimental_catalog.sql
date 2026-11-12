CREATE TABLE IF NOT EXISTS experimental_sessions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('live', 'on-demand')),
  duration_range TEXT NOT NULL CHECK (duration_range IN ('up-to-5', '5-10', '10-30', 'over-30')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS options (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_options (
  session_id TEXT NOT NULL REFERENCES experimental_sessions (id) ON DELETE CASCADE,
  option_id TEXT NOT NULL REFERENCES options (id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
  PRIMARY KEY (session_id, option_id)
);

CREATE TABLE IF NOT EXISTS branches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_branches (
  session_id TEXT NOT NULL REFERENCES experimental_sessions (id) ON DELETE CASCADE,
  branch_id TEXT NOT NULL REFERENCES branches (id) ON DELETE CASCADE,
  PRIMARY KEY (session_id, branch_id)
);

CREATE TABLE IF NOT EXISTS emotions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  strong_color TEXT,
  soft_color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emotion_words (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  emotion_id TEXT NOT NULL REFERENCES emotions (id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  UNIQUE (emotion_id, word)
);

CREATE TABLE IF NOT EXISTS session_emotions (
  session_id TEXT NOT NULL REFERENCES experimental_sessions (id) ON DELETE CASCADE,
  emotion_id TEXT NOT NULL REFERENCES emotions (id) ON DELETE CASCADE,
  weight INTEGER NOT NULL DEFAULT 1 CHECK (weight > 0),
  PRIMARY KEY (session_id, emotion_id)
);
