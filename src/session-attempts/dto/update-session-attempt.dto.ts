import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSessionAttemptDto } from './create-session-attempt.dto.js';

// Finishing a session or adding the feedback: user and session cannot change
export class UpdateSessionAttemptDto extends PartialType(
  OmitType(CreateSessionAttemptDto, ['userId', 'sessionId'] as const),
) {}
