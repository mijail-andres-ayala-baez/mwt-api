import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// Describes the data a client must send to create a genre
export class CreateGenreDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  colorCode?: string;

  @IsOptional()
  @IsString()
  iconUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
