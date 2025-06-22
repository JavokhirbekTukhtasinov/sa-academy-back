import { Test, TestingModule } from '@nestjs/testing';
import { CurriclumResolver } from './curriclum.resolver';
import { CurriclumService } from './curriclum.service';
import { CreateCurriclumInput } from './dto/create-curriclum.input';
import { UpdateCurriclumInput } from './dto/update-curriclum.input';
import { CreateCurriclumAttachmentInput } from './dto/create-curriclum-attachment.input';
import { UpdateCurriclumAttachmentInput } from './dto/update-curriclum-attachment.input';
import { Curriclum } from './entities/curriclum.entity';
import { CurriclumAttachment } from './entities/curriclum-attachment.entity';
import { CurriclumTypes } from './entities/curriclum.entity';
import { CurriclumAttachmentTypes } from './entities/curriclum-attachment.entity';

describe('CurriclumResolver', () => {
  let resolver: CurriclumResolver;
  let curriclumService: CurriclumService;

  const mockCurriclum: Curriclum = {
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

  const mockAttachment: CurriclumAttachment = {
    id: 1,
    created_at: new Date(),
    type: CurriclumAttachmentTypes.EXTERNAL_LINK,
    link_url: 'https://example.com/link',
    name: 'Test Attachment',
    curriclum_id: 1,
  };

  const mockCurriclumService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findBySectionId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createAttachment: jest.fn(),
    findAttachmentsByCurriclumId: jest.fn(),
    updateAttachment: jest.fn(),
    removeAttachment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurriclumResolver,
        {
          provide: CurriclumService,
          useValue: mockCurriclumService,
        },
      ],
    }).compile();

    resolver = module.get<CurriclumResolver>(CurriclumResolver);
    curriclumService = module.get<CurriclumService>(CurriclumService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createCurriclum', () => {
    const createCurriclumInput: CreateCurriclumInput = {
      section_id: 1,
      type: CurriclumTypes.VIDEO,
      title: 'Test Curriclum',
      description: 'Test Description',
      vide_link: 'https://example.com/video',
    };

    it('should create a new curriclum', async () => {
      mockCurriclumService.create.mockResolvedValue(mockCurriclum);

      const result = await resolver.createCurriclum(createCurriclumInput);

      expect(mockCurriclumService.create).toHaveBeenCalledWith(createCurriclumInput);
      expect(result).toEqual(mockCurriclum);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockCurriclumService.create.mockRejectedValue(error);

      await expect(
        resolver.createCurriclum(createCurriclumInput),
      ).rejects.toThrow('Service error');
    });
  });

  describe('findAll', () => {
    it('should return all curriclums', async () => {
      const mockCurriclums = [mockCurriclum];
      mockCurriclumService.findAll.mockResolvedValue(mockCurriclums);

      const result = await resolver.findAll();

      expect(mockCurriclumService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCurriclums);
    });

    it('should return empty array when no curriclums found', async () => {
      mockCurriclumService.findAll.mockResolvedValue([]);

      const result = await resolver.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a curriclum by id', async () => {
      mockCurriclumService.findOne.mockResolvedValue(mockCurriclum);

      const result = await resolver.findOne(1);

      expect(mockCurriclumService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCurriclum);
    });

    it('should return null when curriclum not found', async () => {
      mockCurriclumService.findOne.mockResolvedValue(null);

      const result = await resolver.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findBySectionId', () => {
    it('should return curriclums by section id', async () => {
      const mockCurriclums = [mockCurriclum];
      mockCurriclumService.findBySectionId.mockResolvedValue(mockCurriclums);

      const result = await resolver.findBySectionId(1);

      expect(mockCurriclumService.findBySectionId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCurriclums);
    });

    it('should return empty array when no curriclums found for section', async () => {
      mockCurriclumService.findBySectionId.mockResolvedValue([]);

      const result = await resolver.findBySectionId(1);

      expect(result).toEqual([]);
    });
  });

  describe('updateCurriclum', () => {
    const updateCurriclumInput: UpdateCurriclumInput = {
      id: 1,
      title: 'Updated Curriclum',
      description: 'Updated Description',
    };

    it('should update a curriclum', async () => {
      const updatedCurriclum = { ...mockCurriclum, title: 'Updated Curriclum' };
      mockCurriclumService.update.mockResolvedValue(updatedCurriclum);

      const result = await resolver.updateCurriclum(updateCurriclumInput);

      expect(mockCurriclumService.update).toHaveBeenCalledWith(1, updateCurriclumInput);
      expect(result).toEqual(updatedCurriclum);
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      mockCurriclumService.update.mockRejectedValue(error);

      await expect(
        resolver.updateCurriclum(updateCurriclumInput),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('removeCurriclum', () => {
    it('should remove a curriclum', async () => {
      mockCurriclumService.remove.mockResolvedValue(mockCurriclum);

      const result = await resolver.removeCurriclum(1);

      expect(mockCurriclumService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCurriclum);
    });

    it('should handle removal errors', async () => {
      const error = new Error('Removal failed');
      mockCurriclumService.remove.mockRejectedValue(error);

      await expect(
        resolver.removeCurriclum(1),
      ).rejects.toThrow('Removal failed');
    });
  });

  describe('createCurriclumAttachment', () => {
    const createAttachmentInput: CreateCurriclumAttachmentInput = {
      type: CurriclumAttachmentTypes.EXTERNAL_LINK,
      link_url: 'https://example.com/link',
      name: 'Test Attachment',
      curriclum_id: 1,
    };

    it('should create a new attachment', async () => {
      mockCurriclumService.createAttachment.mockResolvedValue(mockAttachment);

      const result = await resolver.createCurriclumAttachment(createAttachmentInput);

      expect(mockCurriclumService.createAttachment).toHaveBeenCalledWith(
        createAttachmentInput,
      );
      expect(result).toEqual(mockAttachment);
    });

    it('should handle attachment creation errors', async () => {
      const error = new Error('Attachment creation failed');
      mockCurriclumService.createAttachment.mockRejectedValue(error);

      await expect(
        resolver.createCurriclumAttachment(createAttachmentInput),
      ).rejects.toThrow('Attachment creation failed');
    });
  });

  describe('findAttachmentsByCurriclumId', () => {
    it('should return attachments by curriclum id', async () => {
      const mockAttachments = [mockAttachment];
      mockCurriclumService.findAttachmentsByCurriclumId.mockResolvedValue(
        mockAttachments,
      );

      const result = await resolver.findAttachmentsByCurriclumId(1);

      expect(mockCurriclumService.findAttachmentsByCurriclumId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAttachments);
    });

    it('should return empty array when no attachments found', async () => {
      mockCurriclumService.findAttachmentsByCurriclumId.mockResolvedValue([]);

      const result = await resolver.findAttachmentsByCurriclumId(1);

      expect(result).toEqual([]);
    });
  });

  describe('updateCurriclumAttachment', () => {
    const updateAttachmentInput: UpdateCurriclumAttachmentInput = {
      id: 1,
      name: 'Updated Attachment',
    };

    it('should update an attachment', async () => {
      const updatedAttachment = { ...mockAttachment, name: 'Updated Attachment' };
      mockCurriclumService.updateAttachment.mockResolvedValue(updatedAttachment);

      const result = await resolver.updateCurriclumAttachment(updateAttachmentInput);

      expect(mockCurriclumService.updateAttachment).toHaveBeenCalledWith(
        1,
        updateAttachmentInput,
      );
      expect(result).toEqual(updatedAttachment);
    });

    it('should handle attachment update errors', async () => {
      const error = new Error('Attachment update failed');
      mockCurriclumService.updateAttachment.mockRejectedValue(error);

      await expect(
        resolver.updateCurriclumAttachment(updateAttachmentInput),
      ).rejects.toThrow('Attachment update failed');
    });
  });

  describe('removeCurriclumAttachment', () => {
    it('should remove an attachment', async () => {
      mockCurriclumService.removeAttachment.mockResolvedValue(mockAttachment);

      const result = await resolver.removeCurriclumAttachment(1);

      expect(mockCurriclumService.removeAttachment).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAttachment);
    });

    it('should handle attachment removal errors', async () => {
      const error = new Error('Attachment removal failed');
      mockCurriclumService.removeAttachment.mockRejectedValue(error);

      await expect(
        resolver.removeCurriclumAttachment(1),
      ).rejects.toThrow('Attachment removal failed');
    });
  });
});
