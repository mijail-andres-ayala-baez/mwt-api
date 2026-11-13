import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

// What can be changed after enrolling: attendance and the user's feedback
export class UpdateSessionEnrollmentDto {
  @IsOptional()
  @IsString()
  attendanceStatus?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  feedbackRating?: number;

  @IsOptional()
  @IsString()
  feedbackComments?: string;
}
