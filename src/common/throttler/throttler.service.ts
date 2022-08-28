import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    ThrottlerOptionsFactory,
    ThrottlerModuleOptions,
} from '@nestjs/throttler';

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
    constructor(private readonly configService: ConfigService) {}
    createThrottlerOptions(): ThrottlerModuleOptions {
        return {
            ttl: this.configService.get<number>('THROTTLE_TTL'),
            limit: this.configService.get<number>('THROTTLE_LIMIT'),
        };
    }
}
