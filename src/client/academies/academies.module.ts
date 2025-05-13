import { Module } from '@nestjs/common';
import { AcademiesService } from './academies.service';
import { AcademiesResolver } from './academies.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AcademiesResolver, AcademiesService, PrismaService],
})
export class AcademiesModule {}
