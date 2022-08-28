import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '@app/common';
import { UserInput } from './user.input';

@InputType()
export class LoginInput extends PickType(UserInput, [
    'email',
    'password',
] as const) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
    @Field(() => String, { nullable: true })
    token?: string;
}
