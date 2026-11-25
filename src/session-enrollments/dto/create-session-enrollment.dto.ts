import { IsInt } from 'class-validator';

// To enroll, the client only says who and in which session
export class CreateSessionEnrollmentDto {
  @IsInt()
  userId: number;

  @IsInt()
  sessionId: number;
}
