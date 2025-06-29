import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { Upload } from 'src/scalers/upload.scaler'; // your custom Upload scalar

import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

@InputType()
export class CreateCourseInput {

  @IsNotEmpty({message: 'Please enter a course name'})
  @IsString()
  @Field(() => String)
  course_name: string;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  real_price?: number;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  sale_price?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => GraphQLUpload, { nullable: true, description: 'Thumbnail image file' })
  thumbnail?: Promise<FileUpload>;
  
  @IsOptional()
  @Field(() => Int, { nullable: true })
  category_id?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true, description: 'Academy ID' })
  academiy_id?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true, description: 'Teacher ID' })
  teacher_id?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true, description: 'User ID' })
  user_id?: number;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  is_live?: boolean;

  @IsOptional()
  @Field(() => Int, { nullable: true, description: 'Parent Course ID' })
  parent_id?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  what_student_learn?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  requirements?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  course_target_level?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  subtitle?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  status?: string;
}


@ObjectType()
export class CreateCourseResponse {
  @Field(() => String, { nullable: true })
  message?: string;


  @Field(() => Int, { nullable: false })
  course_id?: number;
}