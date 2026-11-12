// Shape of a resource as the API returns it
export interface Resource {
  id: number;
  title: string;
  description: string | null;
  fileUrl: string;
  thumbnailUrl: string | null;
  fileSizeBytes: number | null;
  fileType: string | null;
  difficultyLevel: string | null;
  genreId: number | null;
  instrument: string | null;
  attachments: Record<string, unknown>[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
