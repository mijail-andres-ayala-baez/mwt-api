import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// Creates or replaces the result of one user on one activity or question
export class SaveTheoryResultDto {
  @IsInt()
  userId: number;

  @IsInt()
  genreId: number;

  // Key of the activity or question in the front-end
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsIn(['activity', 'question'])
  kind: 'activity' | 'question';

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsBoolean()
  correct?: boolean;

  // What the user answered: any JSON value (text, list, object...)
  @IsOptional()
  answer?: unknown;

  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;
}
