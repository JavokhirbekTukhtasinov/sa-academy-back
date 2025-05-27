import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth, LoginInput, SignUpInput, SignUpresponse,  userLoginResponse, verifyOTPInput, verifyOTPresponse } from './entities/auth.entity';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { TelegramAuthGuard } from '../guards/telegram-auth.guard';
import { TelegramLoginInput } from './entities/social-auth.entity';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignUpresponse)
  signup(@Args('createAuthInput') createAuthInput: SignUpInput ) {
    return this.authService.signup(createAuthInput);
  }

  // @Mutation(() => Auth)
  // createAuth(@Args('createAuthInput') createAuthInput: CreateAuthInput) {
  //   return this.authService.create(createAuthInput);
  // }

  @Mutation(() => verifyOTPresponse)
  verifyOTP(@Args('verifyOTPInput') verifyOTPInput: verifyOTPInput ) {
    return this.authService.verifyOTP(verifyOTPInput);
  }

  @Mutation(() => userLoginResponse)
  async login(@Args('loginInput') LoginInput: LoginInput , @Context() context) {
    const user = await this.authService.login(LoginInput);
    const {res} = context;

    res.cookie('role', LoginInput.role, {
      httpOnly: false,
      maxAge: 15 * 60 * 1000, // match access token
    });

    res.cookie('access_token', user?.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie('refresh_token', user?.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
    return user
  }


  // / New Social Login Mutations

  @Mutation(() => userLoginResponse, { name: 'loginWithGoogle' })
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogle(@Context() context): Promise<userLoginResponse> {
    // The GoogleAuthGuard and GoogleStrategy handle user authentication.
    // The validate method in GoogleStrategy returns the user object.
    // This user object is available on context.req.user.
    // AuthService.validateGoogleUser (called by strategy) returns tokens and user info.
    const req = context.req || context.request; // Handle if context.req is not directly available
    if (!req.user) {
      throw new Error('User not authenticated via Google. Ensure GoogleAuthGuard is correctly populating req.user.');
    }
    // Assuming req.user is already the { access_token, refresh_token, user } object from validateGoogleUser
    // We need to set cookies here, similar to the standard login.
    const { access_token, refresh_token, user, role = 'STUDENT' } = req.user as any; // Type assertion
    const res = context.res || (req.res);


    if (res) {
        res.cookie('role', role, { // Assuming role is part of the user object or context
        httpOnly: false, // Consider security implications, should be true if not read by client JS
        maxAge: 15 * 60 * 1000, // match access token
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        });

        res.cookie('access_token', access_token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000, // 15 mins
        });

        res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    } else {
        console.warn('Response object not found in context. Cookies cannot be set for Google login.');
    }
    
    return req.user; 
  }

  @Query(() => String, { name: 'initiateGoogleLogin' }) // Renamed for clarity from 'googleLogin'
  @UseGuards(GoogleAuthGuard)
  initiateGoogleLogin() {
    // This route is protected by GoogleAuthGuard.
    // Accessing it (e.g. via browser navigation to a corresponding REST endpoint handled by a controller, or direct GraphQL query if client handles redirect)
    // will trigger the Google OAuth flow.
    // The actual response here doesn't matter as much as the guard's redirect effect.
    return 'Redirecting to Google...';
  }


  @Mutation(() => userLoginResponse, { name: 'loginWithTelegram' })
  @UseGuards(TelegramAuthGuard) // This guard will trigger the TelegramStrategy
  async loginWithTelegram(
    @Args('telegramLoginInput') telegramLoginInput: TelegramLoginInput, // Input from client widget
    @Context() context,
  ): Promise<userLoginResponse> {
    // The TelegramAuthGuard and TelegramStrategy use the input to validate the user.
    // The result from authService.validateTelegramUser (called by strategy) will be on context.req.user.
    const req = context.req || context.request; // Handle if context.req is not directly available
    if (!req.user) {
      throw new Error('User not authenticated via Telegram. Ensure TelegramAuthGuard is correctly populating req.user.');
    }
    // Assuming req.user is already the { access_token, refresh_token, user } object from validateTelegramUser
    // We need to set cookies here, similar to the standard login.
    const { access_token, refresh_token, user, role = 'STUDENT' } = req.user as any; // Type assertion
    const res = context.res || (req.res);

    if (res) {
        res.cookie('role', role, { // Assuming role is part of the user object or context
        httpOnly: false, // Consider security implications
        maxAge: 15 * 60 * 1000, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        });

        res.cookie('access_token', access_token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
        });

        res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    } else {
        console.warn('Response object not found in context. Cookies cannot be set for Telegram login.');
    }

    return req.user;
  }

  @Query(() => [Auth], { name: 'auth' })
  findAll() {
    return this.authService.findAll();
  }

  @Query(() => Auth, { name: 'auth' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.authService.findOne(id);
  }

  @Mutation(() => Auth)
  updateAuth(@Args('updateAuthInput') updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }

  @Mutation(() => Auth)
  removeAuth(@Args('id', { type: () => Int }) id: number) {
    return this.authService.remove(id);
  }



  @Mutation(() => String)
  deleteUser(@Args('email', { type: () => String }) id: string) {
   return this.authService.deleteUser(id) 
  }


  @Mutation(() => String)
  async refreshToken(@Context() context) {
    const req = context.req || context.request;
    const refresh_token = req.cookies['refresh_token'];
    console.log('refresh token',refresh_token)
    const {res} = context
    const { access_token, new_refresh_token, user } = await this.authService.refresh(refresh_token);

    res.cookie('role', user.role, {
      httpOnly: false,
      maxAge: 15 * 60 * 1000, // match access token
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie('refresh_token', new_refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return access_token;
  }
}
