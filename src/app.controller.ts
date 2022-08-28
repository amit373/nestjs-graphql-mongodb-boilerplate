import { Controller, Get, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService
    ) {}

    @Get()
    getHello(): string {
        this.logger.log('Calling getHello()', {
            controller: AppController.name,
            method: 'GET',
            statusCode: 200,
            function: 'getHello',
            meta: {
                test: 'sssss',
            },
        });
        return this.appService.getHello();
    }
}
