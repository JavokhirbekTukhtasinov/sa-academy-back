import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [CoursesResolver, CoursesService, PrismaService],
})
export class CoursesModule {}
