import { Logger, LoggerOptions, createLogger } from 'winston';
import { Provider, Type } from '@nestjs/common';
import {
    LOGGER_MODULE_NEST_PROVIDER,
    LOGGER_MODULE_OPTIONS,
    LOGGER_MODULE_PROVIDER,
} from './logger.constants';
import {
    LoggerModuleAsyncOptions,
    LoggerModuleOptions,
    LoggerModuleOptionsFactory,
} from './logger.interfaces';
import { WinstonLogger } from './logger.classes';
import { LoggerService } from './logger.service';

export function createWinstonLogger(
    loggerOpts: LoggerModuleOptions
): WinstonLogger {
    return new WinstonLogger(createLogger(loggerOpts));
}

export function createWinstonProviders(
    loggerOpts: LoggerModuleOptions
): Provider[] {
    return [
        {
            provide: LOGGER_MODULE_PROVIDER,
            useFactory: () => createLogger(loggerOpts),
        },
        {
            provide: LOGGER_MODULE_NEST_PROVIDER,
            useFactory: (logger: Logger) => {
                return new WinstonLogger(logger);
            },
            inject: [LOGGER_MODULE_PROVIDER],
        },
    ];
}

export function createWinstonAsyncProviders(
    options: LoggerModuleAsyncOptions
): Provider[] {
    const providers: Provider[] = [
        {
            provide: LOGGER_MODULE_PROVIDER,
            useFactory: (loggerOpts: LoggerOptions) => createLogger(loggerOpts),
            inject: [LOGGER_MODULE_OPTIONS],
        },
        {
            provide: LOGGER_MODULE_NEST_PROVIDER,
            useFactory: (logger: Logger) => {
                return new WinstonLogger(logger);
            },
            inject: [LOGGER_MODULE_PROVIDER],
        },
    ];

    if (options.useClass) {
        const useClass: Type<LoggerModuleOptionsFactory> = options.useClass;
        providers.push(
            ...[
                {
                    provide: LOGGER_MODULE_OPTIONS,
                    useFactory: async (
                        optionsFactory: LoggerModuleOptionsFactory
                    ) => optionsFactory.createLoggerModuleOptions(),
                    inject: [useClass],
                },
                {
                    provide: useClass,
                    useClass,
                },
            ]
        );
    }

    if (options.useFactory) {
        providers.push({
            provide: LOGGER_MODULE_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject || [],
        });
    }

    return providers;
}
