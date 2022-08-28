import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '@app/common';
import { UserInput } from './user.input';

@InputType()
export class ForgotPasswordInput extends PartialType(
  PickType(UserInput, ['email'] as const),
) {}

@ObjectType()
export class ForgotPasswordOutput extends CoreOutput {}
