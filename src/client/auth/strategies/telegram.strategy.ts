import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-telegram-login'; // Main strategy
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service'; // Adjust path if necessary
import { ConfigService } from '@nestjs/config'; // For environment variables

// Define an interface for the Telegram user profile, as @types/passport-telegram-login is not available
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

@Injectable()
export class TelegramStrategy extends PassportStrategy(Strategy, 'telegram') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      botToken: configService.get<string>('TELEGRAM_BOT_TOKEN'), // Get from .env
      // callbackURL: configService.get<string>('TELEGRAM_CALLBACK_URL'), // Optional: if you have a specific callback URL
      // queryExpiration: 3600, // Optional: time in seconds for the auth_date to be valid
    });
  }

  async validate(telegramUser: TelegramUser): Promise<any> {
    // The telegramUser object is directly from the Telegram widget
    // It needs to be validated (e.g., check the hash if necessary, though the library might do this)
    // and then processed by our AuthService

    const userToValidate = {
      telegramId: String(telegramUser.id), // Ensure it's a string for consistency with Prisma schema
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      avatar: telegramUser.photo_url,
      // username: telegramUser.username, // Optional: store username if needed
    };

    // The authService.validateTelegramUser method will handle finding or creating the user
    // and returning the user object that Passport.js will attach to request.user
    const validatedUser = await this.authService.validateTelegramUser(userToValidate);
    if (!validatedUser) {
      // Handle case where user validation fails if necessary
      // done(null, false) is not used here as per passport-telegram-login's typical flow
      // It usually either returns the user or throws an error.
      return null; // Or throw an appropriate exception
    }
    return validatedUser; // This will be attached to request.user
  }
}
