-- Run once on the mwt_dev database (pgAdmin Query Tool, psql or Docker).
-- Requires 003_users.sql and 012_experimental_sessions.sql.
-- Answers of "Te ayudamos a elegir". Options and words are keys defined in the front-end.
CREATE TABLE IF NOT EXISTS session_questionnaire (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  goal TEXT NOT NULL,
  minutes TEXT CHECK (minutes IN ('quick', 'short', 'long')),
  words TEXT[] NOT NULL DEFAULT '{}' CHECK (cardinality(words) <= 3),
  recommended_session_id TEXT REFERENCES experimental_sessions (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS session_questionnaire_user_id_idx ON session_questionnaire (user_id);
