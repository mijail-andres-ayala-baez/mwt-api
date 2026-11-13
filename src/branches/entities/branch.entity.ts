// Shape of a branch ("Salud", "Corporate"...) as the API returns it
export interface Branch {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
