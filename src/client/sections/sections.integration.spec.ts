import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SectionsModule } from './sections.module';
import { PrismaService } from 'src/prisma.service';
import { SectionsService } from './sections.service';
import { User } from '../users/entities/user.entity';

describe('Sections Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let sectionsService: SectionsService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    full_name: 'Test User',
    first_name: 'Test',
    last_name: 'User',
    created_at: new Date(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SectionsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    sectionsService = moduleFixture.get<SectionsService>(SectionsService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prismaService.sa_curriclums.deleteMany();
    await prismaService.sa_sections.deleteMany();
  });

  describe('Section Service Integration', () => {
    it('should create and find a section', async () => {
      const createSectionInput = {
        course_id: 1,
      };

      const createdSection = await sectionsService.create(createSectionInput, mockUser);

      expect(createdSection).toBeDefined();
      expect(createdSection.course_id).toBe(1);
      expect(createdSection.order_num).toBe(1);

      const foundSection = await sectionsService.findOne(createdSection.id, mockUser);
      expect(foundSection).toBeDefined();
      expect(foundSection.id).toBe(createdSection.id);
    });

    it('should handle multiple sections with proper ordering', async () => {
      const createSectionInput = {
        course_id: 1,
      };

      // Create multiple sections
      const section1 = await sectionsService.create(createSectionInput, mockUser);
      const section2 = await sectionsService.create(createSectionInput, mockUser);
      const section3 = await sectionsService.create(createSectionInput, mockUser);

      expect(section1.order_num).toBe(1);
      expect(section2.order_num).toBe(2);
      expect(section3.order_num).toBe(3);

      const sections = await sectionsService.findByCourseId(1, mockUser);
      expect(sections).toHaveLength(3);
      expect(sections[0].order_num).toBe(1);
      expect(sections[1].order_num).toBe(2);
      expect(sections[2].order_num).toBe(3);
    });

    it('should update a section', async () => {
      const createSectionInput = {
        course_id: 1,
      };

      const section = await sectionsService.create(createSectionInput, mockUser);

      const updateSectionInput = {
        id: section.id,
        course_id: 2,
      };

      const updatedSection = await sectionsService.update(section.id, updateSectionInput, mockUser);

      expect(updatedSection.course_id).toBe(2);
      expect(updatedSection.updated_at).toBeDefined();
    });

    it('should delete a section', async () => {
      const createSectionInput = {
        course_id: 1,
      };

      const section = await sectionsService.create(createSectionInput, mockUser);
      const deletedSection = await sectionsService.remove(section.id, mockUser);

      expect(deletedSection.id).toBe(section.id);

      const foundSection = await sectionsService.findOne(section.id, mockUser);
      expect(foundSection).toBeNull();
    });
  });

  describe('Database Operations', () => {
    it('should create section directly in database', async () => {
      const section = await prismaService.sa_sections.create({
        data: {
          course_id: 1,
          order_num: 1,
        },
      });

      expect(section).toBeDefined();
      expect(section.course_id).toBe(1);
      expect(section.order_num).toBe(1);
    });

    it('should find sections by course id', async () => {
      // Create sections
      await prismaService.sa_sections.create({
        data: { course_id: 1, order_num: 1 },
      });
      await prismaService.sa_sections.create({
        data: { course_id: 1, order_num: 2 },
      });
      await prismaService.sa_sections.create({
        data: { course_id: 2, order_num: 1 },
      });

      const sectionsForCourse1 = await prismaService.sa_sections.findMany({
        where: { course_id: 1 },
        orderBy: { order_num: 'asc' },
      });

      expect(sectionsForCourse1).toHaveLength(2);
      expect(sectionsForCourse1[0].course_id).toBe(1);
      expect(sectionsForCourse1[1].course_id).toBe(1);
    });
  });
}); 