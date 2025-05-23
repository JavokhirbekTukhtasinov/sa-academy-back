import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { Upload } from 'src/scalers/upload.scaler'; // your custom Upload scalar

import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCourseInput {

  @IsNotEmpty({message: 'Please enter a course name'})
  @Field(() => String, { nullable: true })
  course_name?: string;

  @Field(() => String, { nullable: true })
  real_price?: string;

  @Field(() => String, { nullable: true })
  sale_price?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true, description: 'Teacher ID as stringified BigInt' })
  teacher_id: number;

  @Field(() => Int, { nullable: true, description: 'Optional user ID as stringified BigInt' })
  user_id?: number;

  @Field(() => GraphQLUpload, { nullable: false, description: 'Thumbnail image file' })
  thumbnail?: Promise<FileUpload>;

  @Field(() => Int, { nullable: true, description: 'Academy ID as stringified BigInt' })
  academiy_id?: number;

  @Field(() => Int, { nullable: false, description: 'Course type ID as stringified BigInt' })
  course_type_id?: number;
}


@ObjectType()
export class CreateCourseResponse {
  @Field(() => String, { nullable: true })
  message?: string;


  @Field(() => Int, { nullable: false })
  course_id?: number;
}