import { Test, TestingModule } from '@nestjs/testing';
import { CurriclumService } from './curriclum.service';
import { PrismaService } from 'src/prisma.service';
import { CreateCurriclumInput } from './dto/create-curriclum.input';
import { UpdateCurriclumInput } from './dto/update-curriclum.input';
import { CreateCurriclumAttachmentInput } from './dto/create-curriclum-attachment.input';
import { UpdateCurriclumAttachmentInput } from './dto/update-curriclum-attachment.input';
import { CurriclumTypes } from './entities/curriclum.entity';
import { CurriclumAttachmentTypes } from './entities/curriclum-attachment.entity';

describe('CurriclumService', () => {
  let service: CurriclumService;
  let prismaService: PrismaService;

  const mockCurriclum = {
    id: 1,
    created_at: new Date(),
    section_id: 1,
    type: CurriclumTypes.VIDEO,
    title: 'Test Curriclum',
    description: 'Test Description',
    vide_link: 'https://example.com/video',
    article: null,
    sa_sections: null,
    sa_curriclum_attachments: [],
  };

  const mockAttachment = {
    id: 1,
    created_at: new Date(),
    type: CurriclumAttachmentTypes.EXTERNAL_LINK,
    link_url: 'https://example.com/link',
    name: 'Test Attachment',
    curriclum_id: 1,
  };

  const mockPrismaService = {
    sa_curriclums: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    sa_curriclum_attachments: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurriclumService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CurriclumService>(CurriclumService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCurriclumInput: CreateCurriclumInput = {
      section_id: 1,
      type: CurriclumTypes.VIDEO,
      title: 'Test Curriclum',
      description: 'Test Description',
      vide_link: 'https://example.com/video',
    };

    it('should create a new curriclum', async () => {
      mockPrismaService.sa_curriclums.create.mockResolvedValue(mockCurriclum);

      const result = await service.create(createCurriclumInput);

      expect(mockPrismaService.sa_curriclums.create).toHaveBeenCalledWith({
        data: createCurriclumInput,
        include: {
          sa_sections: true,
          sa_curriclum_attachments: true,
        },
      });
      expect(result).toEqual(mockCurriclum);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Database error');
      mockPrismaService.sa_curriclums.create.mockRejectedValue(error);

      await expect(service.create(createCurriclumInput)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all curriclums', async () => {
      const mockCurriclums = [mockCurriclum];
      mockPrismaService.sa_curriclums.findMany.mockResolvedValue(mockCurriclums);

      const result = await service.findAll();

      expect(mockPrismaService.sa_curriclums.findMany).toHaveBeenCalledWith({
        include: {
          sa_sections: true,
          sa_curriclum_attachments: true,
        },
      });
      expect(result).toEqual(mockCurriclums);
    });

    it('should return empty array when no curriclums found', async () => {
      mockPrismaService.sa_curriclums.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a curriclum by id', async () => {
      mockPrismaService.sa_curriclums.findUnique.mockResolvedValue(mockCurriclum);

      const result = await service.findOne(1);

      expect(mockPrismaService.sa_curriclums.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          sa_sections: true,
          sa_curriclum_attachments: true,
        },
      });
      expect(result).toEqual(mockCurriclum);
    });

    it('should return null when curriclum not found', async () => {
      mockPrismaService.sa_curriclums.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findBySectionId', () => {
    it('should return curriclums by section id ordered by created_at', async () => {
      const mockCurriclums = [mockCurriclum];
      mockPrismaService.sa_curriclums.findMany.mockResolvedValue(mockCurriclums);

      const result = await service.findBySectionId(1);

      expect(mockPrismaService.sa_curriclums.findMany).toHaveBeenCalledWith({
        where: { section_id: 1 },
        include: {
          sa_curriclum_attachments: true,
        },
        orderBy: {
          created_at: 'asc',
        },
      });
      expect(result).toEqual(mockCurriclums);
    });
  });

  describe('update', () => {
    const updateCurriclumInput: UpdateCurriclumInput = {
      id: 1,
      title: 'Updated Curriclum',
      description: 'Updated Description',
    };

    it('should update a curriclum', async () => {
      const updatedCurriclum = { ...mockCurriclum, title: 'Updated Curriclum' };
      mockPrismaService.sa_curriclums.update.mockResolvedValue(updatedCurriclum);

      const result = await service.update(1, updateCurriclumInput);

      expect(mockPrismaService.sa_curriclums.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: 'Updated Curriclum',
          description: 'Updated Description',
        },
        include: {
          sa_sections: true,
          sa_curriclum_attachments: true,
        },
      });
      expect(result).toEqual(updatedCurriclum);
    });
  });

  describe('remove', () => {
    it('should delete a curriclum', async () => {
      mockPrismaService.sa_curriclums.delete.mockResolvedValue(mockCurriclum);

      const result = await service.remove(1);

      expect(mockPrismaService.sa_curriclums.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockCurriclum);
    });
  });

  describe('createAttachment', () => {
    const createAttachmentInput: CreateCurriclumAttachmentInput = {
      type: CurriclumAttachmentTypes.EXTERNAL_LINK,
      link_url: 'https://example.com/link',
      name: 'Test Attachment',
      curriclum_id: 1,
    };

    it('should create a new attachment', async () => {
      mockPrismaService.sa_curriclum_attachments.create.mockResolvedValue(
        mockAttachment,
      );

      const result = await service.createAttachment(createAttachmentInput);

      expect(mockPrismaService.sa_curriclum_attachments.create).toHaveBeenCalledWith({
        data: createAttachmentInput,
      });
      expect(result).toEqual(mockAttachment);
    });
  });

  describe('findAttachmentsByCurriclumId', () => {
    it('should return attachments by curriclum id ordered by created_at', async () => {
      const mockAttachments = [mockAttachment];
      mockPrismaService.sa_curriclum_attachments.findMany.mockResolvedValue(
        mockAttachments,
      );

      const result = await service.findAttachmentsByCurriclumId(1);

      expect(mockPrismaService.sa_curriclum_attachments.findMany).toHaveBeenCalledWith({
        where: { curriclum_id: 1 },
        orderBy: {
          created_at: 'asc',
        },
      });
      expect(result).toEqual(mockAttachments);
    });
  });

  describe('updateAttachment', () => {
    const updateAttachmentInput: UpdateCurriclumAttachmentInput = {
      id: 1,
      name: 'Updated Attachment',
    };

    it('should update an attachment', async () => {
      const updatedAttachment = { ...mockAttachment, name: 'Updated Attachment' };
      mockPrismaService.sa_curriclum_attachments.update.mockResolvedValue(
        updatedAttachment,
      );

      const result = await service.updateAttachment(1, updateAttachmentInput);

      expect(mockPrismaService.sa_curriclum_attachments.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Updated Attachment',
        },
      });
      expect(result).toEqual(updatedAttachment);
    });
  });

  describe('removeAttachment', () => {
    it('should delete an attachment', async () => {
      mockPrismaService.sa_curriclum_attachments.delete.mockResolvedValue(
        mockAttachment,
      );

      const result = await service.removeAttachment(1);

      expect(mockPrismaService.sa_curriclum_attachments.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockAttachment);
    });
  });
});
