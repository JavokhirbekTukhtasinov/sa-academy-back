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

  async findOne(id: number, user: User) {
    try {
      
    return this.prisma.sa_sections.findFirst({
      where: { id: Number(id) },
      include: {
        sa_curriclums: {
          orderBy: {
            order_num: 'asc',
          },
          include: { 
            sa_curriclum_attachments: true,
        }
      }
      },
    });
  } catch (error) {
    console.log(error)
    throw new BadRequestException(error)
  }
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

  async changeSectionOrder(courseId: number, sectionIds: number[], user: User): Promise<boolean> {
    // Optionally: check user permission for courseId here
    // Fetch all sections for the course
    const sections = await this.prisma.sa_sections.findMany({
      where: { course_id: courseId },
      select: { id: true },
    });
    const sectionIdSet = new Set(sections.map(s => s.id));
    // Validate all provided IDs belong to the course
    if (!sectionIds.every(id => sectionIdSet.has(id))) {
      throw new BadRequestException('Invalid section IDs for this course');
    }
    // Update each section's order_num in a transaction
    await this.prisma.$transaction(
      sectionIds.map((id, idx) =>
        this.prisma.sa_sections.update({
          where: { id },
          data: { order_num: idx + 1 },
        })
      )
    );
    return true;
  }
} 