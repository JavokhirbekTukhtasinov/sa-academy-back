import { InputType, Field, Int } from '@nestjs/graphql';
import { CurriclumAttachmentTypes } from '../entities/curriclum-attachment.entity';

@InputType()
export class CreateCurriclumAttachmentInput {
  @Field(() => Int, { nullable: false })
  curriclum_id?: number;

  @Field(() => CurriclumAttachmentTypes, { nullable: true })
  type?: CurriclumAttachmentTypes;

  @Field(() => String, { nullable: true })
  link_url?: string;

  @Field(() => String, { nullable: true })
  name?: string;
} 