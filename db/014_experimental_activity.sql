CREATE TABLE IF NOT EXISTS help_me_choose_answers (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  option_id TEXT NOT NULL REFERENCES options (id),
  time_choice TEXT NOT NULL CHECK (time_choice IN ('quick', 'short', 'long')),
  recommended_session_id TEXT REFERENCES experimental_sessions (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS help_me_choose_words (
  answer_id INTEGER NOT NULL REFERENCES help_me_choose_answers (id) ON DELETE CASCADE,
  emotion_word_id INTEGER NOT NULL REFERENCES emotion_words (id) ON DELETE CASCADE,
  PRIMARY KEY (answer_id, emotion_word_id)
);

CREATE TABLE IF NOT EXISTS session_attempts (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  session_id TEXT NOT NULL REFERENCES experimental_sessions (id) ON DELETE CASCADE,
  help_me_choose_answer_id INTEGER REFERENCES help_me_choose_answers (id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  completed BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS session_feedback (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  attempt_id INTEGER NOT NULL UNIQUE REFERENCES session_attempts (id) ON DELETE CASCADE,
  feeling_after TEXT NOT NULL CHECK (feeling_after IN ('much', 'some', 'same', 'worse')),
  would_repeat TEXT NOT NULL CHECK (would_repeat IN ('yes', 'maybe', 'no')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_attempts_user ON session_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_session_attempts_session ON session_attempts (session_id);
