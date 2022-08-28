import { InputType, ObjectType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '@app/common';
import { UserInput } from './user.input';

@InputType()
export class CreateAccountInput extends PickType(UserInput, [
  'name',
  'email',
  'password',
] as const) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
