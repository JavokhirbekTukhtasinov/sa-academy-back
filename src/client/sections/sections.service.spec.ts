import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { PrismaService } from 'src/prisma.service';
import { CreateSectionInput } from './dto/create-section.input';
import { UpdateSectionInput } from './dto/update-section.input';
import { User } from '../users/entities/user.entity';

describe('SectionsService', () => {
  let service: SectionsService;
  let prismaService: PrismaService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    full_name: 'Test User',
    first_name: 'Test',
    last_name: 'User',
    created_at: new Date(),
  };

  const mockSection = {
    id: 1,
    created_at: new Date(),
    updated_at: new Date(),
    order_num: 1,
    status: 'DRAFT',
    course_id: 1,
    sa_curriclums: [],
  };

  const mockPrismaService = {
    sa_sections: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SectionsService>(SectionsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createSectionInput: CreateSectionInput = {
      course_id: 1,
      name: 'Test Section',
    };

    it('should create a new section with order_num 1 when no sections exist', async () => {
      mockPrismaService.sa_sections.findFirst.mockResolvedValue(null);
      mockPrismaService.sa_sections.create.mockResolvedValue(mockSection);

      const result = await service.create(createSectionInput, mockUser);

      expect(mockPrismaService.sa_sections.findFirst).toHaveBeenCalledWith({
        where: { course_id: 1 },
        orderBy: { order_num: 'desc' },
      });
      expect(mockPrismaService.sa_sections.create).toHaveBeenCalledWith({
        data: {
          ...createSectionInput,
          order_num: 1,
        },
        include: {
          sa_curriclums: true,
        },
      });
      expect(result).toEqual(mockSection);
    });

    it('should create a new section with incremented order_num when sections exist', async () => {
      const existingSection = { ...mockSection, order_num: 3 };
      mockPrismaService.sa_sections.findFirst.mockResolvedValue(existingSection);
      mockPrismaService.sa_sections.create.mockResolvedValue(mockSection);

      const result = await service.create(createSectionInput, mockUser);

      expect(mockPrismaService.sa_sections.create).toHaveBeenCalledWith({
        data: {
          ...createSectionInput,
          order_num: 4,
        },
        include: {
          sa_curriclums: true,
        },
      });
      expect(result).toEqual(mockSection);
    });

    it('should throw BadRequestException when creation fails', async () => {
      const error = new Error('Database error');
      mockPrismaService.sa_sections.findFirst.mockResolvedValue(null);
      mockPrismaService.sa_sections.create.mockRejectedValue(error);

      await expect(service.create(createSectionInput, mockUser)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createSectionInput, mockUser)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all sections for a user', async () => {
      const mockSections = [mockSection];
      mockPrismaService.sa_sections.findMany.mockResolvedValue(mockSections);

      const result = await service.findAll(mockUser);

      expect(mockPrismaService.sa_sections.findMany).toHaveBeenCalledWith({
        where: { course_id: mockUser.id },
        include: {
          sa_curriclums: true,
        },
      });
      expect(result).toEqual(mockSections);
    });
  });

  describe('findOne', () => {
    it('should return a section by id for a user', async () => {
      mockPrismaService.sa_sections.findUnique.mockResolvedValue(mockSection);

      const result = await service.findOne(1, mockUser);

      expect(mockPrismaService.sa_sections.findUnique).toHaveBeenCalledWith({
        where: { id: 1, course_id: mockUser.id },
        include: {
          sa_curriclums: true,
        },
      });
      expect(result).toEqual(mockSection);
    });

    it('should return null when section not found', async () => {
      mockPrismaService.sa_sections.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999, mockUser);

      expect(result).toBeNull();
    });
  });

  describe('findByCourseId', () => {
    it('should return sections by course id ordered by order_num', async () => {
      const mockSections = [mockSection];
      mockPrismaService.sa_sections.findMany.mockResolvedValue(mockSections);

      const result = await service.findByCourseId(1, mockUser);

      expect(mockPrismaService.sa_sections.findMany).toHaveBeenCalledWith({
        where: { course_id: 1 },
        include: {
          sa_curriclums: true,
        },
        orderBy: {
          order_num: 'asc',
        },
      });
      expect(result).toEqual(mockSections);
    });
  });

  describe('update', () => {
    const updateSectionInput: UpdateSectionInput = {
      id: 1,
      name: 'Updated Section',
    };

    it('should update a section', async () => {
      const updatedSection = { ...mockSection, name: 'Updated Section' };
      mockPrismaService.sa_sections.update.mockResolvedValue(updatedSection);

      const result = await service.update(1, updateSectionInput, mockUser);

      expect(mockPrismaService.sa_sections.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Updated Section',
          updated_at: expect.any(Date),
        },
        include: {
          sa_curriclums: true,
        },
      });
      expect(result).toEqual(updatedSection);
    });
  });

  describe('remove', () => {
    it('should delete a section', async () => {
      mockPrismaService.sa_sections.delete.mockResolvedValue(mockSection);

      const result = await service.remove(1, mockUser);

      expect(mockPrismaService.sa_sections.delete).toHaveBeenCalledWith({
        where: { id: 1, course_id: mockUser.id },
      });
      expect(result).toEqual(mockSection);
    });
  });
}); 