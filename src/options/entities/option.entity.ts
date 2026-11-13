// Shape of an option ("Relajarme", "Concentrarme"...) as the API returns it
export interface Option {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
