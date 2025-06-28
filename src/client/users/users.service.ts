import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma.service';
import { UserCourses, UserFeadbacks, UserPayment } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserInput: CreateUserInput) {
    return 'This action adds a new user';
  }

  findAll(): Promise<User[]>  {
    return Promise.resolve([]);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getUserLikedCourses(userId: number): Promise<any[]> {
    return this.prisma.sa_liked_courses.findMany({
      where: { user_id: userId },
      include: { sa_courses: true, sa_users: true },
    });
  }

  async getUserFeadbacks(userId: number): Promise<any[]> {
    return this.prisma.sa_user_feadbacks.findMany({
      where: { user_id: userId },
      include: { sa_courses: true, sa_users: true },
    });
  }

  async getUserPayments(userId: number): Promise<any[]> {
    return this.prisma.sa_user_payments.findMany({
      where: { user_id: userId },
      include: { sa_courses: true, sa_users: true },
    });
  }
}
