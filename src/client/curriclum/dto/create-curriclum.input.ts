import { InputType, Field, Int } from '@nestjs/graphql';
import { CurriclumTypes } from '../entities/curriclum.entity';
import { CreateCurriclumAttachmentInput } from './create-curriclum-attachment.input';

@InputType()
export class CreateCurriclumInput {
  @Field(() => Int, { nullable: true })
  section_id?: number;

  @Field(() => CurriclumTypes, { nullable: true })
  type?: CurriclumTypes;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  video_link?: string;

  @Field(() => String, { nullable: true })
  article?: string;

  @Field(() => [CreateCurriclumAttachmentInput], { nullable: true })
  sa_curriclum_attachments?: CreateCurriclumAttachmentInput[];
}