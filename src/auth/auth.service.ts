import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { createCognitoVerifier } from './cognito-verifier.js';
import type { CognitoVerifier } from './cognito-verifier.js';

// Reads one text claim (a piece of data) from the token payload
function readClaim(payload: object, name: string): string | undefined {
  const value = (payload as Record<string, unknown>)[name];

  return typeof value === 'string' ? value : undefined;
}

@Injectable()
export class AuthService {
  private readonly verifier: CognitoVerifier;

  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    // getOrThrow stops the app at startup if a Cognito variable is missing
    this.verifier = createCognitoVerifier(config);
  }

  // Turns a token into the user who owns it
  async authenticate(token: string): Promise<User> {
    let payload: object;

    try {
      payload = await this.verifier.verify(token);
    } catch {
      // Bad signature, expired, wrong pool or wrong app client
      throw new UnauthorizedException('Invalid or expired token');
    }

    // "sub" is the permanent id of the account in Cognito
    const cognitoId = readClaim(payload, 'sub');
    const email = readClaim(payload, 'email');

    if (!cognitoId || !email) {
      throw new UnauthorizedException('The token has no user id or email');
    }

    // The name is required in users, so the email is the fallback
    const name = readClaim(payload, 'name') ?? email;

    return this.usersService.findOrCreateByCognito({ cognitoId, name, email });
  }
}
