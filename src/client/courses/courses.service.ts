import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseInput, CreateCourseResponse } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { PrismaService } from 'src/prisma.service';
import { paginate } from 'prisma-paginator';
import { createPaginator } from 'prisma-pagination';


@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}
  async create(createCourseInput: CreateCourseInput): Promise<CreateCourseResponse> {

    try {
        const newCourse = await this.prisma.sa_courses.create({
          data: {
            course_name: createCourseInput.course_name,
            real_price: createCourseInput.real_price,
            sale_price: createCourseInput.sale_price,
            teacher_id: Number(createCourseInput.teacher_id),
            user_id: createCourseInput.user_id ? Number(createCourseInput.user_id) : null,
            academiy_id: createCourseInput.academiy_id ? Number(createCourseInput.academiy_id) : null,
            category_id: createCourseInput.course_type_id ? Number(createCourseInput.course_type_id) : null,
          }
        })
        if(newCourse) {
          return {
            message: 'success'
          }
        }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error)
    }
  }

 async findTeacherCourses(user: any, page: number, perPage: number, search: string) {
  try {
    const paginator = createPaginator({
      perPage: perPage || 10,
      page: page || 1
    });
      
    const result = await paginator(this.prisma.sa_courses, {
      where: {
        teacher_id: user.id,
        course_name: {
          contains: search
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    return result
  } catch (error) {
    throw new BadRequestException(error)
  }
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  update(id: number, updateCourseInput: UpdateCourseInput) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
