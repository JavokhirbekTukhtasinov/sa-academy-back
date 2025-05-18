import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';
import { Course } from 'src/client/courses/entities/course.entity';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;
}



@ObjectType()
export class UserCourses {
  @Field(() => Int, {nullable: false})
  id:number

  @Field(() => GraphQLDate, {nullable: false})
  created_at: Date

  @Field(() => Int, {nullable: true})
  user_id?:number

  @Field(() => Int, {nullable: true})
  course_id  ?:number

  @Field(() => Course, {nullable: true})
  sa_courses?: Course

  @Field(() => User, {nullable: true})
  sa_users?: User
}





@ObjectType()
export class UserFeadbacks {
  @Field(() => Int, {nullable: false})
  id:number
  @Field(() =>GraphQLDate, {nullable: false})
  created_at:Date

  @Field(() => Int, {nullable: true})
  user_id?:number

  @Field(() => Int, {nullable: true})
  course_id  ?:number

  @Field(() => String, {nullable: true})
  content?:string

  @Field(() => Int, {nullable: true})
  rate?:number

  @Field(() => Course, {nullable: true})
  sa_courses?: Course

  @Field(() => User, {nullable: true})
  sa_users?: User
}




@ObjectType()
export class UserPayment {
  @Field(() => Int, {nullable: false})
  id:number
  @Field(() =>GraphQLDate, {nullable: false})
  created_at:Date

  @Field(() => Int, {nullable: true})
  user_id   ?:number

  @Field(() => Int, {nullable: true})
  course_id?:number
  
  @Field(() => Course, {nullable: true})
  sa_courses?: Course

  @Field(() => User, {nullable: true})
  sa_users?: User
}
