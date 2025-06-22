import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSectionInput } from './dto/create-section.input';
import { UpdateSectionInput } from './dto/update-section.input';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSectionInput: CreateSectionInput, user: User) {
    try {
      const lastSection = await this.prisma.sa_sections.findFirst({
        where: { course_id: Number(createSectionInput.course_id) },
        orderBy: {
          order_num: 'desc',
        },
      });
    
    return this.prisma.sa_sections.create({
      data: {
        ...createSectionInput,
        order_num: lastSection ? Number(lastSection.order_num) + 1 : 1,
        },
      include: {
        sa_curriclums: true,
      },
    });
  } catch (error) {
    console.log(error)
    throw new BadRequestException(error)
  }
  }

  findAll(user: User) {
    return this.prisma.sa_sections.findMany({
      where: { course_id: user.id },
      include: {
        sa_curriclums: true,
      },
    });
  }

  findOne(id: number, user: User) {
    return this.prisma.sa_sections.findUnique({
      where: { id: Number(id), course_id: user.id },
      include: {
        sa_curriclums: true,
      },
    });
  }

  findByCourseId(courseId: number, user: User) {
    return this.prisma.sa_sections.findMany({
      where: { course_id: Number(courseId) },
      include: {
        sa_curriclums: true,
      },
      orderBy: {
        order_num: 'asc',
      },
    });
  }


  update(id: number, updateSectionInput: UpdateSectionInput, user: User) {
    const { id: _, ...data } = updateSectionInput;
    return this.prisma.sa_sections.update({
      where: { id: Number(id) },
      data: { 
        ...data,
        updated_at: new Date(),
      },
      include: {
        sa_curriclums: true,
      },
    });
  } 

  
  remove(id: number, user: User) {
    return this.prisma.sa_sections.delete({
      where: { id: Number(id), course_id: user.id },
    });
  }
} 