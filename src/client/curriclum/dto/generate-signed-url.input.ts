import { InputType, Field, Int } from '@nestjs/graphql';
import { CurriclumTypes } from '../entities/curriclum.entity';
import { CurriclumAttachmentTypes } from '../entities/curriclum-attachment.entity';
import { registerEnumType } from '@nestjs/graphql';

export enum CurriclumFileType {
  VIDEO = 'VIDEO',
  ATTACHMENT = 'ATTACHMENT',
}

export enum VideoContentType {
  MP4 = 'video/mp4',
  WEBM = 'video/webm',
  OGG = 'video/ogg',
}

registerEnumType(CurriclumFileType, {
  name: 'CurriclumFileType',
});

registerEnumType(VideoContentType, {
  name: 'VideoContentType',
});

@InputType()
export class GenerateVideoSignedUrlInput {
  @Field(() => String, { nullable: false })
  videoUrl: string;

  @Field(() => Int, { nullable: true, defaultValue: 3600 })
  expiresIn?: number; // seconds
}

@InputType()
export class GenerateVideoUploadSignedUrlInput {
  @Field(() => String, { nullable: false })
  fileName: string;

  @Field(() => VideoContentType, { nullable: false })
  contentType: VideoContentType;

  @Field(() => Int, { nullable: true, defaultValue: 3600 })
  expiresIn?: number;

  @Field(() => String, { nullable: true })
  metadata?: string; // JSON string
}

@InputType()
export class GenerateAttachmentSignedUrlInput {
  @Field(() => String, { nullable: false })
  attachmentUrl: string;

  @Field(() => CurriclumAttachmentTypes, { nullable: false })
  attachmentType: CurriclumAttachmentTypes;

  @Field(() => Int, { nullable: true, defaultValue: 3600 })
  expiresIn?: number;
}

@InputType()
export class GenerateAttachmentUploadSignedUrlInput {
  @Field(() => String, { nullable: false })
  fileName: string;

  @Field(() => String, { nullable: false })
  contentType: string;

  @Field(() => CurriclumAttachmentTypes, { nullable: false })
  attachmentType: CurriclumAttachmentTypes;

  @Field(() => Int, { nullable: true, defaultValue: 3600 })
  expiresIn?: number;

  @Field(() => String, { nullable: true })
  metadata?: string; // JSON string
}

@InputType()
export class GenerateCurriclumSignedUrlInput {
  @Field(() => CurriclumFileType, { nullable: false })
  fileType: CurriclumFileType;

  @Field(() => String, { nullable: true })
  fileUrl?: string;

  @Field(() => String, { nullable: true })
  fileName?: string;

  /**
   * For VIDEO, must be a value from VideoContentType.
   * For ATTACHMENT, can be any valid MIME type string (e.g., application/pdf, image/png, etc.)
   */
  @Field(() => String, { nullable: true })
  contentType?: string;

  @Field(() => String, { nullable: true })
  metadata?: string;

  @Field(() => Int, { nullable: true, defaultValue: 3600 })
  expiresIn?: number;
} 