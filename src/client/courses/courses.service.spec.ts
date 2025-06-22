import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/utils/upload.service';
import { BadRequestException } from '@nestjs/common';
import { CurrentUserProps } from '../entities/common.entities';
import { UpdateCourseInput } from './dto/update-course.input';
import { FileUpload } from 'graphql-upload';

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: PrismaService;
  let uploadService: UploadService;

  const mockPrismaService = {
    sa_courses: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockUploadService = {
    uploadFromGraphQL: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: UploadService, useValue: mockUploadService },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    prisma = module.get<PrismaService>(PrismaService);
    uploadService = module.get<UploadService>(UploadService);
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
});
