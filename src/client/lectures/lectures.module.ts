import { Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { LecturesResolver } from './lectures.resolver';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/utils/upload.service';

@Module({
  providers: [LecturesResolver, LecturesService , JwtService, PrismaService, UploadService],
  imports: []
})
export class LecturesModule {}
