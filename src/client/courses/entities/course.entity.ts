import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { GraphQLTime } from 'graphql-scalars';
import { Academy } from 'src/client/academies/entities/academy.entity';
import { Category, PaginationMeta } from 'src/client/entities/common.entities';
import { Lecture } from 'src/client/lectures/entities/lecture.entity';
import { Teacher } from 'src/client/teachers/entities/teacher.entity';
import { User, UserCourses, UserFeadbacks, UserPayment } from 'src/client/users/entities/user.entity';
import { Section } from 'src/client/sections/entities/section.entity';

@ObjectType()
export class Course {
  @Field(() => Int, { nullable: false })
  id:number

  
  @Field(() => GraphQLTime, { nullable: true })
  created_at: Date
  @Field(() => String, { nullable: false })
  course_name: string
  
  @Field(() => Number, { nullable: true })
  real_price: number
  
  @Field(() => Number, { nullable: true })
  sale_price: number
  
  @Field(() => Int, { nullable: true })
  teacher_id?:number
  
  @Field(() => Int, { nullable: true }) 
  user_id?:number

  @Field(() => String, { nullable: true })
  thumbnail?: string


  @Field(() => Int, { nullable: true })
  academiy_id?:number

  @Field(() => Int, { nullable: true })
  category_id?:number
  
  @Field(() => Boolean, { nullable: true })
  is_live?: boolean;

  @Field(() => Int, { nullable: true })
  parent_id?: number;

  @Field(() => String, { nullable: true })
  what_student_learn?: string;

  @Field(() => String, { nullable: true })
  requirements?: string;

  @Field(() => String, { nullable: true })
  course_target_level?: string;

  @Field(() => String, { nullable: true })
  subtitle?: string;

  @Field(() => CourseStatus, { nullable: false })
  status: CourseStatus

  @Field(() => Academy, { nullable: true })
  sa_academies?: Academy
  
  @Field(() => Category, { nullable: true })
  sa_categories?: Category

  @Field(() => Teacher, { nullable: true })
  sa_teachers?: Teacher

  @Field(() => User, { nullable: true })
  sa_users?: User

  @Field(() => Lecture, { nullable: true })
  sa_lectures?:Lecture[]

  @Field(() => [UserCourses], { nullable: true })
  sa_user_courses?:UserCourses[]

  @Field(() => [UserFeadbacks], { nullable: true })
  sa_user_feadbacks?:UserFeadbacks[]

  @Field(() => [UserPayment], { nullable: true })
  sa_user_payments?:UserPayment[]

  @Field(() => [Section], { nullable: true })
  sa_sections?: Section[]

  @Field(() => String, { nullable: true })
  reviewFeedback?: string;

  @Field(() => Date, { nullable: true })
  lastReviewedAt?: Date;

  @Field(() => Date, { nullable: true })
  publishedAt?: Date;

  @Field(() => String, { nullable: true })
  pendingChanges?: string;
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
  PENDING_REVIEW = "PENDING_REVIEW",
  PUBLISHED = "PUBLISHED",  
  REJECTED = "REJECTED",
  UPDATE_PENDING_REVIEW = "UPDATE_PENDING_REVIEW",

}

registerEnumType(CourseStatus, {
  name: "CourseStatus",
});



export enum CourseLevelTarget {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  ALL = "ALL",
}

registerEnumType(CourseLevelTarget, {
  name: "CourseLevelTarget",
});