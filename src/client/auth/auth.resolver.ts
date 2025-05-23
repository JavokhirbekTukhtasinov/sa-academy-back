import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth, LoginInput, SignUpInput, SignUpresponse,  userLoginResponse, verifyOTPInput, verifyOTPresponse } from './entities/auth.entity';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { Res } from '@nestjs/common';
import { Response } from 'express';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignUpresponse)
  signup(@Args('createAuthInput') createAuthInput: SignUpInput ) {
    return this.authService.signup(createAuthInput);
  }

  @Mutation(() => Auth)
  createAuth(@Args('createAuthInput') createAuthInput: CreateAuthInput) {
    return this.authService.create(createAuthInput);
  }

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
  async refreshToken(@Context() context) {
    const refresh_token = context.req.cookies['refresh_token'];
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
