import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseInput, CreateCourseResponse } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { PrismaService } from 'src/prisma.service';
import { paginate } from 'prisma-paginator';
import { createPaginator } from 'prisma-pagination';
import { Category, CurrentUserProps } from '../entities/common.entities';
import { UploadService } from 'src/utils/upload.service';


@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService
  ) {}
  async create(createCourseInput: CreateCourseInput, user: CurrentUserProps): Promise<CreateCourseResponse> {
    try {

      const image = await this.uploadService.uploadFromGraphQL((await createCourseInput.thumbnail), 'image', `course_images/${createCourseInput.course_name}`);

        const newCourse = await this.prisma.sa_courses.create({
          data: {
            course_name: createCourseInput.course_name,
            real_price: createCourseInput.real_price,
            sale_price: createCourseInput.sale_price || 0,
            description: createCourseInput.description,
            thumbnail: image.url,
            teacher_id:  user.role === 'TEACHER' ? user.id: null,
            user_id: createCourseInput.user_id ? Number(createCourseInput.user_id) : null,
            academiy_id: user.role === 'ACADEMY' ? user.id: null,
            category_id: createCourseInput.course_type_id ? Number(createCourseInput.course_type_id) : null,
          }
        })


        if(newCourse) {
          return {
            message: 'success',
            course_id: newCourse.id
          }
        }

    } catch (error) {
      console.log(error)
      throw new BadRequestException(error)
    }
  }

 async findTeacherCourses(user: any, page: number, perPage: number, search: string) {
  try {

    console.log(user)
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

async getCategories(): Promise<Category[]> {
  try {
    return await this.prisma.sa_categories.findMany({
      orderBy: {
        name: 'asc'
      }
    });

  } catch (error) {
    console.log(error)
    throw new BadRequestException(error);
  }
}



async getSubCategories(id: number) {
  try {
    let where = {
    }

    if(id) {
      where = {
        parent_type_id: id
      }
    }

    return await this.prisma.sa_sub_categories.findMany({
      where,
      orderBy: {
        name: 'asc'
      }
    })

  } catch (error) {
    console.log(error)
    throw new BadRequestException(error);
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
