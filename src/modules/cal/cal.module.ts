import { Module } from '@nestjs/common';
import { CalController } from './cal.controller';
import { CalService } from './cal.service';

@Module({
  controllers: [CalController],
  providers: [CalService]
})
export class CalModule {
}
