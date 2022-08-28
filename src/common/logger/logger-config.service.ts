import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

import { utilities as loggerUtilities } from './logger.utilities';
import { LoggerModuleOptionsFactory } from './logger.interfaces';

@Injectable()
export class LoggerConfigService implements LoggerModuleOptionsFactory {
    constructor(private readonly configService: ConfigService) {}
    createLoggerModuleOptions():
        | winston.LoggerOptions
        | Promise<winston.LoggerOptions> {
        return {
            transports: [
                new winston.transports.File({
                    filename: `${process.cwd()}/${this.configService.get<string>(
                        'app.log.fileName'
                    )}`,
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.printf((info) =>
                            loggerUtilities.format.getFormattedLogs(
                                this.configService.get<string>(
                                    'app.log.appName'
                                ),
                                info
                            )
                        )
                    ),
                }),
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.ms(),
                        loggerUtilities.format.nestLike(
                            this.configService.get<string>('app.log.appName'),
                            {
                                colors: true,
                                prettyPrint: true,
                            }
                        )
                    ),
                }),
            ],
        };
    }
}
