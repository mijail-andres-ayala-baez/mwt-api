// Shape of a user's progress on one resource, as the API returns it
export interface ResourceProgress {
  id: number;
  userId: number;
  resourceId: number;
  isViewed: boolean;
  viewedAt: Date | null;
  viewCount: number;
  viewedPercentage: number;
  viewedDurationSeconds: number;
  lastPositionSeconds: number;
  totalViewTimeSeconds: number;
  createdAt: Date;
  updatedAt: Date;
}

// Overall progress of a user over the resources (optionally of one genre)
export interface ResourceProgressSummary {
  userId: number;
  totalResources: number;
  viewedResources: number;
  percentage: number;
}
