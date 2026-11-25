// Shape of an experimental session as the API returns it.
// Titles and texts live in the front-end, looked up by id.
export interface ExperimentalSession {
  id: string;
  branches: string[];
  category: string | null;
  active: boolean;
}
