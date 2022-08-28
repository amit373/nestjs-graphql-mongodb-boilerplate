import { InputType, ObjectType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '@app/common';
import { UserInput } from './user.input';

@InputType()
export class VerifyEmailInput extends PickType(UserInput, [
    'resetPasswordToken',
] as const) {}

@ObjectType()
export class VerifyEmailOutput extends CoreOutput {}
