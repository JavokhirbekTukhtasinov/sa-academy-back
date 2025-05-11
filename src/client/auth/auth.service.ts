import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { PrismaService } from 'src/prisma.service';
import { SignUpInput, userLoginInput, userLoginResponse, verifyOTPInput } from './entities/auth.entity';
import { comparePasswordHash, generateOTP, generatePasswordHash } from 'src/utils/hash';
import {JwtService} from '@nestjs/jwt'
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}


  async signup(createAuthInput: SignUpInput) {
    try {
        const password = await generatePasswordHash(createAuthInput.password);
      const otp = generateOTP();
       await this.prisma.sa_users.create({
        data: {
          fullname: createAuthInput.first_name + ' ' + createAuthInput.last_name,
          first_name: createAuthInput.first_name,
          last_name: createAuthInput.last_name,
          email: createAuthInput.email,
          otp: otp,
          password: password,
        }
      })
      return {
        message: 'success'
      }
    } catch (error) {
      throw new BadRequestException(error);      
    }
  }


  async verifyOTP(verifyOTPInput: verifyOTPInput) {
    try {
    console.log(verifyOTPInput)
      const user = await this.prisma.sa_users.findFirst({
        where: {
          email: verifyOTPInput.email,
          otp: String(verifyOTPInput.otp),
        }
      })

      if(user?.is_verified) {
        throw new BadRequestException('User already verified');
      }
      if (!user) {
        throw new BadRequestException('Invalid OTP');
      }
      await this.prisma.sa_users.update({
        where: {
          id: user.id
        },
        data: {
          otp: null,
          is_verified: true
        }
      })
      return {
        message: 'success'
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error);      
    }
  }



  async userLogin(userLoginInput: userLoginInput): Promise<userLoginResponse | any> {
    try {

      const user = await this.prisma.sa_users.findFirst({
        where: {
          email: userLoginInput.email,
        }
      })
      if(!user) {
        throw new BadRequestException('Invalid credentials');
      }
      
      if(!user.is_verified) {
        throw new BadRequestException('User not verified');
      }

      if(!await comparePasswordHash(userLoginInput.password, user.password)) {
        throw new BadRequestException('Invalid credentials');
      }

      const payload = {
        id: Number(user.id),
        email: user.email
      }

      const access_token = await this.generateAccessToken(payload);
      const refresh_token = await this.generateRefreshToken(payload);
      return {
        access_token,
        refresh_token
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error);
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

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }


  async generateAccessToken(payload: any) {
    return await this.jwtService.sign(payload, {expiresIn: '15m', secret: process.env.JWT_SECRET})
  }

  async generateRefreshToken(payload: any) {
    return await this.jwtService.sign(payload, {expiresIn: '7d', secret: process.env.JWT_SECRET})
  }

}
