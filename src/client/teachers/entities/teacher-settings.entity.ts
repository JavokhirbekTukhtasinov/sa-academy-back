import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Academy } from '../../academies/entities/academy.entity';

@ObjectType()
export class TeacherUser {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

  @Field(() => String, { nullable: true })
  full_name?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;
}

@ObjectType()
export class TeacherFile {
  @Field(() => Int)
  id: number;

  @Field(() => Date)
  created_at: Date;

  @Field(() => String, { nullable: true })
  file_name?: string;

  @Field(() => String, { nullable: true })
  file_url?: string;

  @Field(() => Int, { nullable: true })
  teacher_id?: number;
}

@ObjectType()
export class TeacherSettings {
  @Field(() => Int)
  id: number;

  @Field(() => Date)
  created_at: Date;

  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  full_name?: string;

  @Field(() => Int, { nullable: true })
  academy_id?: number;

  @Field(() => String, { nullable: true })
  image?: string;

  @Field(() => Int, { nullable: true })
  user_id?: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  headline?: string;

  @Field(() => String, { nullable: true })
  website_url?: string;

  @Field(() => String, { nullable: true })
  instagram_url?: string;

  @Field(() => String, { nullable: true })
  facebook_url?: string;

  @Field(() => String, { nullable: true })
  youtube_url?: string;

  @Field(() => [TeacherFile], { nullable: true })
  sa_teacher_files?: TeacherFile[];

  @Field(() => Academy, { nullable: true })
  sa_academies?: Academy;

  @Field(() => TeacherUser, { nullable: true })
  sa_users?: TeacherUser;
} 