import { registerAs } from '@nestjs/config';
import { getEnv } from '@app/shared';

export default registerAs('jwt', () => ({
  secretKey: getEnv('JWT_SECRET_KEY'),
  expiresIn: getEnv('JWT_EXPIRES_IN'),
}));
