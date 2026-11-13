// Shape of a user's progress on one video, as the API returns it
export interface VideoProgress {
  id: number;
  userId: number;
  videoId: number;
  isWatched: boolean;
  watchedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Overall progress of a user over the videos (optionally of one genre)
export interface VideoProgressSummary {
  userId: number;
  totalVideos: number;
  watchedVideos: number;
  percentage: number;
}
