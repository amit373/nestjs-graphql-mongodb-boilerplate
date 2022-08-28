import { LoggerOptions as ILoggerOptions } from 'winston';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Type } from '@nestjs/common';

export type LoggerModuleOptions = ILoggerOptions;

export type NestLikeConsoleFormatOptions = {
    colors?: boolean;
    prettyPrint?: boolean;
};

export interface LoggerModuleOptionsFactory {
    createLoggerModuleOptions():
        | Promise<LoggerModuleOptions>
        | LoggerModuleOptions;
}

export interface LoggerModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (
        ...args: any[]
    ) => Promise<LoggerModuleOptions> | LoggerModuleOptions;
    inject?: any[];
    useClass?: Type<LoggerModuleOptionsFactory>;
}
