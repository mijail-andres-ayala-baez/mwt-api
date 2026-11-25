-- Run once on the mwt_dev database (pgAdmin Query Tool, psql or Docker).
-- Requires 001_genres.sql and 003_users.sql.
-- SAMPLE DATA FOR LOCAL DEVELOPMENT ONLY. Never run it on a real database:
-- the company loads the real genres and users.
-- Safe to run twice: rows that already exist are skipped.

-- The 6 genres of Theory Lab (src/data/music-theory/genres.ts in mwt-practicas).
-- On a fresh database they get ids 1 to 6 in this order:
-- 1 funk, 2 hip-hop, 3 electronic, 4 pop, 5 rock, 6 rnb
INSERT INTO genres (name, color_code) VALUES
  ('Funk', '#6E2C7A'),
  ('Hip-Hop', '#24305E'),
  ('Música Electrónica', '#0E5E63'),
  ('Pop', '#C2366B'),
  ('Rock', '#2B2530'),
  ('Rhythm and Blues (R&B)', '#5B1F3F')
ON CONFLICT (name) DO NOTHING;

-- Test user for the web while there is no sign-in. On a fresh database it gets id 1.
INSERT INTO users (cognito_id, name, surname, email, role) VALUES
  ('local-test-user', 'Usuario', 'de Prueba', 'test@mwt.local', 'student')
ON CONFLICT (email) DO NOTHING;
