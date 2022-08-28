import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserSeed {
    @Command({
        command: 'create:user',
        describe: 'create a user',
    })
    create() {
        console.log('Running...');
    }
}
