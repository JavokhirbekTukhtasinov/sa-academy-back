import { Test, TestingModule } from '@nestjs/testing';
import { TeachersService } from './teachers.service';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/utils/upload.service';
import { BadRequestException } from '@nestjs/common';
import { CurrentUserProps } from '../entities/common.entities';

describe('TeachersService', () => {
  let service: TeachersService;
  let prismaService: PrismaService;
  let uploadService: UploadService;

  const mockPrismaService = {
    sa_teachers: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    sa_teacher_files: {
      create: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
    sa_users: {
      findFirst: jest.fn(),
    },
  };

  const mockUploadService = {
    uploadFromGraphQL: jest.fn(),
  };

  const mockUser: CurrentUserProps = {
    id: 1,
    email: 'test@test.com',
    role: 'TEACHER',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    }).compile();

    service = module.get<TeachersService>(TeachersService);
    prismaService = module.get<PrismaService>(PrismaService);
    uploadService = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTeacherSettings', () => {
    it('should return teacher settings when teacher exists', async () => {
      const mockTeacher = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        sa_teacher_files: [],
        sa_academies: null,
        sa_users: null,
      };

      mockPrismaService.sa_teachers.findFirst.mockResolvedValue(mockTeacher);

      const result = await service.getTeacherSettings(mockUser);

      expect(result).toEqual(mockTeacher);
      expect(mockPrismaService.sa_teachers.findFirst).toHaveBeenCalledWith({
        where: { user_id: 1 },
        include: {
          sa_teacher_files: true,
          sa_academies: true,
          sa_users: true,
        },
      });
    });

    it('should throw BadRequestException when teacher not found', async () => {
      mockPrismaService.sa_teachers.findFirst.mockResolvedValue(null);

      await expect(service.getTeacherSettings(mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateTeacherSettings', () => {
    it('should update teacher settings successfully', async () => {
      const mockTeacher = { id: 1, user_id: 1 };
      const updateInput = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      };
      const updatedTeacher = {
        ...mockTeacher,
        ...updateInput,
        sa_teacher_files: [],
        sa_academies: null,
        sa_users: null,
      };

      mockPrismaService.sa_teachers.findFirst.mockResolvedValue(mockTeacher);
      mockPrismaService.sa_teachers.update.mockResolvedValue(updatedTeacher);

      const result = await service.updateTeacherSettings(mockUser, updateInput);

      expect(result).toEqual(updatedTeacher);
      expect(mockPrismaService.sa_teachers.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
        },
        include: {
          sa_teacher_files: true,
          sa_academies: true,
          sa_users: true,
        },
      });
    });

    it('should throw BadRequestException when teacher not found', async () => {
      const updateInput = { id: 1, first_name: 'John' };

      mockPrismaService.sa_teachers.findFirst.mockResolvedValue(null);

      await expect(
        service.updateTeacherSettings(mockUser, updateInput),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when updating different teacher', async () => {
      const mockTeacher = { id: 1, user_id: 1 };
      const updateInput = { id: 2, first_name: 'John' };

      mockPrismaService.sa_teachers.findFirst.mockResolvedValue(mockTeacher);

      await expect(
        service.updateTeacherSettings(mockUser, updateInput),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('uploadTeacherFile', () => {
    it('should upload teacher file successfully', async () => {
      const mockTeacher = { id: 1 };
      const uploadInput = {
        fileName: 'resume.pdf',
        fileUrl: 'https://example.com/resume.pdf',
      };
      const updatedTeacher = {
        id: 1,
        sa_teacher_files: [{ id: 1, file_name: 'resume.pdf' }],
        sa_academies: null,
        sa_users: null,
      };

      mockPrismaService.sa_teachers.findFirst
        .mockResolvedValueOnce(mockTeacher)
        .mockResolvedValueOnce(updatedTeacher);
      mockPrismaService.sa_teacher_files.create.mockResolvedValue({ id: 1 });

      const result = await service.uploadTeacherFile(mockUser, uploadInput);

      expect(result).toEqual(updatedTeacher);
      expect(mockPrismaService.sa_teacher_files.create).toHaveBeenCalledWith({
        data: {
          file_name: uploadInput.fileName,
          file_url: uploadInput.fileUrl,
          teacher_id: 1,
        },
      });
    });

    it('should throw BadRequestException when teacher not found', async () => {
      const uploadInput = {
        fileName: 'resume.pdf',
        fileUrl: 'https://example.com/resume.pdf',
      };

      mockPrismaService.sa_teachers.findFirst.mockResolvedValue(null);

      await expect(
        service.uploadTeacherFile(mockUser, uploadInput),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteTeacherFile', () => {
    it('should delete teacher file successfully', async () => {
      const mockTeacher = { id: 1 };
      const mockFile = { id: 1, teacher_id: 1 };
      const updatedTeacher = {
        id: 1,
        sa_teacher_files: [],
        sa_academies: null,
        sa_users: null,
      };

      mockPrismaService.sa_teachers.findFirst
        .mockResolvedValueOnce(mockTeacher)
        .mockResolvedValueOnce(updatedTeacher);
      mockPrismaService.sa_teacher_files.findFirst.mockResolvedValue(mockFile);
      mockPrismaService.sa_teacher_files.delete.mockResolvedValue({ id: 1 });

      const result = await service.deleteTeacherFile(mockUser, 1);

      expect(result).toEqual(updatedTeacher);
      expect(mockPrismaService.sa_teacher_files.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw BadRequestException when teacher not found', async () => {
      mockPrismaService.sa_teachers.findFirst.mockResolvedValue(null);

      await expect(service.deleteTeacherFile(mockUser, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when file not found', async () => {
      const mockTeacher = { id: 1 };

      mockPrismaService.sa_teachers.findFirst.mockResolvedValue(mockTeacher);
      mockPrismaService.sa_teacher_files.findFirst.mockResolvedValue(null);

      await expect(service.deleteTeacherFile(mockUser, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
