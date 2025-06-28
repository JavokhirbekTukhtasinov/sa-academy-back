import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { CourseLevelTarget } from '../entities/course.entity';

@InputType()
export class UpdateCourseInput {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  course_name?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  subtitle?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  what_student_learn?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  requirements?: string;

  @IsOptional()
  @IsString()
  @IsEnum(CourseLevelTarget, { message: 'Invalid course level target' })
  @Field(() => CourseLevelTarget, { nullable: true })
  course_target_level?: CourseLevelTarget;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  real_price?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  sale_price?: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => GraphQLUpload, { nullable: true })
  thumbnail?: Promise<FileUpload>;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  category_id?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  sub_category_id?: number;

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
  status?: string;
}
