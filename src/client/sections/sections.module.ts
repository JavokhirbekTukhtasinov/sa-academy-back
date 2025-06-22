import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsResolver } from './sections.resolver';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { CurriclumModule } from '../curriclum/curriclum.module';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [AuthModule, CurriclumModule],
  providers: [SectionsResolver, SectionsService, PrismaService, JwtService],
  exports: [SectionsService],
})
export class SectionsModule {} 