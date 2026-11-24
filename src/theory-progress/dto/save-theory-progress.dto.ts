import { IsInt, Matches } from 'class-validator';

// The step the user has just reached in a genre
export class SaveTheoryProgressDto {
  @IsInt()
  userId: number;

  @IsInt()
  genreId: number;

  // Numbers separated by dots, for example 1.1.1
  @Matches(/^\d+(\.\d+)*$/, {
    message: 'progress must look like 1.1.1',
  })
  progress: string;
}
