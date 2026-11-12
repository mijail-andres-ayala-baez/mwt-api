-- Run once in pgAdmin (Query Tool) on the mwt_dev database.
-- Requires 001_genres.sql. cognito_id links the row to the AWS Cognito account.
CREATE TABLE IF NOT EXISTS users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cognito_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  surname TEXT,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'student',
  level TEXT,
  instrument TEXT,
  genre_id INTEGER REFERENCES genres (id) ON DELETE SET NULL,
  phone_code TEXT,
  phone_number TEXT,
  company TEXT,
  stage TEXT,
  questionnaire_completed BOOLEAN NOT NULL DEFAULT FALSE,
  questionnaire_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
