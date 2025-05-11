import { Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { LecturesResolver } from './lectures.resolver';

@Module({
  providers: [LecturesResolver, LecturesService],
})
export class LecturesModule {}
