import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

// Describes the data a client must send to create a live session
export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  teacherId: number;

  @IsInt()
  @Min(1)
  maxStudents: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  minStudents?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  sessionType?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  level?: number;

  // ISO 8601 date, for example 2026-12-01T18:00:00Z
  @IsDateString()
  scheduledDate: string;

  @IsOptional()
  @IsString()
  meetingLink?: string;
}
