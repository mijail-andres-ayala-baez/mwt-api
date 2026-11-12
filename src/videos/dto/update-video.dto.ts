import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoDto } from './create-video.dto.js';

// Same rules as CreateVideoDto, but every field becomes optional (for PATCH)
export class UpdateVideoDto extends PartialType(CreateVideoDto) {}
