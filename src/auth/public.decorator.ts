import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Marks a route that can be called without a token. Every other route needs one
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
