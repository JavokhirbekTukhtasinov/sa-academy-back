import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsDateString } from 'class-validator';

@InputType()
export class EnrollCourseInput {
  @Field(() => Int)
  @IsInt()
  courseId: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
} 