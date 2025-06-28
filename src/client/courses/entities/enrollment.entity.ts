import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Course } from './course.entity';
import { User } from 'src/client/users/entities/user.entity';

@ObjectType()
export class UserEnrollment {
  @Field(() => Int)
  id: number;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Int, { nullable: true })
  course_id?: number;

  @Field(() => Int, { nullable: true })
  user_id?: number;

  @Field(() => Date, { nullable: true })
  expires_at?: Date;

  @Field(() => Course, { nullable: true })
  sa_courses?: Course;

  @Field(() => User, { nullable: true })
  sa_users?: User;
}
