import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

import { UserSeed } from './user.seeder';

@Module({
    imports: [CommandModule],
    providers: [UserSeed],
    exports: [UserSeed],
})
export class SeedsModule {}
