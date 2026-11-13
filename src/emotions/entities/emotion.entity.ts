// A word of the emotion wheel ("Tranquilo", "Asombrado"...)
export interface EmotionWord {
  id: number;
  word: string;
}

// Shape of an emotion with its words, as the API returns it
export interface Emotion {
  id: string;
  name: string;
  strongColor: string | null;
  softColor: string | null;
  words: EmotionWord[];
}
