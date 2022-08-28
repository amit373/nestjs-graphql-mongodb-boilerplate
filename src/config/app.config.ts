import { registerAs } from '@nestjs/config';
import { toNumber, getEnv } from '@app/shared';
import { Environment } from '@app/constants';

export default registerAs('app', () => ({
    port: toNumber(getEnv('PORT')),
    origin: getEnv('CROSS_ORIGIN'),
    credentials: true,
    isDevelopment: Environment.DEVELOPMENT,
    isProduction: Environment.PRODUCTION,
    path: 'api',
    hashSalt: 10,
    bytesRound: 16,
    log: {
        fileName: 'logs.log',
        appName: 'Nest',
    },
}));
