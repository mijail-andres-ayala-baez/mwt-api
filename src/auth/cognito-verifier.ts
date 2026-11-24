import type { ConfigService } from '@nestjs/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

// Checks that a token was signed by our Cognito user pool, is not expired and
// was issued for our app client. The region is part of the user pool id.
// "id" means we expect the ID token, because it carries the email and name we
// need to create the row in users
export function createCognitoVerifier(config: ConfigService) {
  return CognitoJwtVerifier.create({
    userPoolId: config.getOrThrow<string>('COGNITO_USER_POOL_ID'),
    tokenUse: 'id',
    clientId: config.getOrThrow<string>('COGNITO_CLIENT_ID'),
  });
}

export type CognitoVerifier = ReturnType<typeof createCognitoVerifier>;
