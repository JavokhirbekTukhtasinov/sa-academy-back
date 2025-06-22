import { InputType, Field, Int } from '@nestjs/graphql';
import { CourseStatus } from 'src/client/courses/entities/course.entity';

@InputType()
export class CreateSectionInput {
  @Field(() => Int, { nullable: false })
  course_id: number;

  @Field(() => String, { nullable: false })
  name?: string;
} 