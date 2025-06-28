import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { GraphQLTime } from 'graphql-scalars';
import { CourseStatus } from 'src/client/courses/entities/course.entity';
import { CurriclumAttachment } from 'src/client/curriclum/entities/curriclum-attachment.entity';
import { Curriclum } from 'src/client/curriclum/entities/curriclum.entity';

@ObjectType()
export class Section {
  @Field(() => Int, { nullable: false })
  id: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => GraphQLTime, { nullable: false })
  created_at: Date;

  @Field(() => GraphQLTime, { nullable: true })
  updated_at?: Date;

  @Field(() => Number, { nullable: true })
  order_num?: number;

  @Field(() => CourseStatus, { nullable: true })
  status?: CourseStatus;

  @Field(() => Int, { nullable: true })
  course_id?: number;

  @Field(() => [Curriclum], { nullable: true })
  sa_curriclums?: Curriclum[];
}