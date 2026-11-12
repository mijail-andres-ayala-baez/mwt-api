// Shape of a live session as the API returns it
export interface Session {
  id: number;
  title: string;
  description: string | null;
  teacherId: number;
  maxStudents: number;
  minStudents: number;
  currentStudents: number;
  status: string;
  sessionType: string | null;
  level: number | null;
  scheduledDate: Date;
  meetingLink: string | null;
  createdAt: Date;
  updatedAt: Date;
}
