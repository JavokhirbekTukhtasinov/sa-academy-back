import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { GraphQLTime } from 'graphql-scalars';
import { Section } from 'src/client/sections/entities/section.entity';
import { CurriclumAttachment } from './curriclum-attachment.entity';


export enum CurriclumTypes {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
  QUIZ = 'QUIZ',
}

registerEnumType(CurriclumTypes, {
  name: 'CurriclumTypes',
});

@ObjectType()
export class Curriclum {
  @Field(() => Int, { nullable: false })
  id: number;

  @Field(() => GraphQLTime, { nullable: false })
  created_at: Date;

  @Field(() => Int, { nullable: true })
  section_id?: number;

  @Field(() => CurriclumTypes, { nullable: true })
  type?: CurriclumTypes;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  vide_link?: string;

  @Field(() => String, { nullable: true })
  article?: string;

  @Field(() => Section, { nullable: true })
  sa_sections?: Section;

  @Field(() => [CurriclumAttachment], { nullable: true })
  sa_curriclum_attachments?: CurriclumAttachment[];
}
