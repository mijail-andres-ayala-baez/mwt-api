// Shape of an enrollment as the API returns it
export interface SessionEnrollment {
  id: number;
  userId: number;
  sessionId: number;
  enrollmentNumber: number | null;
  enrolledAt: Date;
  unenrolledAt: Date | null;
  status: string;
  attendanceStatus: string | null;
  feedbackRating: number | null;
  feedbackComments: string | null;
  createdAt: Date;
  updatedAt: Date;
}
