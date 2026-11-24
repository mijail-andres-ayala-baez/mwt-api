import type { Request } from 'express';
import type { User } from '../users/entities/user.entity.js';

// The request after the guard has identified who is calling
export interface AuthenticatedRequest extends Request {
  user?: User;
}
