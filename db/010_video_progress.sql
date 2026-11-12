-- Run once in pgAdmin (Query Tool) on the mwt_dev database.
-- Requires 003_users.sql and 006_videos.sql. One row per user and video.
CREATE TABLE IF NOT EXISTS video_progress (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  video_id INTEGER NOT NULL REFERENCES videos (id) ON DELETE CASCADE,
  is_watched BOOLEAN NOT NULL DEFAULT FALSE,
  watched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, video_id)
);
