// Shape of a user as the API returns it
export interface User {
  id: number;
  cognitoId: string;
  name: string;
  surname: string | null;
  email: string;
  role: string;
  level: string | null;
  instrument: string | null;
  genreId: number | null;
  phoneCode: string | null;
  phoneNumber: string | null;
  company: string | null;
  stage: string | null;
  questionnaireCompleted: boolean;
  questionnaireCompletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
