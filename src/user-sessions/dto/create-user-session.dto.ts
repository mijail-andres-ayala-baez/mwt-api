import { IsInt, IsOptional, IsString, Min } from 'class-validator';

// Describes the data a client must send to register a user's upload
export class CreateUserSessionDto {
  @IsInt()
  sessionId: number;

  @IsInt()
  userId: number;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  fileType?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  fileSizeBytes?: number;

  @IsOptional()
  @IsString()
  uploadStatus?: string;

  @IsOptional()
  @IsString()
  activityType?: string;

  @IsOptional()
  @IsString()
  originalFilename?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
