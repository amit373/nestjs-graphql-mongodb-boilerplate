import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class UserInput {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @Field(() => String)
  @IsString()
  resetPasswordToken: string;
}
