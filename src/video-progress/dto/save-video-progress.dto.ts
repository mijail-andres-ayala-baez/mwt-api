import { IsBoolean, IsInt, IsOptional } from 'class-validator';

// Data a client sends to save (create or update) the progress on a video
export class SaveVideoProgressDto {
  @IsInt()
  userId: number;

  @IsInt()
  videoId: number;

  // Defaults to true: saving progress normally means "the user watched it"
  @IsOptional()
  @IsBoolean()
  isWatched?: boolean;
}
