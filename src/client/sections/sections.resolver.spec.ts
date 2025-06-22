import { Test, TestingModule } from '@nestjs/testing';
import { SectionsResolver } from './sections.resolver';
import { SectionsService } from './sections.service';
import { PrismaService } from 'src/prisma.service';
import { CreateSectionInput } from './dto/create-section.input';
import { UpdateSectionInput } from './dto/update-section.input';
import { User } from '../users/entities/user.entity';
import { Section } from './entities/section.entity';
import { CourseStatus } from '../courses/entities/course.entity';

describe('SectionsResolver', () => {
  let resolver: SectionsResolver;
  let sectionsService: SectionsService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    full_name: 'Test User',
    first_name: 'Test',
    last_name: 'User',
    created_at: new Date(),
  };

  const mockSection: Section = {
    id: 1,
    created_at: new Date(),
    updated_at: new Date(),
    order_num: 1,
    status: CourseStatus.DRAFT,
    course_id: 1,
    sa_curriclum: [],
  };

  const mockSectionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCourseId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectionsResolver,
        {
          provide: SectionsService,
          useValue: mockSectionsService,
        },
        {
          provide: PrismaService,
          useValue: {
            sa_sections: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    resolver = module.get<SectionsResolver>(SectionsResolver);
    sectionsService = module.get<SectionsService>(SectionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createSection', () => {
    const createSectionInput: CreateSectionInput = {
      course_id: 1,
      name: 'Test Section',
    };

    it('should create a new section', async () => {
      mockSectionsService.create.mockResolvedValue(mockSection);

      const result = await resolver.createSection(mockUser, createSectionInput);

      expect(mockSectionsService.create).toHaveBeenCalledWith(
        createSectionInput,
        mockUser,
      );
      expect(result).toEqual(mockSection);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockSectionsService.create.mockRejectedValue(error);

      await expect(
        resolver.createSection(mockUser, createSectionInput),
      ).rejects.toThrow('Service error');
    });
  });

  describe('findAll', () => {
    it('should return all sections for a user', async () => {
      const mockSections = [mockSection];
      mockSectionsService.findAll.mockResolvedValue(mockSections);

      const result = await resolver.findAll(mockUser);

      expect(mockSectionsService.findAll).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockSections);
    });

    it('should return empty array when no sections found', async () => {
      mockSectionsService.findAll.mockResolvedValue([]);

      const result = await resolver.findAll(mockUser);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a section by id for a user', async () => {
      mockSectionsService.findOne.mockResolvedValue(mockSection);

      const result = await resolver.findOne(mockUser, 1);

      expect(mockSectionsService.findOne).toHaveBeenCalledWith(1, mockUser);
      expect(result).toEqual(mockSection);
    });

    it('should return null when section not found', async () => {
      mockSectionsService.findOne.mockResolvedValue(null);

      const result = await resolver.findOne(mockUser, 999);

      expect(result).toBeNull();
    });
  });

  describe('findByCourseId', () => {
    it('should return sections by course id', async () => {
      const mockSections = [mockSection];
      mockSectionsService.findByCourseId.mockResolvedValue(mockSections);

      const result = await resolver.findByCourseId(mockUser, 1);

      expect(mockSectionsService.findByCourseId).toHaveBeenCalledWith(1, mockUser);
      expect(result).toEqual(mockSections);
    });

    it('should return empty array when no sections found for course', async () => {
      mockSectionsService.findByCourseId.mockResolvedValue([]);

      const result = await resolver.findByCourseId(mockUser, 1);

      expect(result).toEqual([]);
    });
  });

  describe('updateSection', () => {
    const updateSectionInput: UpdateSectionInput = {
      id: 1,
      name: 'Updated Section',
    };

    it('should update a section', async () => {
      const updatedSection = { ...mockSection, name: 'Updated Section' };
      mockSectionsService.update.mockResolvedValue(updatedSection);

      const result = await resolver.updateSection(mockUser, updateSectionInput);

      expect(mockSectionsService.update).toHaveBeenCalledWith(
        1,
        updateSectionInput,
        mockUser,
      );
      expect(result).toEqual(updatedSection);
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      mockSectionsService.update.mockRejectedValue(error);

      await expect(
        resolver.updateSection(mockUser, updateSectionInput),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('removeSection', () => {
    it('should remove a section', async () => {
      mockSectionsService.remove.mockResolvedValue(mockSection);

      const result = await resolver.removeSection(mockUser, 1);

      expect(mockSectionsService.remove).toHaveBeenCalledWith(1, mockUser);
      expect(result).toEqual(mockSection);
    });

    it('should handle removal errors', async () => {
      const error = new Error('Removal failed');
      mockSectionsService.remove.mockRejectedValue(error);

      await expect(
        resolver.removeSection(mockUser, 1),
      ).rejects.toThrow('Removal failed');
    });
  });
}); 