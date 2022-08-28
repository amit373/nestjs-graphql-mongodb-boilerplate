import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Global()
@Module({
  exports: [EmailService],
  providers: [EmailService],
})
export class EmailModule {}
