-- DANGER: deletes the first version of the Experimental Sessions tables and ALL their data.
-- Run it only on a database that already has them (our beta RDS), and only ONCE,
-- BEFORE 012_experimental_sessions.sql. A fresh Docker database does not need it.
-- Docker never runs this file: it ignores subfolders of db/.
DROP TABLE IF EXISTS session_feedback CASCADE;
DROP TABLE IF EXISTS session_attempts CASCADE;
DROP TABLE IF EXISTS help_me_choose_words CASCADE;
DROP TABLE IF EXISTS help_me_choose_answers CASCADE;
DROP TABLE IF EXISTS breathing_learn_more CASCADE;
DROP TABLE IF EXISTS breathing_phases CASCADE;
DROP TABLE IF EXISTS breathing_exercises CASCADE;
DROP TABLE IF EXISTS session_emotions CASCADE;
DROP TABLE IF EXISTS session_branches CASCADE;
DROP TABLE IF EXISTS session_options CASCADE;
DROP TABLE IF EXISTS emotion_words CASCADE;
DROP TABLE IF EXISTS emotions CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS experimental_sessions CASCADE;
