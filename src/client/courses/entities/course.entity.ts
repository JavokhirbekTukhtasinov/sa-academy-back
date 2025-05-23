import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { GraphQLTime } from 'graphql-scalars';
import { Academy } from 'src/client/academies/entities/academy.entity';
import { Category, PaginationMeta } from 'src/client/entities/common.entities';
import { Lecture } from 'src/client/lectures/entities/lecture.entity';
import { Teacher } from 'src/client/teachers/entities/teacher.entity';
import { User, UserCourses, UserFeadbacks, UserPayment } from 'src/client/users/entities/user.entity';

@ObjectType()
export class Course {
  @Field(() => Int, { nullable: false })
  id:number

  @Field(() => GraphQLTime, { nullable: false })
  created_at: Date
  @Field(() => String, { nullable: false })
  course_name: string
  
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  real_price: number
  
  @Field(() => Int, { nullable: false , defaultValue: 0 })
  sale_price: number
  
  @Field(() => Int, { nullable: true })
  teacher_id?:number
  
  @Field(() => Int, { nullable: true }) 
  user_id           ?:number

  @Field(() => String, { nullable: true })
  thumbnail?: string


  @Field(() => Int, { nullable: true })
  academiy_id ?:number

  @Field(() => Int, { nullable: true })
  category_id   ?:number
  

  @Field(() => Academy, { nullable: true })
  sa_academies?: Academy
  
  @Field(() => Category, { nullable: true })
  sa_categories?: Category

  @Field(() => Teacher, { nullable: true })
  sa_teachers?: Teacher

  @Field(() => User, { nullable: true })
  sa_users?: User

  @Field(() => Lecture, { nullable: true })
  sa_lectures       ?:Lecture[]

  @Field(() => CourseStatus, { nullable: false })
  status: CourseStatus

  @Field(() => [UserCourses], { nullable: true })
  sa_user_courses   ?:UserCourses[]

  @Field(() => [UserFeadbacks], { nullable: true })
  sa_user_feadbacks ?:UserFeadbacks[]

  @Field(() => [UserPayment], { nullable: true })
  sa_user_payments?:UserPayment[]
}



@ObjectType()
export class PaginatedCourses {
  @Field(() => [Course])
  data: Course[];

  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}


export enum CourseStatus {
  DRAFT = "DRAFT",
  SUBMITTED_FOR_REVIEW = "SUBMITTED_FOR_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

registerEnumType(CourseStatus, {
  name: "CourseStatus",
});

