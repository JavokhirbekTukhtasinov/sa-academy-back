import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma.service';
import {JwtService} from '@nestjs/jwt'

@Module({
  providers: [AuthResolver, AuthService, PrismaService, JwtService],
  imports: []
})
export class AuthModule {}
