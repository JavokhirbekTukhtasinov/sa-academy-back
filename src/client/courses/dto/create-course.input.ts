import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { Upload } from 'src/scalers/upload.scaler'; // your custom Upload scalar

import { GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateCourseInput {
  @Field(() => String, { nullable: true })
  course_name?: string;

  @Field(() => String, { nullable: true })
  real_price?: string;

  @Field(() => String, { nullable: true })
  prev_price?: string;

  @Field(() => Int, { description: 'Teacher ID as stringified BigInt' })
  teacher_id: number;

  @Field(() => Int, { nullable: true, description: 'Optional user ID as stringified BigInt' })
  user_id?: number;

  @Field(() => GraphQLUpload, { nullable: true, description: 'Thumbnail image file' })
  thumbnail?: Promise<File>;

  @Field(() => Int, { nullable: true, description: 'Academy ID as stringified BigInt' })
  academiy_id?: number;

  @Field(() => Int, { nullable: true, description: 'Course type ID as stringified BigInt' })
  course_type_id?: number;
}




@ObjectType()
export class CreateCourseResponse {
  @Field(() => String, { nullable: true })
  message?: string;
}