import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from '@app/common';
import { User } from '../schema';

@ObjectType()
export class UserProfileOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
