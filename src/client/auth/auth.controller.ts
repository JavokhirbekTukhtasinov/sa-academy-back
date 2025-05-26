import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '../guards/google-auth.guard'; // Adjust path if necessary
import { AuthService } from './auth.service'; // Adjust path if necessary
import { ConfigService } from '@nestjs/config'; // For frontend URL
import { Response } from 'express'; // Import Response from express

@Controller('auth') // Base path for auth related REST endpoints
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    // Guard initiates the Google OAuth2 authentication flow.
    // This function might not even be called if the guard redirects.
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    // GoogleStrategy's validate function (which calls authService.validateGoogleUser)
    // should have populated req.user with { access_token, refresh_token, user }
    const loginResult = req.user;

    if (!loginResult || !loginResult.access_token) {
      // Handle failed login, redirect to an error page or show an error
      const frontendErrorUrl = this.configService.get<string>('FRONTEND_URL_ERROR') || '/login-error';
      return res.redirect(frontendErrorUrl);
    }

    // Set cookies for the tokens
    // Max age: access_token for 15 mins, refresh_token for 7 days
    const fifteenMinutes = 15 * 60 * 1000;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    res.cookie('access_token', loginResult.access_token, {
      httpOnly: true, // Important for security
      secure: this.configService.get<string>('NODE_ENV') === 'production', // Send only over HTTPS in production
      sameSite: 'lax', // Or 'strict' or 'none' (if 'none', then secure must be true)
      maxAge: fifteenMinutes,
    });

    res.cookie('refresh_token', loginResult.refresh_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: sevenDays,
    });
    
    // Redirect to a frontend page (e.g., dashboard or profile)
    const frontendSuccessUrl = this.configService.get<string>('FRONTEND_URL_SUCCESS') || '/';
    res.redirect(frontendSuccessUrl);
  }

  // You might already have other REST endpoints here, e.g., for initiating password reset, etc.
  // The GraphQL mutations handle most of the auth logic in this setup.
}
