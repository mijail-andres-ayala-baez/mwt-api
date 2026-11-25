import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// Answers of "Te ayudamos a elegir". The values are keys of the front-end
export class CreateSessionQuestionnaireDto {
  @IsInt()
  userId: number;

  // "¿Qué necesitas hoy?", for example relax
  @IsString()
  @IsNotEmpty()
  goal: string;

  // "¿De cuánto tiempo dispones?"
  @IsOptional()
  @IsIn(['quick', 'short', 'long'])
  minutes?: string;

  // Up to 3 feeling words from the emotion wheel
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @IsString({ each: true })
  words?: string[];

  // The session the flow proposed, for example box-breathing
  @IsOptional()
  @IsString()
  recommendedSessionId?: string;
}
