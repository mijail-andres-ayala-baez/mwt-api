-- Run once on the mwt_dev database (pgAdmin Query Tool, psql or Docker).
-- No dependencies. Light list of the experimental sessions that exist.
-- Titles, descriptions and texts stay in the front-end.
-- If the old experimental tables exist, run maintenance/drop_old_experimental_tables.sql first.
CREATE TABLE IF NOT EXISTS experimental_sessions (
  id TEXT PRIMARY KEY,
  branches TEXT[] NOT NULL DEFAULT '{}',
  category TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE
);
