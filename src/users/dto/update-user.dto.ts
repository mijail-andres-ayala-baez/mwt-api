import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';

// Same rules as CreateUserDto, but every field becomes optional (for PATCH)
export class UpdateUserDto extends PartialType(CreateUserDto) {}
