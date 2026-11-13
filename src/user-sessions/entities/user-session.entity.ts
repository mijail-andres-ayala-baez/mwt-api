// Shape of a user upload as the API returns it
export interface UserSession {
  id: number;
  sessionId: number;
  userId: number;
  fileUrl: string | null;
  fileType: string | null;
  fileSizeBytes: number | null;
  uploadStatus: string;
  activityType: string | null;
  originalFilename: string | null;
  mimeType: string | null;
  durationSeconds: number | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
