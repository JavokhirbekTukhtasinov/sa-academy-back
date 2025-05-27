import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma.service';
import {JwtService} from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AuthResolver, AuthService, PrismaService, JwtService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register PassportModule
    ConfigModule, // Add ConfigModule here
  ]
})
export class AuthModule {}
