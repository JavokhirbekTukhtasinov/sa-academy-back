import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // Import PassportModule
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { GoogleStrategy } from './strategies/google.strategy'; // Import GoogleStrategy
import { TelegramStrategy } from './strategies/telegram.strategy'; // Import TelegramStrategy
import { JwtStrategy } from './strategies/jwt.strategy'; // Assuming you have this already
import { AuthController } from './auth.controller'; // Add this import

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register PassportModule
    ConfigModule, // Add ConfigModule here
  ],
  providers: [
    AuthResolver,
    AuthService,
    PrismaService,
    JwtService, // Keep JwtService if still used directly
    GoogleStrategy, // Add GoogleStrategy
    TelegramStrategy, // Add TelegramStrategy
    JwtStrategy, // Ensure JwtStrategy is also listed
    ConfigService, // Provide ConfigService
  ],
  controllers: [AuthController], // Add AuthController here
  exports: [AuthService], // Export AuthService
})
export class AuthModule {}
