// Shape of a teacher as the API returns it
export interface Teacher {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
  bio: string | null;
  specialty: string | null;
  createdAt: Date;
  updatedAt: Date;
}
