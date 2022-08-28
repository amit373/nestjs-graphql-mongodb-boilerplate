import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { WinstonLogger } from './logger.classes';
import {
    LoggerModuleAsyncOptions,
    LoggerModuleOptions,
} from './logger.interfaces';
import {
    createWinstonLogger,
    createWinstonAsyncProviders,
    createWinstonProviders,
} from './logger.providers';
import { LoggerService } from './logger.service';

@Global()
@Module({})
export class LoggerModule {
    public static forRoot(options: LoggerModuleOptions): DynamicModule {
        const providers: Provider<any>[] = createWinstonProviders(options);
        return {
            module: LoggerModule,
            providers: providers,
            exports: providers,
        };
    }

    public static forRootAsync(
        options: LoggerModuleAsyncOptions
    ): DynamicModule {
        const providers: Provider<any>[] = createWinstonAsyncProviders(options);
        return {
            module: LoggerModule,
            imports: options.imports,
            providers: [...providers, LoggerService],
            exports: [...providers, LoggerService],
        } as DynamicModule;
    }

    public static createLogger(options: LoggerModuleOptions): WinstonLogger {
        return createWinstonLogger(options);
    }
}
