import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val: number = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed: Parse Int');
    }
    return val;
  }
}
