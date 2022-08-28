import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckResult,
    HealthCheckService,
    DiskHealthIndicator,
    MemoryHealthIndicator,
    MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        private readonly healthCheckService: HealthCheckService,
        private readonly mongooseHealthIndicator: MongooseHealthIndicator,
        private readonly diskHealthIndicator: DiskHealthIndicator,
        private readonly memoryHealthIndicator: MemoryHealthIndicator
    ) {}

    @Get()
    @HealthCheck()
    async check(): Promise<HealthCheckResult> {
        return this.healthCheckService.check([
            () => this.mongooseHealthIndicator.pingCheck('mongoDB'),
            () =>
                this.diskHealthIndicator.checkStorage('storage', {
                    path: '/',
                    threshold: 250 * 1024 * 1024 * 1024,
                }),
            () =>
                this.memoryHealthIndicator.checkHeap(
                    'memory_heap',
                    150 * 1024 * 1024
                ),
        ]);
    }
}
