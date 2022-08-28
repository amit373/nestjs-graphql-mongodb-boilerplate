import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '@app/common';
import { UserInput } from './user.input';

@InputType()
export class ResetPasswordInput extends PartialType(
  PickType(UserInput, ['password', 'resetPasswordToken'] as const),
) {}

@ObjectType()
export class ResetPasswordOutput extends CoreOutput {}
