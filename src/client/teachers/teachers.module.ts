import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersResolver } from './teachers.resolver';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/utils/upload.service';

@Module({
  providers: [TeachersResolver, TeachersService, PrismaService, UploadService],
})
export class TeachersModule {}
