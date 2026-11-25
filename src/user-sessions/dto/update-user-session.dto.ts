import { PartialType } from '@nestjs/mapped-types';
import { CreateUserSessionDto } from './create-user-session.dto.js';

// Same rules as CreateUserSessionDto, but every field becomes optional (for PATCH)
export class UpdateUserSessionDto extends PartialType(CreateUserSessionDto) {}
