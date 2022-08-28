import { IUser } from '@app/modules';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
    (data: string, ctx: ExecutionContext): ParameterDecorator => {
        const request = GqlExecutionContext.create(ctx).getContext();
        const user = request?.user as IUser;
        return data ? user?.[data] : user;
    }
);
