// Latest result of one user on one activity or question of Theory Lab
export interface TheoryResult {
  userId: number;
  genreId: number;
  itemId: string;
  kind: 'activity' | 'question';
  completed: boolean;
  correct: boolean | null;
  answer: unknown;
  score: number | null;
  updatedAt: Date;
}
