import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { PrismaService } from 'src/prisma.service';
import { SignUpInput, LoginInput, userLoginResponse, verifyOTPInput } from './entities/auth.entity';
import { comparePasswordHash, generateOTP, generatePasswordHash } from 'src/utils/hash';
import {JwtService} from '@nestjs/jwt'
import { AcademyStatus } from '../academies/entities/academy.entity';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async signup(createAuthInput: SignUpInput) {
    try {

        const existingUser = await this.prisma.sa_users.findFirst({
          where: {
            email: createAuthInput.email,
            is_verified: true
          }
        })
        if (existingUser) {
          throw new BadRequestException('User already exists');
        }
        const otp = await generateOTP();
        const password = await generatePasswordHash(createAuthInput.password);
       await this.prisma.sa_users.upsert({
        where: {
          email: createAuthInput.email
        },
        create: {
          fullname: createAuthInput.first_name + ' ' + createAuthInput.last_name,
          first_name: createAuthInput.first_name,
          last_name: createAuthInput.last_name,
          email: createAuthInput.email,
          otp: otp,
          password: password,
        },
        update: {
          otp: otp,
          // fullname: createAuthInput.first_name + ' ' + createAuthInput.last_name,
          // first_name: createAuthInput.first_name,
          // last_name: createAuthInput.last_name,
          // email: createAuthInput.email,
          // password: password,
        },
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
          // otp: String(verifyOTPInput.otp),
        }
      })
      if (!user) {
        throw new BadRequestException('Invalid OTP');
      }
      
      if(user?.is_verified) {
        throw new BadRequestException('User already verified');
      }

      if(user?.otp !== String(verifyOTPInput.otp)) {
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
      throw new BadRequestException(error);      
    }
  }


  async login(loginInput: LoginInput): Promise<userLoginResponse | any> {
    try {

      console.log({loginInput})
      if(loginInput.role === 'STUDENT') {
        return await this.userLogin(loginInput);
      }else if (loginInput.role === 'TEACHER') {
        return await this.teacherLogin(loginInput);
      }else if (loginInput.role === 'ACADEMY') {
        return await this.academyLogin(loginInput);
      }else if (loginInput.role === 'ADMIN') {
        return await this.adminLogin(loginInput);
      }
    
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error);
    }
  }



  async userLogin(userLoginInput: LoginInput) {
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
          email: user.email,
          role: 'STUDENT'
        }
        
        const access_token = await this.generateAccessToken(payload);
        const refresh_token = await this.generateRefreshToken(payload);
        delete user.password
        return {
          access_token,
          refresh_token,
          role: 'STUDENT',
          user: {
            ...user,
            __typename: 'STUDENT',},
        }
      } catch (error) {
        throw new BadRequestException(error);
      }
  }
  async teacherLogin(userLoginInput: LoginInput) {
    try {
      const user = await this.prisma.sa_teachers.findFirst({
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
        email: user.email,
        role: 'TEACHER'
      }

      const access_token = await this.generateAccessToken(payload);
      const refresh_token = await this.generateRefreshToken(payload);
      delete user.password

      return {
        access_token,
        refresh_token,
        user: {
          ...user,
          __typename: 'Teacher',
        }
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
}


async academyLogin(userLoginInput: LoginInput) {
  try {
    const user = await this.prisma.sa_academies.findFirst({
      where: {
        email: userLoginInput.email,
      }
    })

    if(!user) {
      throw new BadRequestException('Invalid credentials');
    }
    
    if(user.status !== AcademyStatus.CONFIRMED) {
      throw new BadRequestException('academy not verified');
    }

    if(!await comparePasswordHash(userLoginInput.password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      id: Number(user.id),
      email: user.email,
      role: 'ACADEMY'
    }

    const access_token = await this.generateAccessToken(payload);
    const refresh_token = await this.generateRefreshToken(payload);
    return {
      access_token,
      refresh_token,
      user: {
        ...user,
        __typename: 'ACADEMY',
      }
    }
  } catch (error) {
    throw new BadRequestException(error);
  }
}

async adminLogin(userLoginInput: LoginInput) {
  try {
    
    const user = await this.prisma.sa_admins.findFirst({
      where: {
        email: userLoginInput.email,
      }
    })

    if(!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if(!await comparePasswordHash(userLoginInput.password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      id: Number(user.id),
      email: user.email,
      role: 'ADMIN'
    }

    const access_token = await this.generateAccessToken(payload);
    const refresh_token = await this.generateRefreshToken(payload);
    delete user.password
    return {
      access_token,
      refresh_token,
      user: {
        ...user,
        __typename: 'ADMIN',
      }
    }
  } catch (error) {
    throw new BadRequestException(error);
  }
}


async refresh(token: string): Promise<{ access_token: string; new_refresh_token: string; user: any }> {
  const payload = this.jwtService.verify(token);
  const user = await this.prisma.sa_users.findUnique({ where: { id: payload.sub } });
  if (!user) throw new UnauthorizedException();

  const access_token = this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' });
  const new_refresh_token = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });

  return { access_token, new_refresh_token, user };
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
