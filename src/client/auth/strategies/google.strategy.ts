import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service'; // Adjust path if necessary
import { ConfigService } from '@nestjs/config'; // For environment variables

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService, // Inject ConfigService
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'), // Get from .env
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'), // Get from .env
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'), // Get from .env
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avatar: photos[0].value,
      googleId: profile.id,
      accessToken, // Optional: store access token if needed
      // refreshToken, // Optional: store refresh token if needed, be mindful of security
    };
    // The authService.validateGoogleUser method will handle finding or creating the user
    // and returning the user object that Passport.js will attach to request.user
    const validatedUser = await this.authService.validateGoogleUser(user);
    if (!validatedUser) {
      // Handle case where user validation fails if necessary
      return done(null, false);
    }
    done(null, validatedUser);
  }
}
