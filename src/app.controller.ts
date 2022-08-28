import { Controller, Get } from '@nestjs/common';
import { LoggerService } from '@app/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly loggerService: LoggerService
    ) {}

    @Get()
    getHello(): string {
        this.loggerService.log('getHello', {
            controller: AppController.name,
            method: 'GET',
            statusCode: 200,
            function: 'getHello',
        });
        return this.appService.getHello();
    }
}
