import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '@app/common';
import { UserInput } from './user.input';

@InputType()
export class EditProfileInput extends PartialType(
    PickType(UserInput, ['email', 'password'] as const)
) {}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
