-- Run once in pgAdmin (Query Tool) on the mwt_dev database. Requires 012_experimental_catalog.sql.
-- Initial data read from the web: the 6 options, 7 emotions with their 35 words
-- and the branches seen on the session cards. Safe to run again.
INSERT INTO options (id, name, description) VALUES
  ('relax', 'Relajarme', 'Bajar el ritmo y soltar tensión'),
  ('focus', 'Concentrarme', 'Poner la mente en una sola cosa'),
  ('recharge', 'Recargar energía', 'Actívate y despiértate'),
  ('have-fun', 'Divertirme', 'Pasarlo bien con la música'),
  ('learn-create', 'Aprender y crear', 'Descubrir y crear algo nuevo'),
  ('share', 'Compartir', 'Conectar con otras personas')
ON CONFLICT (id) DO NOTHING;

INSERT INTO branches (id, name) VALUES
  ('health', 'Salud'),
  ('corporate', 'Corporate'),
  ('performance', 'Performance')
ON CONFLICT (id) DO NOTHING;

INSERT INTO emotions (id, name) VALUES
  ('happiness', 'Felicidad'),
  ('love', 'Amor'),
  ('surprise', 'Sorpresa'),
  ('fear', 'Miedo'),
  ('anger', 'Enojo'),
  ('disgust', 'Repugnancia'),
  ('sadness', 'Tristeza')
ON CONFLICT (id) DO NOTHING;

INSERT INTO emotion_words (emotion_id, word) VALUES
  ('happiness', 'Juguetón'),
  ('happiness', 'Entusiasmado'),
  ('happiness', 'Tranquilo'),
  ('happiness', 'Agradecido'),
  ('happiness', 'Seguro de mí mismo'),
  ('love', 'Aceptado'),
  ('love', 'Gentil'),
  ('love', 'Afectuoso'),
  ('love', 'Apasionado'),
  ('love', 'Confiado'),
  ('surprise', 'Impactado'),
  ('surprise', 'Asombrado'),
  ('surprise', 'Confundido'),
  ('surprise', 'Abrumado'),
  ('surprise', 'Sobresaltado'),
  ('fear', 'Preocupado'),
  ('fear', 'Inseguro'),
  ('fear', 'Rechazado'),
  ('fear', 'Vulnerable'),
  ('fear', 'Avergonzado'),
  ('anger', 'Irritado'),
  ('anger', 'Frustrado'),
  ('anger', 'Ofendido'),
  ('anger', 'Furioso'),
  ('anger', 'Amenazado'),
  ('disgust', 'Reacio'),
  ('disgust', 'Decepcionado'),
  ('disgust', 'Amargado'),
  ('disgust', 'Incómodo'),
  ('disgust', 'Resentido'),
  ('sadness', 'Inadecuado'),
  ('sadness', 'Indiferente'),
  ('sadness', 'Solitario'),
  ('sadness', 'Culpable'),
  ('sadness', 'Lastimado')
ON CONFLICT (emotion_id, word) DO NOTHING;
