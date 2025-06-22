import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UploadService } from 'src/utils/upload.service';
import { SignedUrlService } from 'src/utils/signed-url.service';

@Module({
  providers: [CoursesResolver, CoursesService, PrismaService, JwtService, UploadService, SignedUrlService],
  imports: [],
})
export class CoursesModule {}
