import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resource.dto.js';

// Same rules as CreateResourceDto, but every field becomes optional (for PATCH)
export class UpdateResourceDto extends PartialType(CreateResourceDto) {}
