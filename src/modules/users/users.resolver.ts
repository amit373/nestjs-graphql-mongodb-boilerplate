import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';

import { CoreOutput, IContext } from '@app/common';
import { Auth, CurrentUser } from '@app/shared';
import { UserRole, COOKIE_NAME } from '@app/constants';
import { UsersService } from './users.service';
import { User } from './schema';
import {
    CreateAccountInput,
    CreateAccountOutput,
    ForgotPasswordInput,
    ForgotPasswordOutput,
    LoginInput,
    LoginOutput,
    ResetPasswordInput,
    ResetPasswordOutput,
} from './dto';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(() => User)
    @Auth(UserRole.user, UserRole.admin)
    me(@CurrentUser() user: User): User {
        return user;
    }

    @Mutation(() => CreateAccountOutput)
    async createAccount(
        @Args('input') createAccountInput: CreateAccountInput
    ): Promise<CreateAccountOutput> {
        return this.usersService.createAccount(createAccountInput);
    }

    @Mutation(() => LoginOutput)
    async login(
        @Context() context: IContext,
        @Args('input') loginInput: LoginInput
    ): Promise<LoginOutput> {
        return this.usersService.login(loginInput, context);
    }

    @Mutation(() => ForgotPasswordOutput)
    async forgotPassword(
        @Args('input') forgotPasswordInput: ForgotPasswordInput
    ): Promise<ForgotPasswordOutput> {
        return this.usersService.forgotPassword(forgotPasswordInput);
    }

    @Mutation(() => ResetPasswordOutput)
    async resetPassword(
        @Args('input') resetPasswordInput: ResetPasswordInput
    ): Promise<ResetPasswordOutput> {
        return this.usersService.resetPassword(resetPasswordInput);
    }

    @Mutation(() => CoreOutput)
    logout(@Context() context: IContext): CoreOutput {
        context.res.cookie(COOKIE_NAME, 'loggedOut', {
            maxAge: new Date(Date.now() + 10 * 1000).getTime(),
            httpOnly: true,
        });
        return this.usersService.logout();
    }
}
