import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JwtModule, EmailModule } from '@app/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { userSchema, userSchemaName } from './schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: userSchemaName, schema: userSchema }]),
    JwtModule,
    EmailModule,
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
