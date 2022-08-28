import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

import {
    LoggerModule,
    LoggerConfigService,
    ThrottlerConfigService,
} from '@app/common';
import { GqlConfigService, MongooseConfigService } from '@app/services';
import { HealthModule, SeedsModule, UsersModule } from '@app/modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from '@app/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
            expandVariables: true,
            load: config,
        }),
        LoggerModule.forRootAsync({ useClass: LoggerConfigService }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useClass: GqlConfigService,
        }),
        MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
        ThrottlerModule.forRootAsync({ useClass: ThrottlerConfigService }),
        UsersModule,
        HealthModule,
        SeedsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
