// Shape of a video as the API returns it
export interface Video {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  durationMinutes: number | null;
  difficultyLevel: string | null;
  genreId: number | null;
  instrument: string | null;
  sortOrder: number;
  attachmentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
