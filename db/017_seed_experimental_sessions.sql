-- Run once on the mwt_dev database (pgAdmin Query Tool, psql or Docker).
-- Requires 012_experimental_sessions.sql.
-- The 18 sessions of the front-end (src/data/experimental-sessions/sessions.ts).
-- category is the route folder (health, corporate, focus-mode, gaming, cultural);
-- it is NULL for sessions without a page yet. Safe to run twice.
INSERT INTO experimental_sessions (id, branches, category, active) VALUES
  ('box-breathing', ARRAY['health', 'corporate', 'performance'], 'health', TRUE),
  ('cyclic-sighing', ARRAY['health', 'corporate', 'performance'], 'health', TRUE),
  ('coherent-breathing', ARRAY['health', 'corporate', 'performance'], 'health', TRUE),
  ('sleep-breathing', ARRAY['health'], 'health', TRUE),
  ('ecstatic-dance', ARRAY['health', 'social', 'corporate'], NULL, TRUE),
  ('focus-beat', ARRAY['corporate', 'social'], 'corporate', TRUE),
  ('workday-signals', ARRAY['corporate'], 'corporate', TRUE),
  ('team-anthem', ARRAY['corporate', 'education'], 'corporate', TRUE),
  ('company-radio', ARRAY['corporate'], 'corporate', TRUE),
  ('study-pomodoro', ARRAY['education', 'corporate', 'performance'], 'focus-mode', TRUE),
  ('work-pomodoro', ARRAY['corporate', 'education', 'performance'], 'focus-mode', TRUE),
  ('echo-beats', ARRAY['performance', 'education'], 'gaming', TRUE),
  ('sound-driver', ARRAY['performance'], 'gaming', TRUE),
  ('rhythm-travels', ARRAY['social', 'education'], 'cultural', TRUE),
  ('sound-matter', ARRAY['social', 'education'], 'cultural', TRUE),
  ('string-lab', ARRAY['social', 'education'], 'cultural', TRUE),
  ('music-soccer', ARRAY['performance'], NULL, TRUE),
  ('binaural-space', ARRAY['health', 'social'], NULL, TRUE)
ON CONFLICT (id) DO NOTHING;
