import { Module } from '@nestjs/common';
import { CurriclumService } from './curriclum.service';
import { CurriclumResolver } from './curriclum.resolver';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UploadService } from 'src/utils/upload.service';
import { SignedUrlService } from 'src/utils/signed-url.service';
import { CoursesService } from '../courses/courses.service';
import { CoursesModule } from '../courses/courses.module';

@Module({
  providers: [
    CurriclumResolver, 
    CurriclumService, 
    PrismaService, 
    JwtService, 
    UploadService,
    SignedUrlService,
    CoursesService
  ],
  imports: [
    CoursesModule,
  ]
})

export class CurriclumModule {}
