import { CreateCurriclumAttachmentInput } from './create-curriclum-attachment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCurriclumAttachmentInput extends PartialType(CreateCurriclumAttachmentInput) {
  @Field(() => Int, { nullable: false })
  id: number;
} 