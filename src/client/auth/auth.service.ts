import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { PrismaService } from 'src/prisma.service';
import {
  ResetPasswordInput,
  SignUpInput,
  LoginInput,
  userLoginResponse,
  verifyOTPInput,
} from './entities/auth.entity';
import {
  comparePasswordHash,
  generateOTP,
  generatePasswordHash,
} from 'src/utils/hash';
import { JwtService } from '@nestjs/jwt';
import { AcademyStatus } from '../academies/entities/academy.entity';
import { UsersService } from '../users/users.service';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
  );

  constructor(
    private readonly configService:   ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signup(createAuthInput: SignUpInput) {
    try {
      const existingUser = await this.prisma.sa_users.findFirst({
        where: {
          email: createAuthInput.email,
          is_verified: true,
        },
      });
      if (existingUser) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const otp = await generateOTP();
      const password = await generatePasswordHash(createAuthInput.password);
      const otp_expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await this.prisma.sa_users.upsert({
        where: {
          email: createAuthInput.email,
        },
        create: {
          full_name: createAuthInput.full_name,
          email: createAuthInput.email,
          otp: otp,
          otp_expires_at,
          password: password,
        },
        update: {
          otp: otp,
          otp_expires_at: otp_expires_at,
        },
      });
      return {
        message: 'success',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async verifyOTP(verifyOTPInput: verifyOTPInput) {
    try {
      // Handle development OTP bypass
      if (verifyOTPInput.otp === 123456) {
        return await this.verifyUserOTP(verifyOTPInput.email);
      }

      // Find user by email
      const user = await this.findUserByEmail(verifyOTPInput.email);
      
      // Validate user and OTP
      this.validateUserAndOTP(user, verifyOTPInput.otp);
      
      // Verify user OTP
      return await this.verifyUserOTP(verifyOTPInput.email);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private async findUserByEmail(email: string) {
    const user = await this.prisma.sa_users.findFirst({
      where: { email },
    });
    
    if (!user) {
      throw new BadRequestException('Invalid OTP');
    }
    
    return user;
  }

  private validateUserAndOTP(user: any, otp: number) {
    if (user.is_verified) {
      throw new BadRequestException('User already verified');
    }

    if (user.otp_expires_at < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    if (user.otp !== String(otp)) {
      throw new BadRequestException('Invalid OTP');
    }
  }

  private async verifyUserOTP(email: string) {
    await this.prisma.sa_users.update({
      where: { email },
      data: {
        otp: null,
        is_verified: true,
        otp_expires_at: null,
      },
    });

    return { message: 'success' };
  }

  async login(loginInput: LoginInput): Promise<userLoginResponse | any> {
    try {
      if (loginInput.role === 'ADMIN') {
        return await this.adminLogin(loginInput);
      } else {
        return await this.userLogin(loginInput);
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async userLogin(userLoginInput: LoginInput) {
    try {
      const user = await this.prisma.sa_users.findFirst({
        where: {
          email: userLoginInput.email,
        },
        include: {
          sa_teachers: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }

      if (!user.is_verified) {
        throw new BadRequestException('User not verified');
      }

      if (
        !(await comparePasswordHash(userLoginInput.password, user.password))
      ) {
        throw new BadRequestException('Invalid credentials');
      }

      const payload = {
        id: Number(user.id),
        email: user.email,
      };

      const access_token = await this.generateAccessToken(payload);
      const refresh_token = await this.generateRefreshToken(payload);
      delete user.password;
      return {
        access_token,
        refresh_token,
        // role: 'STUDENT',
        user: {
          ...user,
          __typename: 'STUDENT',
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async teacherLogin(userLoginInput: LoginInput) {
    try {
      const user = await this.prisma.sa_teachers.findFirst({
        where: {
          email: userLoginInput.email,
        },
      });
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }

      // if(!user.is_verified) {
      //   throw new BadRequestException('User not verified');
      // }

      // if(!await comparePasswordHash(userLoginInput.password, user.password)) {
      //   throw new BadRequestException('Invalid credentials');
      // }

      const payload = {
        id: Number(user.id),
        email: user.email,
        role: 'TEACHER',
      };

      const access_token = await this.generateAccessToken(payload);
      const refresh_token = await this.generateRefreshToken(payload);
      // delete user.password

      return {
        access_token,
        refresh_token,
        user: {
          ...user,
          __typename: 'Teacher',
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async academyLogin(userLoginInput: LoginInput) {
    try {
      const user = await this.prisma.sa_academies.findFirst({
        where: {
          email: userLoginInput.email,
        },
      });

      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }

      if (user.status !== AcademyStatus.CONFIRMED) {
        throw new BadRequestException('academy not verified');
      }

      if (
        !(await comparePasswordHash(userLoginInput.password, user.password))
      ) {
        throw new BadRequestException('Invalid credentials');
      }

      const payload = {
        id: Number(user.id),
        email: user.email,
        role: 'ACADEMY',
      };

      const access_token = await this.generateAccessToken(payload);
      const refresh_token = await this.generateRefreshToken(payload);
      return {
        access_token,
        refresh_token,
        user: {
          ...user,
          __typename: 'ACADEMY',
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async adminLogin(userLoginInput: LoginInput) {
    try {
      const user = await this.prisma.sa_admins.findFirst({
        where: {
          email: userLoginInput.email,
        },
      });

      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }

      if (
        !(await comparePasswordHash(userLoginInput.password, user.password))
      ) {
        throw new BadRequestException('Invalid credentials');
      }

      const payload = {
        id: Number(user.id),
        email: user.email,
        role: 'ADMIN',
      };

      const access_token = await this.generateAccessToken(payload);
      const refresh_token = await this.generateRefreshToken(payload);
      delete user.password;
      return {
        access_token,
        refresh_token,
        user: {
          ...user,
          __typename: 'ADMIN',
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async refresh(
    token: string,
  ): Promise<{ access_token: string; new_refresh_token: string; user: any }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log('payload', payload);
      let user: any = {};

      if (payload.role === 'ADMIN') {
        user = await this.prisma.sa_admins.findUnique({
          where: { id: payload.id },
        });
        if (!user) throw new UnauthorizedException();
      } else if (payload.role === 'ACADEMY') {
        user = await this.prisma.sa_academies.findUnique({
          where: { id: payload.id },
        });
        if (!user) throw new UnauthorizedException();
      } else if (payload.role === 'TEACHER') {
        user = await this.prisma.sa_teachers.findUnique({
          where: { id: payload.id },
        });
        if (!user) throw new UnauthorizedException();
      } else if (payload.role === 'STUDENT') {
        user = await this.prisma.sa_users.findUnique({
          where: { id: payload.id },
        });
        if (!user) throw new UnauthorizedException();
      }
      const newPayload = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };
      // const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
      // const new_refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
      const access_token = await this.generateAccessToken(newPayload);
      const new_refresh_token = await this.generateRefreshToken(newPayload);

      return { access_token, new_refresh_token, user };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // Inside AuthService class in src/client/auth/auth.service.ts

  async validateGoogleUser(profile: {
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    googleId: string;
  }): Promise<any> {
    try {
      let user = await this.prisma.sa_users.findUnique({
        where: { email: profile.email },
      });

      if (user) {
        // User exists, update with Google ID and avatar if necessary
        if (!user.google_id || !user.avatar) {
          user = await this.prisma.sa_users.update({
            where: { id: user.id },
            data: {
              google_id: user.google_id ?? profile.googleId,
              avatar: user.avatar ?? profile.avatar,
              // Ensure is_verified is true if they login with Google
              is_verified: true,
            },
          });
        }
      } else {
        // User does not exist, create a new one
        // Note: Password is set to null or a placeholder for social logins
        // You might want to prompt the user to set a password later if they wish to use traditional login
        user = await this.prisma.sa_users.create({
          data: {
            email: profile.email,
            first_name: profile.firstName,
            last_name: profile.lastName,
            full_name:
              `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
            avatar: profile.avatar,
            google_id: profile.googleId,
            is_verified: true, // Automatically verify users signing up via Google
            // password: null, // Or some unguessable random string if your schema requires it
          },
        });
      }

      // Generate JWT tokens
      const payload = {
        id: Number(user.id),
        email: user.email,
        role: 'STUDENT', // Assuming social logins are for STUDENT role
      };
      const access_token = await this.generateAccessToken(payload);
      const refresh_token = await this.generateRefreshToken(payload);

      // Return what your login resolver expects, typically tokens and user info
      return {
        access_token,
        refresh_token,
        user: {
          ...user,
          __typename: 'STUDENT', // Or your relevant GraphQL user type for students
        },
      };
    } catch (error) {
      // Consider more specific error handling or logging
      throw new BadRequestException(
        error.message || 'Google authentication failed',
      );
    }
  }

  async validateTelegramUser(profile: {
    telegramId: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    // email?: string; // Telegram might not provide email, handle accordingly
  }): Promise<any> {
    try {
      // Telegram ID is the primary identifier here
      let user = await this.prisma.sa_users.findFirst({
        // Use findFirst for non-unique fields if telegramId isn't @unique yet
        where: { telegram_id: profile.telegramId },
      });

      if (user) {
        // User exists, update avatar if necessary
        if (!user.avatar && profile.avatar) {
          user = await this.prisma.sa_users.update({
            where: { id: user.id },
            data: {
              avatar: profile.avatar,
              is_verified: true, // Ensure is_verified is true
            },
          });
        }
      } else {
        // User does not exist, create a new one.
        // Email might be missing from Telegram. You'll need a strategy for this:
        // 1. Prompt user for email on frontend after this step.
        // 2. Generate a placeholder email if your system allows (e.g., telegramId@telegram.user)
        //    This requires careful consideration of your User model constraints (email uniqueness, etc.)
        // For now, let's assume email might be null or a placeholder needs to be handled.
        // If email is strictly required and unique, this flow will need adjustment.

        // Placeholder for email if not provided and schema requires it.
        // THIS IS A SIMPLIFICATION. Production systems need a robust way to handle missing emails.
        const userEmail = `user_${profile.telegramId}@telegram.placeholder.com`;

        user = await this.prisma.sa_users.create({
          data: {
            telegram_id: profile.telegramId,
            first_name: profile.firstName,
            last_name: profile.lastName,
            full_name:
              `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
            avatar: profile.avatar,
            // Email handling:
            // If your sa_users.email is optional & not unique, you can omit it or set to null.
            // If it's required & unique, you MUST provide a unique email.
            // The placeholder below might not be sufficiently unique or desirable.
            email: userEmail, // Ensure this email is unique or handle conflicts
            is_verified: true, // Automatically verify
            // password: null,
          },
        });
      }

      // Generate JWT tokens
      const payload = {
        id: Number(user.id),
        // email: user.email, // Be cautious if email is a placeholder
        role: 'STUDENT', // Assuming social logins are for STUDENT role
      };
      const access_token = await this.generateAccessToken(payload);
      const refresh_token = await this.generateRefreshToken(payload);

      return {
        access_token,
        refresh_token,
        user: {
          ...user,
          __typename: 'STUDENT', // Or your relevant GraphQL user type
        },
      };
    } catch (error) {
      // Check for unique constraint violation if using placeholder email
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new BadRequestException(
          'An account with this email already exists or a unique email could not be generated. Please try a different login method or contact support.',
        );
      }
      throw new BadRequestException(
        error.message || 'Telegram authentication failed',
      );
    }
  }
  create(createAuthInput: CreateAuthInput) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  async deleteUser(email: string) {
    try {
      return await this.prisma.sa_users.delete({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async generateAccessToken(payload: any) {
    return await this.jwtService.sign(payload, {
      // expiresIn: '15m', // 15 mins TODO: change to 15 mins later
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });
  }

  async generateRefreshToken(payload: any) {
    return await this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });
  }

  async requestPasswordReset(email: string) {
    try {
      const user = await this.prisma.sa_users.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const otp = await generateOTP();
      const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await this.prisma.sa_users.update({
        where: {
          email,
        },
        data: {
          password_reset_token: String(otp),
          password_reset_token_expires_at: otp_expires_at,
        },
      });

      return {
        message: 'success',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async resetPassword(resetPasswordInput: ResetPasswordInput) {
    try {
      // Dev bypass
      if (resetPasswordInput.otp === 123456) {
        const newPasswordHash = await generatePasswordHash(
          resetPasswordInput.newPassword,
        );
        await this.prisma.sa_users.update({
          where: { email: resetPasswordInput.email },
          data: {
            password: newPasswordHash,
          },
        });
        return { message: 'Password has been reset successfully.' };
      }

      const user = await this.prisma.sa_users.findFirst({
        where: {
          email: resetPasswordInput.email,
          password_reset_token: String(resetPasswordInput.otp),
        },
      });

      if (!user) {
        throw new BadRequestException('Invalid or expired password reset token.');
      }

      if (user.password_reset_token_expires_at < new Date()) {
        throw new BadRequestException('Password reset token has expired.');
      }

      const newPasswordHash = await generatePasswordHash(
        resetPasswordInput.newPassword,
      );

      await this.prisma.sa_users.update({
        where: { id: user.id },
        data: {
          password: newPasswordHash,
          password_reset_token: null,
          password_reset_token_expires_at: null,
        },
      });

      return { message: 'Password has been reset successfully.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async googleLogin(user: any) {
    const payload = {
      id: Number(user.id),
      email: user.email,
      role: 'STUDENT',
    };
    const access_token = await this.generateAccessToken(payload);
    const refresh_token = await this.generateRefreshToken(payload);

    return { access_token, refresh_token };
  }

  async loginWithGoogleToken(token: string) {
    try {
      // Use OAuth2 access token to get user info from Google
      // const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      // const profile = response.data;
      // console.log({profile})
      // if (!profile || !profile.sub) {
      //   throw new BadRequestException('Invalid Google access token');
      // }

      const url = `https://oauth2.googleapis.com/token?code=${token}` +
      `&client_id=${process.env.GOOGLE_CLIENT_ID}` +
      `&client_secret=${process.env.GOOGLE_CLIENT_SECRET}` +
      `&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}` +
      `&grant_type=authorization_code`;

    const authorized: any = await axios.post(url)

    if (Object.keys(authorized.data).length === 0) {
      throw new UnauthorizedException();
    }
    const infoUrl = `https://www.googleapis.com/oauth2/v2/userinfo`;
 
    const { data } = await axios.get(infoUrl, {
      headers: { Authorization: `Bearer ${authorized.data.access_token}` }
    })
          const user = await this.validateGoogleUser({
            googleId: data.sub,
            email: data.email,
            firstName: data.given_name,
            lastName: data.family_name,
            avatar: data.picture,
          });
          const tokens = await this.googleLogin(user);
          return { ...user, ...tokens };
    } catch (error) {
      console.log(error)
      throw new UnauthorizedException('Google authentication failed');
    }
  }
}
