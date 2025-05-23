import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersResolver } from './banners.resolver';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/utils/upload.service';


@Module({
  providers: [BannersResolver, BannersService, JwtService, PrismaService, UploadService],
  imports: [],
  exports: [BannersService]
})
export class BannersModule {}
