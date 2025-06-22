import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma.service';
import {JwtService} from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { TelegramStrategy } from './strategies/telegram.strategy';
import { UsersService } from '../users/users.service';
import { AcademiesService } from '../academies/academies.service';

@Module({
  providers: [AuthResolver, AuthService, PrismaService, JwtService, GoogleStrategy, TelegramStrategy, UsersService, AcademiesService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register PassportModule
    ConfigModule.forRoot({
      isGlobal: true,
    }), // Add ConfigModule here
  ]
})
export class AuthModule {}
