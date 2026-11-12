import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from './create-teacher.dto.js';

// Same rules as CreateTeacherDto, but every field becomes optional (for PATCH)
export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {}
