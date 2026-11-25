// One time a user did an experimental session, with the final feedback
export interface SessionAttempt {
  id: number;
  userId: number;
  sessionId: string;
  startedAt: Date;
  finishedAt: Date | null;
  completed: boolean;
  score: number | null;
  details: Record<string, unknown> | null;
  feelingAfter: string | null;
  wouldRepeat: boolean | null;
}
