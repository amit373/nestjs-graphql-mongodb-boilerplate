import { Global, Module } from '@nestjs/common';
import { JwtService } from '.';

@Global()
@Module({
  exports: [JwtService],
  providers: [JwtService],
})
export class JwtModule {}
