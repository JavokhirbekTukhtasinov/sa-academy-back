import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseInput, CreateCourseResponse } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}
  async create(createCourseInput: CreateCourseInput): Promise<CreateCourseResponse> {
    console.log(createCourseInput)
    try {
        const newCourse = await this.prisma.sa_courses.create({
          data: {
            course_name: createCourseInput.course_name,
            real_price: createCourseInput.real_price,
            prev_price: createCourseInput.prev_price,
            teacher_id: BigInt(createCourseInput.teacher_id),
            user_id: createCourseInput.user_id ? BigInt(createCourseInput.user_id) : null,
            academiy_id: createCourseInput.academiy_id ? BigInt(createCourseInput.academiy_id) : null,
            course_type_id: createCourseInput.course_type_id ? BigInt(createCourseInput.course_type_id) : null,
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

  findAll() {
    return `This action returns all courses`;
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
