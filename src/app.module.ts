import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

import { ThrottlerConfigService } from '@app/common';
import { GqlConfigService, MongooseConfigService } from '@app/services';
import { HealthModule, UsersModule } from '@app/modules';
import config from '@app/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      expandVariables: true,
      load: config,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    ThrottlerModule.forRootAsync({ useClass: ThrottlerConfigService }),
    UsersModule,
    HealthModule,
  ],
  providers: [],
})
export class AppModule {}
