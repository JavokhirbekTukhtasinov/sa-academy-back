import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SignedUrlResponse {
  @Field(() => String, { nullable: false })
  signedUrl: string;

  @Field(() => String, { nullable: true })
  key?: string;

  @Field(() => Int, { nullable: true })
  expiresIn?: number;

  @Field(() => String, { nullable: true })
  contentType?: string;
}

@ObjectType()
export class VideoSignedUrlResponse extends SignedUrlResponse {
  @Field(() => String, { nullable: true })
  originalUrl?: string;
}

@ObjectType()
export class AttachmentSignedUrlResponse extends SignedUrlResponse {
  @Field(() => String, { nullable: true })
  originalUrl?: string;

  @Field(() => String, { nullable: true })
  fileName?: string;
}

@ObjectType()
export class CurriclumWithSignedUrlsResponse {
  @Field(() => Int, { nullable: false })
  id: number;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  vide_link?: string;

  @Field(() => String, { nullable: true })
  signedVideoUrl?: string;

  @Field(() => [AttachmentSignedUrlResponse], { nullable: true })
  signedAttachments?: AttachmentSignedUrlResponse[];
} 