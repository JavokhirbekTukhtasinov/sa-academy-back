import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCourseInput, CreateCourseResponse } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { PrismaService } from 'src/prisma.service';
import { createPaginator } from 'prisma-pagination';
import { Category, CurrentUserProps } from '../entities/common.entities';
import { UploadService } from 'src/utils/upload.service';
import { SignedUrlService } from 'src/utils/signed-url.service';
import { CourseStatus } from './entities/course.entity';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly signedUrlService: SignedUrlService
  ) {}

  async create(createCourseInput: CreateCourseInput, user: CurrentUserProps): Promise<CreateCourseResponse> {
    try {
      const newCourse = await this.prisma.sa_courses.create({
        data: {
          course_name: createCourseInput.course_name,
          teacher_id: user.id,
          user_id: user.id,
        }
      });

      return {
        message: 'success',
        course_id: newCourse.id
      };
    } catch (error) {
      this.logger.error(`Failed to create course: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create course');
    }
  }

  async generateSignedUrl(fileName: string): Promise<string> {
    try {
      const contentType = this.getContentTypeFromFileName(fileName);
      
      // Use the course thumbnail specific signed URL service
      const signedUrl = await this.signedUrlService.generateCourseThumbnailUploadSignedUrl(
        fileName,
        contentType,
        {
          expiresIn: 3600, // 1 hour
          metadata: {
            type: 'course-thumbnail',
            uploadedAt: new Date().toISOString(),
          }
        }
      );

      this.logger.log(`Generated signed URL for course thumbnail: ${fileName}`);
      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL for course thumbnail: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to generate signed URL for course thumbnail');
    }
  }

  private getContentTypeFromFileName(fileName: string): string {
    const extension = fileName.toLowerCase().split('.').pop();
    const contentTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
    };
    
    return contentTypes[extension] || 'image/jpeg';
  }

  async findTeacherCourses(user: CurrentUserProps, page: number, perPage: number, search: string) {
    try {
      const paginator = createPaginator({
        perPage: perPage || 10,
        page: page || 1
      });
      
      return await paginator(this.prisma.sa_courses, {
        where: {
          teacher_id: user.id,
          ...(search && { course_name: { contains: search } })
        },
        orderBy: {
          created_at: 'desc'
        }
      });
    } catch (error) {
      this.logger.error(`Failed to find teacher courses: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve teacher courses');
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
      this.logger.error(`Failed to get categories: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve categories');
    }
  }

  async getSubCategories(id?: number) {
    try {
      const where = id ? { parent_type_id: id } : {};

      return await this.prisma.sa_sub_categories.findMany({
        where,
        orderBy: {
          name: 'asc'
        }
      });
    } catch (error) {
      this.logger.error(`Failed to get subcategories: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve subcategories');
    }
  }

  async findOneByUserId(id: number) {
    try {
      const course = await this.prisma.sa_courses.findUnique({
        where: { id }
      });

      if (!course) {
        throw new BadRequestException('Course not found');
      }

      return course;
    } catch (error) {
      this.logger.error(`Failed to find course by user ID: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve course');
    }
  }

  async getConfirmedCourses(
    page: number, 
    perPage: number, 
    search: string, 
    categoryId: number, 
    subCategoryId: number, 
    teacherId: number
  ) { 
    try {
      const paginator = createPaginator({
        perPage: perPage || 10,
        page: page || 1
      });

      return await paginator(this.prisma.sa_courses, {
        where: {
          status: CourseStatus.APPROVED,
          ...(search && { course_name: { contains: search } }),
          ...(categoryId && { category_id: categoryId }),
          ...(subCategoryId && { sub_category_id: subCategoryId }),
          ...(teacherId && { teacher_id: teacherId }) 
        },
        orderBy: {
          id: 'desc'
        },
        include: {
          sa_categories: {
            select: {
              id: true,
              name: true,
              sa_sub_categories: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          sa_teachers: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              full_name: true,
              image: true
            }
          }
        }
      });
    } catch (error) {
      this.logger.error(`Failed to get confirmed courses: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve confirmed courses');
    }
  }

  async findOneByCourseId(id: number) {
    try {
      const course = await this.prisma.sa_courses.findUnique({
        where: { id }
      });

      if (!course) {
        throw new BadRequestException('Course not found');
      }

      return course;
    } catch (error) {
      this.logger.error(`Failed to find course by course ID: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve course');
    }
  }

  async update(id: number, updateCourseInput: UpdateCourseInput, user: CurrentUserProps) {
    try {
      const course = await this.prisma.sa_courses.findUnique({
        where: { id },
      });

      if (!course) {
        throw new BadRequestException('Course not found');
      }

      const isOwner = course.teacher_id === user.id || course.academiy_id === user.id;

      if (!isOwner) {
        throw new BadRequestException('You are not authorized to update this course');
      }

      // Handle thumbnail upload if provided
      let thumbnailUrl = course.thumbnail;
      if (updateCourseInput.thumbnail) {
        const thumbnail = await updateCourseInput.thumbnail;
        const uploadResult = await this.uploadService.uploadFromGraphQL(
          thumbnail, 
          'image', 
          `course_images/${updateCourseInput.course_name || course.course_name}`
        );
        thumbnailUrl = uploadResult.url;
      }

      // Prepare update data without thumbnail promise and id
      const { id: courseId, thumbnail, ...updateData } = updateCourseInput;

      return await this.prisma.sa_courses.update({
        where: { id },
        data: {
          ...updateData,
          thumbnail: thumbnailUrl,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update course: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to update course');
    }
  }

  async remove(id: number) {
    try {
      const course = await this.prisma.sa_courses.findUnique({
        where: { id }
      });

      if (!course) {
        throw new BadRequestException('Course not found');
      }

      await this.prisma.sa_courses.delete({
        where: { id }
      });

      return { message: 'Course deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to remove course: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to remove course');
    }
  }
}
