import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UploadService } from 'src/utils/upload.service';

@Module({
  providers: [CoursesResolver, CoursesService, PrismaService, JwtService, UploadService],
  imports: [],
})
export class CoursesModule {}
