import { registerAs } from '@nestjs/config';
import { getEnv } from '@app/shared';

export default registerAs('database', () => ({
    mongoUri: getEnv('MONGO_URI'),
}));
