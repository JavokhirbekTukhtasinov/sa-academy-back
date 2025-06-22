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
  @IsString()
  @Field(() => String, { nullable: true })
  real_price?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  sale_price?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => GraphQLUpload, { nullable: true, description: 'Thumbnail image file' })
  thumbnail?: Promise<FileUpload>;
  
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  category_id: number;

  // @Field(() => Int, { nullable: true, description: 'Academy ID as stringified BigInt' })
  // academiy_id?: number;

  // @Field(() => Int, { nullable: false, description: 'Course type ID as stringified BigInt' })
  // course_type_id?: number;
}


@ObjectType()
export class CreateCourseResponse {
  @Field(() => String, { nullable: true })
  message?: string;


  @Field(() => Int, { nullable: false })
  course_id?: number;
}