// Shape of a genre as the API returns it
export interface Genre {
  id: number;
  name: string;
  colorCode: string | null;
  iconUrl: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
