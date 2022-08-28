import { Inject, LoggerService as Logger } from '@nestjs/common';
import { LOGGER_MODULE_NEST_PROVIDER } from './logger.constants';

export type Context =
    | {
          controller: string;
          method?: IRequestMethod;
          statusCode?: number;
          function?: string;
      }
    | string;

export type IRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export class LoggerService {
    constructor(
        @Inject(LOGGER_MODULE_NEST_PROVIDER)
        private readonly logger: Logger
    ) {}

    public log(message: any, context?: Context): Logger {
        return this.logger.log(message, context);
    }

    public error(message: any, context?: Context): Logger {
        return this.logger.error(message, context);
    }

    public warn(message: any, context?: Context): Logger {
        return this.logger.warn(message, context);
    }

    public debug?(message: any, context?: Context): Logger {
        return this.logger.debug(message, context);
    }

    public verbose?(message: any, context?: Context): Logger {
        return this.logger.verbose(message, context);
    }
}
