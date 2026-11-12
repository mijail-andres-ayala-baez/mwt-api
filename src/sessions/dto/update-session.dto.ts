import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionDto } from './create-session.dto.js';

// Same rules as CreateSessionDto, but every field becomes optional (for PATCH)
export class UpdateSessionDto extends PartialType(CreateSessionDto) {}
