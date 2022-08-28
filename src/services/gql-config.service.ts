import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createGqlOptions(): ApolloDriverConfig {
    return {
      playground: this.configService.get<boolean>('app.isDevelopment'),
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      path: this.configService.get<string>('app.path'),
      formatError(error: GraphQLError) {
        const code: string =
          HttpStatus[
            (error.extensions.code as string) || error.extensions.exception.code
          ] || HttpStatus.BAD_REQUEST;
        let message = HttpStatus[code.toString()];
        const messages: string[] = (error?.extensions?.response as any)
          ?.message;
        if (Array.isArray(messages)) {
          message = messages.length === 1 ? messages[0] : messages;
        } else if (error?.message) {
          message = error?.message;
        }
        return {
          code,
          error: error.extensions?.code,
          message: message,
        };
      },
      context: ({ req, res }) => {
        return { req, res };
      },
      cors: {
        origin: this.configService.get<string>('app.origin'),
        credentials: this.configService.get<boolean>('app.credentials'),
      },
    };
  }
}
