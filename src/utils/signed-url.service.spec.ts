import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SignedUrlService } from './signed-url.service';
import { CurriclumTypes } from '../client/curriclum/entities/curriclum.entity';
import { CurriclumAttachmentTypes } from '../client/curriclum/entities/curriclum-attachment.entity';

// Mock S3Client
const mockS3Client = {
  send: jest.fn(),
};

// Mock S3Client constructor
const mockS3ClientConstructor = jest.fn().mockImplementation(() => mockS3Client);

// Mock AWS SDK
jest.mock('@aws-sdk/s3-request-presigner');
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: mockS3ClientConstructor,
  GetObjectCommand: jest.fn(),
  PutObjectCommand: jest.fn(),
}));

const mockGetSignedUrl = require('@aws-sdk/s3-request-presigner').getSignedUrl;

describe('SignedUrlService', () => {
  let service: SignedUrlService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        AWS_S3_BUCKET_NAME: 'test-bucket',
        AWS_REGION: 'us-east-1',
        AWS_ACCESS_KEY_ID: 'test-access-key',
        AWS_SECRET_ACCESS_KEY: 'test-secret-key',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignedUrlService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SignedUrlService>(SignedUrlService);
    configService = module.get<ConfigService>(ConfigService);

    // Reset mocks
    jest.clearAllMocks();
    mockGetSignedUrl.mockResolvedValue('https://test-signed-url.com');
    mockS3Client.send.mockResolvedValue({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateVideoSignedUrl', () => {
    it('should generate a signed URL for video', async () => {
      const videoUrl = 'https://test-bucket.s3.amazonaws.com/videos/test-video.mp4';
      const options = { expiresIn: 7200 };

      const result = await service.generateVideoSignedUrl(videoUrl, options);

      expect(mockGetSignedUrl).toHaveBeenCalled();
      expect(result).toBe('https://test-signed-url.com');
    });

    it('should handle errors gracefully', async () => {
      const videoUrl = 'invalid-url';
      mockGetSignedUrl.mockRejectedValue(new Error('S3 error'));

      await expect(service.generateVideoSignedUrl(videoUrl)).rejects.toThrow(
        'Failed to generate video signed URL'
      );
    });
  });

  describe('generateVideoUploadSignedUrl', () => {
    it('should generate an upload signed URL for video', async () => {
      const fileName = 'test-video.mp4';
      const contentType = 'video/mp4';
      const options = { expiresIn: 3600, metadata: { userId: '123' } };

      const result = await service.generateVideoUploadSignedUrl(fileName, contentType, options);

      expect(mockGetSignedUrl).toHaveBeenCalled();
      expect(result).toBe('https://test-signed-url.com');
    });
  });

  describe('generateAttachmentSignedUrl', () => {
    it('should return original URL for external links', async () => {
      const attachmentUrl = 'https://external-site.com/file.pdf';
      const attachmentType = CurriclumAttachmentTypes.EXTERNAL_LINK;

      const result = await service.generateAttachmentSignedUrl(attachmentUrl, attachmentType);

      expect(result).toBe(attachmentUrl);
      expect(mockGetSignedUrl).not.toHaveBeenCalled();
    });

    it('should generate signed URL for file attachments', async () => {
      const attachmentUrl = 'https://test-bucket.s3.amazonaws.com/attachments/file.pdf';
      const attachmentType = CurriclumAttachmentTypes.FILE;

      const result = await service.generateAttachmentSignedUrl(attachmentUrl, attachmentType);

      expect(mockGetSignedUrl).toHaveBeenCalled();
      expect(result).toBe('https://test-signed-url.com');
    });
  });

  describe('generateAttachmentUploadSignedUrl', () => {
    it('should generate an upload signed URL for attachment', async () => {
      const fileName = 'test-file.pdf';
      const contentType = 'application/pdf';
      const attachmentType = CurriclumAttachmentTypes.FILE;
      const options = { expiresIn: 3600 };

      const result = await service.generateAttachmentUploadSignedUrl(
        fileName,
        contentType,
        attachmentType,
        options
      );

      expect(mockGetSignedUrl).toHaveBeenCalled();
      expect(result).toBe('https://test-signed-url.com');
    });
  });

  describe('generateCurriclumSignedUrls', () => {
    it('should generate signed URLs for curriclum with video and attachments', async () => {
      const curriclum = {
        id: 1,
        title: 'Test Curriclum',
        type: CurriclumTypes.VIDEO,
        vide_link: 'https://test-bucket.s3.amazonaws.com/videos/test-video.mp4',
        sa_curriclum_attachments: [
          {
            id: 1,
            type: CurriclumAttachmentTypes.FILE,
            link_url: 'https://test-bucket.s3.amazonaws.com/attachments/file.pdf',
          },
          {
            id: 2,
            type: CurriclumAttachmentTypes.EXTERNAL_LINK,
            link_url: 'https://external-site.com/link',
          },
        ],
      };

      const result = await service.generateCurriclumSignedUrls(curriclum);

      expect(result.signedVideoUrl).toBe('https://test-signed-url.com');
      expect(result.signedAttachments).toHaveLength(2);
      expect(result.signedAttachments[0].signedUrl).toBe('https://test-signed-url.com');
      expect(result.signedAttachments[1].signedUrl).toBe('https://external-site.com/link');
    });

    it('should handle curriclum without video or attachments', async () => {
      const curriclum = {
        id: 1,
        title: 'Test Curriclum',
        type: CurriclumTypes.ARTICLE,
        vide_link: null,
        sa_curriclum_attachments: [],
      };

      const result = await service.generateCurriclumSignedUrls(curriclum);

      expect(result.signedVideoUrl).toBeNull();
      expect(result.signedAttachments).toHaveLength(0);
    });
  });

  describe('generateMultipleCurriclumsSignedUrls', () => {
    it('should generate signed URLs for multiple curriclums', async () => {
      const curriclums = [
        {
          id: 1,
          type: CurriclumTypes.VIDEO,
          vide_link: 'https://test-bucket.s3.amazonaws.com/video1.mp4',
          sa_curriclum_attachments: [],
        },
        {
          id: 2,
          type: CurriclumTypes.ARTICLE,
          vide_link: null,
          sa_curriclum_attachments: [],
        },
      ];

      const result = await service.generateMultipleCurriclumsSignedUrls(curriclums);

      expect(result).toHaveLength(2);
      expect(result[0].signedVideoUrl).toBe('https://test-signed-url.com');
      expect(result[1].signedVideoUrl).toBeNull();
    });
  });

  describe('validateUrlAccess', () => {
    it('should return true for accessible URL', async () => {
      mockS3Client.send.mockResolvedValue({});

      const result = await service.validateUrlAccess('https://test-bucket.s3.amazonaws.com/file.pdf');

      expect(result).toBe(true);
    });

    it('should return false for inaccessible URL', async () => {
      mockS3Client.send.mockRejectedValue(new Error('Access denied'));

      const result = await service.validateUrlAccess('https://test-bucket.s3.amazonaws.com/file.pdf');

      expect(result).toBe(false);
    });
  });

  describe('getFileMetadata', () => {
    it('should return file metadata', async () => {
      const mockResponse = {
        ContentType: 'video/mp4',
        ContentLength: 1024000,
        LastModified: new Date(),
        ETag: 'test-etag',
        Metadata: { userId: '123' },
      };

      mockS3Client.send.mockResolvedValue(mockResponse);

      const result = await service.getFileMetadata('https://test-bucket.s3.amazonaws.com/file.mp4');

      expect(result).toEqual(mockResponse);
    });

    it('should handle metadata retrieval errors', async () => {
      mockS3Client.send.mockRejectedValue(new Error('File not found'));

      await expect(service.getFileMetadata('invalid-url')).rejects.toThrow(
        'Failed to get file metadata'
      );
    });
  });

  describe('extractKeyFromUrl', () => {
    it('should extract key from S3 URL', () => {
      const url = 'https://test-bucket.s3.amazonaws.com/videos/test-video.mp4';
      const key = (service as any).extractKeyFromUrl(url);
      expect(key).toBe('videos/test-video.mp4');
    });

    it('should handle URL with leading slash', () => {
      const url = 'https://test-bucket.s3.amazonaws.com/videos/test-video.mp4';
      const key = (service as any).extractKeyFromUrl(url);
      expect(key).toBe('videos/test-video.mp4');
    });

    it('should return key if already a key', () => {
      const key = 'videos/test-video.mp4';
      const result = (service as any).extractKeyFromUrl(key);
      expect(result).toBe(key);
    });

    it('should handle invalid URL format', () => {
      // Mock URL constructor to throw error
      const originalURL = global.URL;
      global.URL = jest.fn().mockImplementation(() => {
        throw new Error('Invalid URL');
      }) as any;

      expect(() => (service as any).extractKeyFromUrl('invalid-url')).toThrow('Invalid URL format');

      // Restore original URL
      global.URL = originalURL;
    });
  });
}); 