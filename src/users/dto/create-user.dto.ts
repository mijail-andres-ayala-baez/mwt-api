import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

// Describes the data a client must send to create a user
export class CreateUserDto {
  // Id of the account in AWS Cognito
  @IsString()
  @IsNotEmpty()
  cognitoId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  instrument?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  genreId?: number;

  @IsOptional()
  @IsString()
  phoneCode?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  stage?: string;

  @IsOptional()
  @IsBoolean()
  questionnaireCompleted?: boolean;

  @IsOptional()
  @IsDateString()
  questionnaireCompletedAt?: string;
}
