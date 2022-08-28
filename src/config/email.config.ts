import { registerAs } from '@nestjs/config';
import { getEnv, toInteger } from '@app/shared';

export default registerAs('email', () => ({
  service: getEnv('SMTP_SERVICE'),
  host: getEnv('SMTP_HOST'),
  port: toInteger(getEnv('SMTP_PORT')),
  email: getEnv('SMTP_EMAIL'),
  password: getEnv('SMTP_PASSWORD'),
  fromName: getEnv('FROM_NAME'),
  fromEmail: getEnv('FROM_EMAIL'),
}));
