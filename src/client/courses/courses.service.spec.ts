import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/utils/upload.service';
import { SignedUrlService } from 'src/utils/signed-url.service';
import { BadRequestException } from '@nestjs/common';
import { CurrentUserProps } from '../entities/common.entities';
import { UpdateCourseInput } from './dto/update-course.input';
import { FileUpload } from 'graphql-upload';
import { CourseStatus } from './entities/course.entity';

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: PrismaService;
  let uploadService: UploadService;
  let signedUrlService: SignedUrlService;

  const mockPrismaService = {
    sa_courses: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    sa_categories: {
      findMany: jest.fn(),
    },
    sa_sub_categories: {
      findMany: jest.fn(),
    },
    sa_enrolled_user_courses: {
      create: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUploadService = {
    uploadFromGraphQL: jest.fn(),
  };

  const mockSignedUrlService = {
    generateCourseThumbnailUploadSignedUrl: jest.fn(),
  };

  const mockUser: CurrentUserProps = {
    id: 1,
    email: 'test@example.com',
    role: 'STUDENT',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
        {
          provide: SignedUrlService,
          useValue: mockSignedUrlService,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    prisma = module.get<PrismaService>(PrismaService);
    uploadService = module.get<UploadService>(UploadService);
    signedUrlService = module.get<SignedUrlService>(SignedUrlService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    const user: CurrentUserProps = { id: 1, email: 'teacher@test.com', role: 'TEACHER' };
    const courseId = 1;
    const updateCourseInput: UpdateCourseInput = {
      id: courseId,
      course_name: 'Updated Course Name',
    };
    const existingCourse = {
      id: courseId,
      course_name: 'Original Course Name',
      teacher_id: 1,
      academiy_id: null,
      thumbnail: 'url/to/thumbnail',
    };

    it('should update a course successfully without thumbnail', async () => {
      mockPrismaService.sa_courses.findUnique.mockResolvedValue(existingCourse);
      const updatedData = { ...existingCourse, ...updateCourseInput };
      mockPrismaService.sa_courses.update.mockResolvedValue(updatedData);

      const result = await service.update(courseId, updateCourseInput, user);

      expect(prisma.sa_courses.findUnique).toHaveBeenCalledWith({ where: { id: courseId } });
      expect(prisma.sa_courses.update).toHaveBeenCalledWith({
        where: { id: courseId },
        data: {
          course_name: 'Updated Course Name',
          thumbnail: 'url/to/thumbnail',
        },
      });
      expect(result.course_name).toEqual('Updated Course Name');
    });
    
    it('should update a course successfully with thumbnail', async () => {
      const file: FileUpload = {
        createReadStream: () => null,
        filename: 'test.jpg',
        mimetype: 'image/jpeg',
        encoding: '7bit',
      };
      const updateWithThumbnail: UpdateCourseInput = {
        ...updateCourseInput,
        thumbnail: Promise.resolve(file),
      };
      const uploadResult = { url: 'new/url/to/thumbnail' };

      mockPrismaService.sa_courses.findUnique.mockResolvedValue(existingCourse);
      mockUploadService.uploadFromGraphQL.mockResolvedValue(uploadResult);
      mockPrismaService.sa_courses.update.mockResolvedValue({
        ...existingCourse,
        ...updateCourseInput,
        thumbnail: uploadResult.url,
      });

      const result = await service.update(courseId, updateWithThumbnail, user);

      expect(uploadService.uploadFromGraphQL).toHaveBeenCalled();
      expect(result.thumbnail).toBe(uploadResult.url);
    });

    it('should throw BadRequestException if course not found', async () => {
      mockPrismaService.sa_courses.findUnique.mockResolvedValue(null);

      await expect(service.update(courseId, updateCourseInput, user)).rejects.toThrow(
        new BadRequestException('Course not found'),
      );
    });

    it('should throw BadRequestException if user is not the owner', async () => {
      const anotherUser: CurrentUserProps = { id: 2, email: 'another@test.com', role: 'TEACHER' };
      mockPrismaService.sa_courses.findUnique.mockResolvedValue(existingCourse);

      await expect(service.update(courseId, updateCourseInput, anotherUser)).rejects.toThrow(
        new BadRequestException('You are not authorized to update this course'),
      );
    });
  });

  describe('enrollInCourse', () => {
    it('should successfully enroll user in a course', async () => {
      const courseId = 1;
      const mockCourse = {
        id: courseId,
        status: CourseStatus.APPROVED,
      };
      const mockEnrollment = {
        id: 1,
        user_id: mockUser.id,
        course_id: courseId,
        expires_at: null,
      };

      mockPrismaService.sa_courses.findUnique.mockResolvedValue(mockCourse);
      mockPrismaService.sa_enrolled_user_courses.findFirst.mockResolvedValue(null);
      mockPrismaService.sa_enrolled_user_courses.create.mockResolvedValue(mockEnrollment);

      const result = await service.enrollInCourse(mockUser, { courseId });

      expect(result).toEqual({
        message: 'Successfully enrolled in course',
        enrollmentId: 1,
        courseId: courseId,
        userId: mockUser.id,
        expiresAt: null,
      });
      expect(mockPrismaService.sa_enrolled_user_courses.create).toHaveBeenCalledWith({
        data: {
          user_id: mockUser.id,
          course_id: courseId,
          expires_at: null,
        },
      });
    });

    it('should throw error when course not found', async () => {
      const courseId = 999;
      mockPrismaService.sa_courses.findUnique.mockResolvedValue(null);

      await expect(service.enrollInCourse(mockUser, { courseId })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error when course is not approved', async () => {
      const courseId = 1;
      const mockCourse = {
        id: courseId,
        status: CourseStatus.DRAFT,
      };

      mockPrismaService.sa_courses.findUnique.mockResolvedValue(mockCourse);

      await expect(service.enrollInCourse(mockUser, { courseId })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error when user is already enrolled', async () => {
      const courseId = 1;
      const mockCourse = {
        id: courseId,
        status: CourseStatus.APPROVED,
      };
      const mockExistingEnrollment = {
        id: 1,
        user_id: mockUser.id,
        course_id: courseId,
      };

      mockPrismaService.sa_courses.findUnique.mockResolvedValue(mockCourse);
      mockPrismaService.sa_enrolled_user_courses.findFirst.mockResolvedValue(mockExistingEnrollment);

      await expect(service.enrollInCourse(mockUser, { courseId })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle enrollment with expiration date', async () => {
      const courseId = 1;
      const expiresAt = '2024-12-31T23:59:59Z';
      const mockCourse = {
        id: courseId,
        status: CourseStatus.APPROVED,
      };
      const mockEnrollment = {
        id: 1,
        user_id: mockUser.id,
        course_id: courseId,
        expires_at: new Date(expiresAt),
      };

      mockPrismaService.sa_courses.findUnique.mockResolvedValue(mockCourse);
      mockPrismaService.sa_enrolled_user_courses.findFirst.mockResolvedValue(null);
      mockPrismaService.sa_enrolled_user_courses.create.mockResolvedValue(mockEnrollment);

      const result = await service.enrollInCourse(mockUser, { courseId, expiresAt });

      expect(result.expiresAt).toEqual(new Date(expiresAt));
      expect(mockPrismaService.sa_enrolled_user_courses.create).toHaveBeenCalledWith({
        data: {
          user_id: mockUser.id,
          course_id: courseId,
          expires_at: new Date(expiresAt),
        },
      });
    });
  });

  describe('getUserEnrollments', () => {
    it('should return user enrollments with pagination', async () => {
      const mockEnrollments = {
        data: [
          {
            id: 1,
            created_at: new Date(),
            course_id: 1,
            user_id: mockUser.id,
            sa_courses: {
              id: 1,
              course_name: 'Test Course',
              sa_teachers: {
                id: 1,
                first_name: 'John',
                last_name: 'Doe',
              },
            },
            sa_users: {
              id: mockUser.id,
              first_name: 'Test',
              last_name: 'User',
            },
          },
        ],
        meta: {
          total: 1,
          lastPage: 1,
          currentPage: 1,
          perPage: 10,
        },
      };

      // Mock the paginator function
      const mockPaginator = jest.fn().mockResolvedValue(mockEnrollments);
      jest.spyOn(require('prisma-pagination'), 'createPaginator').mockReturnValue(mockPaginator);

      const result = await service.getUserEnrollments(mockUser, 1, 10);

      expect(result).toEqual(mockEnrollments);
      expect(mockPaginator).toHaveBeenCalledWith(mockPrismaService.sa_enrolled_user_courses, {
        where: { user_id: mockUser.id },
        orderBy: { created_at: 'desc' },
        include: {
          sa_courses: {
            include: {
              sa_teachers: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  full_name: true,
                  image: true,
                },
              },
            },
          },
          sa_users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              full_name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
    });
  });

  describe('checkEnrollmentStatus', () => {
    it('should return true when user is enrolled and not expired', async () => {
      const courseId = 1;
      const mockEnrollment = {
        id: 1,
        user_id: mockUser.id,
        course_id: courseId,
        expires_at: new Date('2024-12-31T23:59:59Z'),
      };

      mockPrismaService.sa_enrolled_user_courses.findFirst.mockResolvedValue(mockEnrollment);

      const result = await service.checkEnrollmentStatus(mockUser, courseId);

      expect(result).toBe(true);
    });

    it('should return false when user is not enrolled', async () => {
      const courseId = 1;
      mockPrismaService.sa_enrolled_user_courses.findFirst.mockResolvedValue(null);

      const result = await service.checkEnrollmentStatus(mockUser, courseId);

      expect(result).toBe(false);
    });

    it('should return false when enrollment has expired', async () => {
      const courseId = 1;
      const mockEnrollment = {
        id: 1,
        user_id: mockUser.id,
        course_id: courseId,
        expires_at: new Date('2020-01-01T00:00:00Z'), // Past date
      };

      mockPrismaService.sa_enrolled_user_courses.findFirst.mockResolvedValue(mockEnrollment);

      const result = await service.checkEnrollmentStatus(mockUser, courseId);

      expect(result).toBe(false);
    });

    it('should return true when enrollment has no expiration', async () => {
      const courseId = 1;
      const mockEnrollment = {
        id: 1,
        user_id: mockUser.id,
        course_id: courseId,
        expires_at: null,
      };

      mockPrismaService.sa_enrolled_user_courses.findFirst.mockResolvedValue(mockEnrollment);

      const result = await service.checkEnrollmentStatus(mockUser, courseId);

      expect(result).toBe(true);
    });
  });

  describe('unenrollFromCourse', () => {
    it('should successfully unenroll user from course', async () => {
      const courseId = 1;
      const mockEnrollment = {
        id: 1,
        user_id: mockUser.id,
        course_id: courseId,
        expires_at: null,
      };

      mockPrismaService.sa_enrolled_user_courses.findFirst.mockResolvedValue(mockEnrollment);
      mockPrismaService.sa_enrolled_user_courses.delete.mockResolvedValue(mockEnrollment);

      const result = await service.unenrollFromCourse(mockUser, courseId);

      expect(result).toEqual({
        message: 'Successfully unenrolled from course',
        enrollmentId: 1,
        courseId: courseId,
        userId: mockUser.id,
        expiresAt: null,
      });
      expect(mockPrismaService.sa_enrolled_user_courses.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw error when user is not enrolled', async () => {
      const courseId = 1;
      mockPrismaService.sa_enrolled_user_courses.findFirst.mockResolvedValue(null);

      await expect(service.unenrollFromCourse(mockUser, courseId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
