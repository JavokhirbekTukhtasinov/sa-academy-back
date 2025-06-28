import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCourseInput, CreateCourseResponse } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { EnrollCourseInput } from './dto/enroll-course.input';
import { EnrollmentResponse } from './dto/enrollment-response';
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
    const teacher = await this.prisma.sa_teachers.findUnique({
      where: {
        user_id: user.id
      }
    })

    if(!teacher) {  
      throw new BadRequestException('Teacher not found');
    }
    try {
      const newCourse = await this.prisma.sa_courses.create({
        data: {
          course_name: createCourseInput.course_name,
          teacher_id: teacher.id,
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
      const teacher = await this.prisma.sa_teachers.findUnique({
        where: {
          user_id: user.id
        }
      })

      if(!teacher) {
        throw new BadRequestException('Teacher not found');
      }

      const paginator = createPaginator({
        perPage: perPage || 10,
        page: page || 1
      });

      return await paginator(this.prisma.sa_courses, {
        where: {
          teacher_id: teacher.id,
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
          status: CourseStatus.PUBLISHED,
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


  async enrollInCourse(user: CurrentUserProps, enrollCourseInput: EnrollCourseInput): Promise<EnrollmentResponse> {
    try {
      const course = await this.prisma.sa_courses.findUnique({
        where: { id: enrollCourseInput.courseId }
      });

      if (!course) {
        throw new BadRequestException('Course not found');
      }

      if (course.status !== CourseStatus.PUBLISHED) {
        throw new BadRequestException('Course is not available for enrollment');
      }

      // Check if user is already enrolled
      const existingEnrollment = await this.prisma.sa_enrolled_user_courses.findFirst({
        where: {
          user_id: user.id,
          course_id: enrollCourseInput.courseId
        }
      });

      if (existingEnrollment) {
        throw new BadRequestException('You are already enrolled in this course');
      }

      // Create enrollment
      const enrollment = await this.prisma.sa_enrolled_user_courses.create({
        data: {
          user_id: user.id,
          course_id: enrollCourseInput.courseId,
          expires_at: enrollCourseInput.expiresAt ? new Date(enrollCourseInput.expiresAt) : null
        }
      });

      this.logger.log(`User ${user.id} enrolled in course ${enrollCourseInput.courseId}`);

      return {
        message: 'Successfully enrolled in course',
        enrollmentId: enrollment.id,
        courseId: enrollment.course_id,
        userId: enrollment.user_id,
        expiresAt: enrollment.expires_at
      };
    } catch (error) {
      this.logger.error(`Failed to enroll in course: ${error.message}`, error.stack);
      throw new BadRequestException(error.message || 'Failed to enroll in course');
    }
  }

  async getUserEnrollments(user: CurrentUserProps, page: number = 1, perPage: number = 10): Promise<any> {
    try {
      const paginator = createPaginator({
        perPage: perPage || 10,
        page: page || 1
      });

      return await paginator(this.prisma.sa_enrolled_user_courses, {
        where: {
          user_id: user.id
        },
        orderBy: {
          created_at: 'desc'
        },
        include: {
          sa_courses: {
            include: {
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
          },
          sa_users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              full_name: true,
              email: true,
              avatar: true
            }
          }
        }
      });
    } catch (error) {
      this.logger.error(`Failed to get user enrollments: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve user enrollments');
    }
  }

  async checkEnrollmentStatus(user: CurrentUserProps, courseId: number): Promise<boolean> {
    try {
      const enrollment = await this.prisma.sa_enrolled_user_courses.findFirst({
        where: {
          user_id: user.id,
          course_id: courseId
        }
      });

      if (!enrollment) {
        return false;
      }

      // Check if enrollment has expired
      if (enrollment.expires_at && enrollment.expires_at < new Date()) {
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(`Failed to check enrollment status: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to check enrollment status');
    }
  }

  async unenrollFromCourse(user: CurrentUserProps, courseId: number): Promise<EnrollmentResponse> {
    try {
      const enrollment = await this.prisma.sa_enrolled_user_courses.findFirst({
        where: {
          user_id: user.id,
          course_id: courseId
        }
      });

      if (!enrollment) {
        throw new BadRequestException('You are not enrolled in this course');
      }

        await this.prisma.sa_enrolled_user_courses.delete({
        where: { id: enrollment.id }
      });

      this.logger.log(`User ${user.id} unenrolled from course ${courseId}`);

      return {
        message: 'Successfully unenrolled from course',
        enrollmentId: enrollment.id,
        courseId: enrollment.course_id,
        userId: enrollment.user_id,
        expiresAt: enrollment.expires_at
      };
    } catch (error) {
      this.logger.error(`Failed to unenroll from course: ${error.message}`, error.stack);
      throw new BadRequestException(error.message || 'Failed to unenroll from course');
    }
  }

  async update(id: number, updateCourseInput: UpdateCourseInput, user: CurrentUserProps) {
    try {
      const course = await this.prisma.sa_courses.findUnique({ where: { id } });
      if (!course) throw new BadRequestException('Course not found');
      const teacher = await this.prisma.sa_teachers.findUnique({ where: { user_id: user.id }, select: { id: true } });
      if (!teacher) throw new BadRequestException('Teacher not found');
      if (course.teacher_id !== teacher.id) throw new BadRequestException('You are not authorized to update this course');

      // Detect sensitive changes
      const sensitiveFields = ['real_price', 'sale_price', 'description', 'thumbnail'];
      let isSensitive = false;
      const pendingChanges: any = {};
      for (const field of sensitiveFields) {
        if (updateCourseInput[field] !== undefined && updateCourseInput[field] !== course[field]) {
          isSensitive = true;
          pendingChanges[field] = updateCourseInput[field];
        }
      }
      // Handle thumbnail upload if provided
      let thumbnailUrl = course.thumbnail || null;
      if (updateCourseInput.thumbnail) {
        const thumbnail = await updateCourseInput.thumbnail;
        const uploadResult = await this.uploadService.uploadFromGraphQL(
          thumbnail,
          'image',
          `course_images/${updateCourseInput.course_name || course.course_name}`
        );
        thumbnailUrl = uploadResult.url;
        if (isSensitive) pendingChanges['thumbnail'] = thumbnailUrl;
      }
      // If sensitive, store in pending_changes and set status
      if (isSensitive) {
        await this.prisma.sa_courses.update({
          where: { id },
          data: {
            pending_changes: JSON.stringify(pendingChanges),
            status: 'UPDATE_PENDING_REVIEW',
          },
        });
        // Log change
        await this.prisma.courseChangeLog.create({
          data: {
            course_id: id,
            change_type: 'CONTENT_UPDATE',
            field: Object.keys(pendingChanges).join(','),
            old_value: {},
            new_value: pendingChanges,
            requires_review: true,
            status: 'PENDING',
          },
        });
        return { ...course, ...pendingChanges, status: 'UPDATE_PENDING_REVIEW', pendingChanges: JSON.stringify(pendingChanges) };
      }
      // Non-sensitive: update immediately
      const { id: _ , teacher_id, user_id, ...updateData } = updateCourseInput;
      return await this.prisma.sa_courses.update({
        where: { id },
        data: {
          ...updateData,
          teacher_id: Number(teacher.id),
          user_id: Number(user.id),
          academiy_id: updateCourseInput.academiy_id || Number(course.academiy_id),
          category_id: updateCourseInput.category_id || Number(course.category_id),
          sub_category_id: updateCourseInput.sub_category_id || Number(course.sub_category_id),
          course_target_level: updateCourseInput.course_target_level || course.course_target_level,
          status: updateCourseInput.status as CourseStatus || course.status,
          is_live: updateCourseInput.is_live || course.is_live,
          thumbnail: thumbnailUrl || course.thumbnail,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update course: ${error.message}`, error.stack);
      throw new BadRequestException(error.message || 'Failed to update course');
    }
  }

  async submitCourseForReview(courseId: number, user: CurrentUserProps) {
    const courseToSubmit = await this.prisma.sa_courses.findUnique({ where: { id: courseId } });
    if (!courseToSubmit) throw new BadRequestException('Course not found');
    const teacher = await this.prisma.sa_teachers.findUnique({ where: { user_id: user.id }, select: { id: true } });
    if (!teacher) throw new BadRequestException('Teacher not found');
    if (courseToSubmit.teacher_id !== teacher.id) throw new BadRequestException('You are not authorized to submit this course');
    // Move all fields to pending_changes if not already
    const pendingChanges = { ...courseToSubmit };
    await this.prisma.sa_courses.update({
      where: { id: courseId },
      data: {
        pending_changes: JSON.stringify(pendingChanges),
        status: 'PENDING_REVIEW',
      },
    });
    // Log change
    await this.prisma.courseChangeLog.create({
      data: {
        course_id: courseId,
        change_type: 'CONTENT_UPDATE',
        field: 'ALL',
        old_value: {},
        new_value: pendingChanges,
        requires_review: true,
        status: 'PENDING',
      },
    });
    return { ...courseToSubmit, status: 'PENDING_REVIEW', pendingChanges: JSON.stringify(pendingChanges) };
  }

  async adminReviewCourse(courseId: number, approved: boolean, feedback: string, adminUser: CurrentUserProps) {
    // TODO: Add admin check for adminUser
    const courseToReview = await this.prisma.sa_courses.findUnique({ where: { id: courseId } });
    if (!courseToReview) throw new BadRequestException('Course not found');
    if (!courseToReview.pending_changes) throw new BadRequestException('No pending changes to review');
    if (approved) {
      const pending = JSON.parse(courseToReview.pending_changes as string);
      await this.prisma.sa_courses.update({
        where: { id: courseId },
        data: {
          ...pending,
          status: 'PUBLISHED',
          published_at: new Date(),
          pending_changes: null,
          review_feedback: null,
          last_reviewed_at: new Date(), 
        },
      });
      await this.prisma.courseChangeLog.updateMany({
        where: { course_id: courseId, status: 'PENDING' },
        data: { status: 'APPROVED' },
      });
      return { ...courseToReview, ...pending, status: 'PUBLISHED', pendingChanges: null };
    } else {
      await this.prisma.sa_courses.update({
        where: { id: courseId },
        data: {
          status: 'REJECTED',
          review_feedback: feedback,
          last_reviewed_at: new Date(),
        },
      });
      await this.prisma.courseChangeLog.updateMany({
        where: { course_id: courseId, status: 'PENDING' },
        data: { status: 'REJECTED' },
      });
      return { ...courseToReview, status: 'REJECTED', reviewFeedback: feedback };
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