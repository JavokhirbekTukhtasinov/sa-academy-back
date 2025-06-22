import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { GraphQLTime } from 'graphql-scalars';

export enum CurriclumAttachmentTypes {
  EXTERNAL_LINK = 'EXTERNAL_LINK',
  FILE = 'FILE',
}

registerEnumType(CurriclumAttachmentTypes, {
  name: 'CurriclumAttachmentTypes',
});

@ObjectType()
export class CurriclumAttachment {
  @Field(() => Int, { nullable: false })
  id: number;

  @Field(() => GraphQLTime, { nullable: false })
  created_at: Date;

  @Field(() => CurriclumAttachmentTypes, { nullable: true })
  type?: CurriclumAttachmentTypes;

  @Field(() => String, { nullable: true })
  link_url?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  curriclum_id?: number;
} 