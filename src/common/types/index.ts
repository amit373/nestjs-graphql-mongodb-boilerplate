import { GraphQLExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';

export interface IContext extends GraphQLExecutionContext {
  req: Request;
  res: Response;
}
