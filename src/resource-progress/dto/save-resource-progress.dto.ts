import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

// Data a client sends to save (create or update) the progress on a resource
export class SaveResourceProgressDto {
  @IsInt()
  userId: number;

  @IsInt()
  resourceId: number;

  @IsOptional()
  @IsBoolean()
  isViewed?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  viewedPercentage?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  viewedDurationSeconds?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lastPositionSeconds?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalViewTimeSeconds?: number;

  // When true, this save counts as one more time the user opened the resource
  @IsOptional()
  @IsBoolean()
  countView?: boolean;
}
