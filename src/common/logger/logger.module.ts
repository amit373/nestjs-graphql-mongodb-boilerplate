import {
    DynamicModule,
    Global,
    LoggerService,
    Module,
    Provider,
} from '@nestjs/common';
import {
    LoggerModuleAsyncOptions,
    LoggerModuleOptions,
} from './logger.interfaces';
import {
    createWinstonLogger,
    createWinstonAsyncProviders,
    createWinstonProviders,
} from './logger.providers';

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
            providers: providers,
            exports: providers,
        } as DynamicModule;
    }

    public static createLogger(options: LoggerModuleOptions): LoggerService {
        return createWinstonLogger(options);
    }
}
