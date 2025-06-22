import { InputType, Field, Int } from '@nestjs/graphql';
import { CurriclumTypes } from '../entities/curriclum.entity';
import { CurriclumAttachmentTypes } from '../entities/curriclum-attachment.entity';

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

  @Field(() => String, { nullable: false })
  contentType: string;

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