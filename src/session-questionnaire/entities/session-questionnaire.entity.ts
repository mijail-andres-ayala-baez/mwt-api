// The answers a user gave in "Te ayudamos a elegir"
export interface SessionQuestionnaire {
  id: number;
  userId: number;
  goal: string;
  minutes: string | null;
  words: string[];
  recommendedSessionId: string | null;
  createdAt: Date;
}
