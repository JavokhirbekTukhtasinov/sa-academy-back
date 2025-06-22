import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CurriclumModule } from './curriclum.module';
import { PrismaService } from 'src/prisma.service';
import { CurriclumService } from './curriclum.service';
import { CreateCurriclumInput } from './dto/create-curriclum.input';
import { CreateCurriclumAttachmentInput } from './dto/create-curriclum-attachment.input';
import { CurriclumTypes } from './entities/curriclum.entity';
import { CurriclumAttachmentTypes } from './entities/curriclum-attachment.entity';

describe('Curriclum Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let curriclumService: CurriclumService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CurriclumModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    curriclumService = moduleFixture.get<CurriclumService>(CurriclumService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prismaService.sa_curriclum_attachments.deleteMany();
    await prismaService.sa_curriclums.deleteMany();
    await prismaService.sa_sections.deleteMany();
  });

  describe('Curriclum Service Integration', () => {
    it('should create and find a curriclum', async () => {
      // Create a section first
      const section = await prismaService.sa_sections.create({
        data: {
          course_id: 1,
          order_num: 1,
        },
      });

      const createCurriclumInput: CreateCurriclumInput = {
        section_id: section.id,
        type: CurriclumTypes.VIDEO,
        title: 'Test Curriclum',
        description: 'Test Description',
        vide_link: 'https://example.com/video',
      };

      const createdCurriclum = await curriclumService.create(createCurriclumInput);

      expect(createdCurriclum).toBeDefined();
      expect(createdCurriclum.section_id).toBe(section.id);
      expect(createdCurriclum.type).toBe(CurriclumTypes.VIDEO);
      expect(createdCurriclum.title).toBe('Test Curriclum');

      const foundCurriclum = await curriclumService.findOne(Number(createdCurriclum.id));
      expect(foundCurriclum).toBeDefined();
      expect(foundCurriclum.id).toBe(createdCurriclum.id);
    });

    it('should find curriclums by section id', async () => {
      // Create a section
      const section = await prismaService.sa_sections.create({
        data: {
          course_id: 1,
          order_num: 1,
        },
      });

      // Create multiple curriclums
      const curriclum1 = await curriclumService.create({
        section_id: section.id,
        type: CurriclumTypes.VIDEO,
        title: 'Video 1',
      });

      const curriclum2 = await curriclumService.create({
        section_id: section.id,
        type: CurriclumTypes.ARTICLE,
        title: 'Article 1',
      });

      const curriclums = await curriclumService.findBySectionId(section.id);

      expect(curriclums).toHaveLength(2);
      expect(curriclums[0].section_id).toBe(section.id);
      expect(curriclums[1].section_id).toBe(section.id);
    });

    it('should update a curriclum', async () => {
      // Create a section
      const section = await prismaService.sa_sections.create({
        data: {
          course_id: 1,
          order_num: 1,
        },
      });

      const curriclum = await curriclumService.create({
        section_id: section.id,
        type: CurriclumTypes.VIDEO,
        title: 'Original Title',
      });

      const updatedCurriclum = await curriclumService.update(Number(curriclum.id), {
        id: Number(curriclum.id),
        title: 'Updated Title',
        description: 'Updated Description',
      });

      expect(updatedCurriclum.title).toBe('Updated Title');
      expect(updatedCurriclum.description).toBe('Updated Description');
    });

    it('should delete a curriclum', async () => {
      // Create a section
      const section = await prismaService.sa_sections.create({
        data: {
          course_id: 1,
          order_num: 1,
        },
      });

      const curriclum = await curriclumService.create({
        section_id: section.id,
        type: CurriclumTypes.VIDEO,
        title: 'Test Curriclum',
      });

      const deletedCurriclum = await curriclumService.remove(Number(curriclum.id));

      expect(deletedCurriclum.id).toBe(curriclum.id);

      const foundCurriclum = await curriclumService.findOne(Number(curriclum.id));
      expect(foundCurriclum).toBeNull();
    });
  });

  describe('Curriclum Attachment Integration', () => {
    it('should create and find attachments', async () => {
      // Create a section and curriclum
      const section = await prismaService.sa_sections.create({
        data: {
          course_id: 1,
          order_num: 1,
        },
      });

      const curriclum = await curriclumService.create({
        section_id: section.id,
        type: CurriclumTypes.VIDEO,
        title: 'Test Curriclum',
      });

      const createAttachmentInput: CreateCurriclumAttachmentInput = {
        type: CurriclumAttachmentTypes.EXTERNAL_LINK,
        link_url: 'https://example.com/link',
        name: 'Test Attachment',
        curriclum_id: Number(curriclum.id),
      };

      const createdAttachment = await curriclumService.createAttachment(createAttachmentInput);

      expect(createdAttachment).toBeDefined();
      expect(createdAttachment.curriclum_id).toBe(curriclum.id);
      expect(createdAttachment.type).toBe(CurriclumAttachmentTypes.EXTERNAL_LINK);

      const attachments = await curriclumService.findAttachmentsByCurriclumId(Number(curriclum.id));
      expect(attachments).toHaveLength(1);
      expect(attachments[0].id).toBe(createdAttachment.id);
    });

    it('should update an attachment', async () => {
      // Create a section and curriclum
      const section = await prismaService.sa_sections.create({
        data: {
          course_id: 1,
          order_num: 1,
        },
      });

      const curriclum = await curriclumService.create({
        section_id: section.id,
        type: CurriclumTypes.VIDEO,
        title: 'Test Curriclum',
      });

      const attachment = await curriclumService.createAttachment({
        type: CurriclumAttachmentTypes.EXTERNAL_LINK,
        link_url: 'https://example.com/link',
        name: 'Original Name',
        curriclum_id: Number(curriclum.id),
      });

      const updatedAttachment = await curriclumService.updateAttachment(Number(attachment.id), {
        id: Number(attachment.id),
        name: 'Updated Name',
      });

      expect(updatedAttachment.name).toBe('Updated Name');
    });

    it('should delete an attachment', async () => {
      // Create a section and curriclum
      const section = await prismaService.sa_sections.create({
        data: {
          course_id: 1,
          order_num: 1,
        },
      });

      const curriclum = await curriclumService.create({
        section_id: section.id,
        type: CurriclumTypes.VIDEO,
        title: 'Test Curriclum',
      });

      const attachment = await curriclumService.createAttachment({
        type: CurriclumAttachmentTypes.EXTERNAL_LINK,
        link_url: 'https://example.com/link',
        name: 'Test Attachment',
        curriclum_id: Number(curriclum.id),
      });

      const deletedAttachment = await curriclumService.removeAttachment(Number(attachment.id) as number);

      expect(deletedAttachment.id).toBe(attachment.id);

      const attachments = await curriclumService.findAttachmentsByCurriclumId(Number(curriclum.id));
      expect(attachments).toHaveLength(0);
    });
  });

  describe('Database Operations', () => {
    it('should create curriclum directly in database', async () => {
      const section = await prismaService.sa_sections.create({
        data: {
          course_id: 1,
          order_num: 1,
        },
      });

      const curriclum = await prismaService.sa_curriclums.create({
        data: {
          section_id: section.id,
          type: 'VIDEO',
          title: 'Test Curriclum',
          description: 'Test Description',
        },
      });

      expect(curriclum).toBeDefined();
      expect(curriclum.section_id).toBe(section.id);
      expect(curriclum.type).toBe('VIDEO');
      expect(curriclum.title).toBe('Test Curriclum');
    });

    it('should create attachment directly in database', async () => {
      const section = await prismaService.sa_sections.create({
        data: {
          course_id: 1,
          order_num: 1,
        },
      });

      const curriclum = await prismaService.sa_curriclums.create({
        data: {
          section_id: section.id,
          type: 'VIDEO',
          title: 'Test Curriclum',
        },
      });

      const attachment = await prismaService.sa_curriclum_attachments.create({
        data: {
          type: 'EXTERNAL_LINK',
          link_url: 'https://example.com/link',
          name: 'Test Attachment',
          curriclum_id: curriclum.id,
        },
      });

      expect(attachment).toBeDefined();
      expect(attachment.curriclum_id).toBe(curriclum.id);
      expect(attachment.type).toBe('EXTERNAL_LINK');
    });

    it('should find curriclums with attachments', async () => {
      const section = await prismaService.sa_sections.create({
        data: {
          course_id: 1,
          order_num: 1,
        },
      });

      const curriclum = await prismaService.sa_curriclums.create({
        data: {
          section_id: section.id,
          type: 'VIDEO',
          title: 'Test Curriclum',
        },
      });

      await prismaService.sa_curriclum_attachments.create({
        data: {
          type: 'EXTERNAL_LINK',
          link_url: 'https://example.com/link',
          name: 'Test Attachment',
          curriclum_id: curriclum.id,
        },
      });

      const curriclumWithAttachments = await prismaService.sa_curriclums.findUnique({
        where: { id: curriclum.id },
        include: {
          sa_curriclum_attachments: true,
        },
      });

      expect(curriclumWithAttachments).toBeDefined();
      expect(curriclumWithAttachments.sa_curriclum_attachments).toHaveLength(1);
    });
  });
}); 