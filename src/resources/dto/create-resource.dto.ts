import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// Describes the data a client must send to create a resource
export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  fileSizeBytes?: number;

  @IsOptional()
  @IsString()
  fileType?: string;

  @IsOptional()
  @IsString()
  difficultyLevel?: string;

  @IsOptional()
  @IsInt()
  genreId?: number;

  @IsOptional()
  @IsString()
  instrument?: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  attachments?: Record<string, unknown>[];

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
