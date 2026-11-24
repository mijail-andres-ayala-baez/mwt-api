// How far one user has unlocked in one genre of Theory Lab
export interface TheoryProgress {
  userId: number;
  genreId: number;
  progress: string;
  updatedAt: Date;
}
