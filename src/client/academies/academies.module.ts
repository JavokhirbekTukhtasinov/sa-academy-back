import { Module } from '@nestjs/common';
import { AcademiesService } from './academies.service';
import { AcademiesResolver } from './academies.resolver';

@Module({
  providers: [AcademiesResolver, AcademiesService],
})
export class AcademiesModule {}
