import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

// Data a client sends when a user starts (or finishes) a session
export class CreateSessionAttemptDto {
  @IsInt()
  userId: number;

  // Text id of the session, for example box-breathing
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  // ISO date, for example 2026-11-24T18:30:00Z. Defaults to now
  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @IsOptional()
  @IsDateString()
  finishedAt?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  // Only for games (Echo Beats, Sound Driver, Rhythm Travels...)
  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  // Anything specific to one session (pomodoro blocks, rhythm variant...)
  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  // Answer to "¿Cómo te sientes ahora?", as a front-end key
  @IsOptional()
  @IsString()
  @MaxLength(50)
  feelingAfter?: string;

  // Answer to "¿Repetirías esta actividad?"
  @IsOptional()
  @IsBoolean()
  wouldRepeat?: boolean;
}
