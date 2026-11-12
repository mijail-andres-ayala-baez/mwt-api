-- Run once in pgAdmin (Query Tool) on the mwt_dev database.
-- Requires 003_users.sql and 005_resources.sql. One row per user and resource.
CREATE TABLE IF NOT EXISTS resource_progress (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  resource_id INTEGER NOT NULL REFERENCES resources (id) ON DELETE CASCADE,
  is_viewed BOOLEAN NOT NULL DEFAULT FALSE,
  viewed_at TIMESTAMPTZ,
  view_count INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  viewed_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (viewed_percentage BETWEEN 0 AND 100),
  viewed_duration_seconds INTEGER NOT NULL DEFAULT 0 CHECK (viewed_duration_seconds >= 0),
  last_position_seconds INTEGER NOT NULL DEFAULT 0 CHECK (last_position_seconds >= 0),
  total_view_time_seconds INTEGER NOT NULL DEFAULT 0 CHECK (total_view_time_seconds >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, resource_id)
);
