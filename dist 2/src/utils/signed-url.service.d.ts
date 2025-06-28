import { ConfigService } from '@nestjs/config';
import { CurriclumAttachmentTypes } from '../client/curriclum/entities/curriclum-attachment.entity';
export interface SignedUrlOptions {
    expiresIn?: number;
    contentType?: string;
    metadata?: Record<string, string>;
}
export declare class SignedUrlService {
    private configService;
    private readonly logger;
    private s3Client;
    private bucketName;
    constructor(configService: ConfigService);
    generateVideoSignedUrl(videoUrl: string, options?: SignedUrlOptions): Promise<string>;
    generateVideoUploadSignedUrl(fileName: string, contentType: string, options?: SignedUrlOptions): Promise<string>;
    generateAttachmentSignedUrl(attachmentUrl: string, attachmentType: CurriclumAttachmentTypes, options?: SignedUrlOptions): Promise<string>;
    generateAttachmentUploadSignedUrl(fileName: string, contentType: string, attachmentType: CurriclumAttachmentTypes, options?: SignedUrlOptions): Promise<string>;
    generateCurriclumSignedUrls(curriclum: any): Promise<any>;
    generateMultipleCurriclumsSignedUrls(curriclums: any[]): Promise<any[]>;
    private extractKeyFromUrl;
    validateUrlAccess(url: string): Promise<boolean>;
    getFileMetadata(url: string): Promise<any>;
    generateCourseThumbnailUploadSignedUrl(fileName: string, contentType: string, options?: SignedUrlOptions): Promise<string>;
    generateCourseThumbnailSignedUrl(thumbnailUrl: string, options?: SignedUrlOptions): Promise<string>;
}
