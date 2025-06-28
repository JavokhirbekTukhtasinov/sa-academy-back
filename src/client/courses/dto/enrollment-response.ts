import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class EnrollmentResponse {
  @Field(() => String)
  message: string;

  @Field(() => Int)
  enrollmentId: number;

  @Field(() => Int)
  courseId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Date, { nullable: true })
  expiresAt?: Date;
} 