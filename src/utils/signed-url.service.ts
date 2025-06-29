import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { CurriclumTypes } from '../client/curriclum/entities/curriclum.entity';
import { CurriclumAttachmentTypes } from '../client/curriclum/entities/curriclum-attachment.entity';

export interface SignedUrlOptions {
  expiresIn?: number; // seconds
  contentType?: string;
  metadata?: Record<string, string>;
}

@Injectable()
export class SignedUrlService {
  private readonly logger = new Logger(SignedUrlService.name);
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('S3_BUCKET') || 'sa-academy-media';    
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
      endpoint: this.configService.get<string>('AWS_S3_ENDPOINT') || 'http://localhost:4566',  
      forcePathStyle: true,
    });
  }

  /**
   * Generate a signed URL for viewing/downloading a curriclum video
   */

  async generateVideoSignedUrl(
    videoUrl: string,
    options: SignedUrlOptions = {}
  ): Promise<string> {
    try {
      const { expiresIn = 3600 } = options; // Default 1 hour
      
      // Extract key from video URL
      const key = this.extractKeyFromUrl(videoUrl);
      
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      this.logger.log(`Generated signed URL for video: ${key}`);
      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL for video: ${error.message}`, error.stack);
      throw new Error('Failed to generate video signed URL');
    }
  }

  /**
   * Generate a signed URL for uploading a curriclum video
   */
  async generateVideoUploadSignedUrl(
    fileName: string,
    contentType: string,
    options: SignedUrlOptions = {}
  ): Promise<{signedUrl: string, file_url: string}> {
    try {
      const { expiresIn = 3600, metadata = {} } = options;
      
      const key = `curriclums/videos/${Date.now()}-${fileName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ACL: 'public-read',
        ContentType: contentType || 'video/mp4',
        Metadata: {
          ...metadata,
          uploadedAt: new Date().toISOString(),
          type: 'curriclum-video',
        },
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      this.logger.log(`Generated upload signed URL for video: ${key}`);
      return {signedUrl, file_url: key};
    } catch (error) {
      this.logger.error(`Failed to generate upload signed URL for video: ${error.message}`, error.stack);
      throw new Error('Failed to generate video upload signed URL');
    }
  }

  /**
   * Generate a signed URL for viewing/downloading an attachment
   */
  async generateAttachmentSignedUrl(
    attachmentUrl: string,
    attachmentType: CurriclumAttachmentTypes,
    options: SignedUrlOptions = {}
  ): Promise<string> {
    try {
      const { expiresIn = 3600 } = options;
      
      // For external links, return the original URL
      if (attachmentType === CurriclumAttachmentTypes.EXTERNAL_LINK) {
        return attachmentUrl;
      }
      
      // For files, generate signed URL
      const key = this.extractKeyFromUrl(attachmentUrl);
      
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      this.logger.log(`Generated signed URL for attachment: ${key}`);
      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL for attachment: ${error.message}`, error.stack);
      throw new Error('Failed to generate attachment signed URL');
    }
  }

  /**
   * Generate a signed URL for uploading an attachment
   */
  async generateAttachmentUploadSignedUrl(
    fileName: string,
    contentType: string,
    attachmentType: CurriclumAttachmentTypes,
    options: SignedUrlOptions = {}
  ): Promise<string> {
    try {
      const { expiresIn = 3600, metadata = {} } = options;
      
      const key = `curriclums/attachments/${Date.now()}-${fileName}`;
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        Metadata: {
          ...metadata,
          uploadedAt: new Date().toISOString(),
          type: 'curriclum-attachment',
          attachmentType: attachmentType,
        },
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      this.logger.log(`Generated upload signed URL for attachment: ${key}`);
      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate upload signed URL for attachment: ${error.message}`, error.stack);
      throw new Error('Failed to generate attachment upload signed URL');
    }
  }

  /**
   * Generate signed URLs for a curriclum with all its attachments
   */
  async generateCurriclumSignedUrls(curriclum: any): Promise<any> {
    try {
      const result = {
        ...curriclum,
        signedVideoUrl: null,
        signedAttachments: [],
      };

      // Generate signed URL for video if exists
      if (curriclum.vide_link && curriclum.type === CurriclumTypes.VIDEO) {
        result.signedVideoUrl = await this.generateVideoSignedUrl(curriclum.vide_link);
      }

      // Generate signed URLs for attachments
      if (curriclum.sa_curriclum_attachments && curriclum.sa_curriclum_attachments.length > 0) {
        result.signedAttachments = await Promise.all(
          curriclum.sa_curriclum_attachments.map(async (attachment: any) => ({
            ...attachment,
            signedUrl: await this.generateAttachmentSignedUrl(
              attachment.link_url,
              attachment.type
            ),
          }))
        );
      }

      return result;
    } catch (error) {
      this.logger.error(`Failed to generate curriclum signed URLs: ${error.message}`, error.stack);
      throw new Error('Failed to generate curriclum signed URLs');
    }
  }

  /**
   * Generate signed URLs for multiple curriclums
   */
  async generateMultipleCurriclumsSignedUrls(curriclums: any[]): Promise<any[]> {
    try {
      return await Promise.all(
        curriclums.map(curriclum => this.generateCurriclumSignedUrls(curriclum))
      );
    } catch (error) {
      this.logger.error(`Failed to generate multiple curriclums signed URLs: ${error.message}`, error.stack);
      throw new Error('Failed to generate multiple curriclums signed URLs');
    }
  }

  /**
   * Extract S3 key from URL
   */
  private extractKeyFromUrl(url: string): string {
    try {
      // Handle different URL formats
      if (url.startsWith('https://')) {
        const urlObj = new URL(url);
        // Remove leading slash if present
        return urlObj.pathname.replace(/^\//, '');
      }
      
      // If it's already a key
      return url;
    } catch (error) {
      this.logger.error(`Failed to extract key from URL: ${url}`, error.stack);
      throw new Error('Invalid URL format');
    }
  }

  /**
   * Validate if a URL is accessible
   */
  async validateUrlAccess(url: string): Promise<boolean> {
    try {
      const key = this.extractKeyFromUrl(url);
      
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      this.logger.warn(`URL access validation failed: ${url}`, error.message);
      return false;
    }
  }

  /**
   * Get file metadata from S3
   */
  async getFileMetadata(url: string): Promise<any> {
    try {
      const key = this.extractKeyFromUrl(url);
      
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      
      return {
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified,
        etag: response.ETag,
        metadata: response.Metadata,
      };
    } catch (error) {
      this.logger.error(`Failed to get file metadata: ${error.message}`, error.stack);
      throw new Error('Failed to get file metadata');
    }
  }

  /**
   * Generate a signed URL for uploading a course thumbnail
   */
  async generateCourseThumbnailUploadSignedUrl(
    fileName: string,
    contentType: string,
    options: SignedUrlOptions = {}
  ): Promise<string> {
    try {
      const { expiresIn = 3600, metadata = {} } = options;
      
      const key = `course-thumbnails/${Date.now()}-${fileName}`;
      
      const command = new PutObjectCommand({
        Bucket: 'sa-academy-thumbnails', // Use the thumbnails bucket
        Key: key,
        ContentType: contentType,
        Metadata: {
          ...metadata,
          uploadedAt: new Date().toISOString(),
          type: 'course-thumbnail',
        },
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      this.logger.log(`Generated upload signed URL for course thumbnail: ${key}`);
      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate upload signed URL for course thumbnail: ${error.message}`, error.stack);
      throw new Error('Failed to generate course thumbnail upload signed URL');
    }
  }

  /**
   * Generate a signed URL for viewing/downloading a course thumbnail
   */
  async generateCourseThumbnailSignedUrl(
    thumbnailUrl: string,
    options: SignedUrlOptions = {}
  ): Promise<string> {
    try {
      const { expiresIn = 3600 } = options;
      
      // Extract key from thumbnail URL
      const key = this.extractKeyFromUrl(thumbnailUrl);
      
      const command = new GetObjectCommand({
        Bucket: 'sa-academy-thumbnails', // Use the thumbnails bucket
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      this.logger.log(`Generated signed URL for course thumbnail: ${key}`);
      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL for course thumbnail: ${error.message}`, error.stack);
      throw new Error('Failed to generate course thumbnail signed URL');
    }
  }
} 