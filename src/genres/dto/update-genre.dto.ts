import { PartialType } from '@nestjs/mapped-types';
import { CreateGenreDto } from './create-genre.dto.js';

// Same rules as CreateGenreDto, but every field becomes optional (for PATCH)
export class UpdateGenreDto extends PartialType(CreateGenreDto) {}
