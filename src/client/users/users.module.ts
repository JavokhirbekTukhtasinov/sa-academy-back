import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from 'src/prisma.service';
import { CoursesModule } from '../courses/courses.module';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { CoursesService } from '../courses/courses.service';
import { UploadService } from 'src/utils/upload.service';
import { SignedUrlService } from 'src/utils/signed-url.service';
@Module({
  imports: [CoursesModule, AuthModule],
  providers: [UsersResolver, UsersService, PrismaService, JwtService, CoursesService, UploadService, SignedUrlService],
})
export class UsersModule {}
