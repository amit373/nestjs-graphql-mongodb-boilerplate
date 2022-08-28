import { NestFactory } from '@nestjs/core';
import {
    INestApplication,
    ValidationPipe,
    VersioningType,
    RequestMethod,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
    const app: INestApplication = await NestFactory.create(AppModule);
    const configService = app.get<ConfigService>(ConfigService);

    // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    app.setGlobalPrefix('v1', {
        exclude: [{ path: 'health', method: RequestMethod.GET }],
    });
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
        credentials: configService.get<boolean>('app.credentials'),
        origin: configService.get<string>('app.origin'),
    });
    app.enableVersioning({ type: VersioningType.URI });
    app.use(cookieParser());
    app.use(compression());
    await app.listen(configService.get<number>('app.port'));
}

bootstrap();
