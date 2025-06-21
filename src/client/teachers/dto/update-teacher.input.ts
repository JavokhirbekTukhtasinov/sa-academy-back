import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CreateTeacherInput } from './create-teacher.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class UpdateTeacherInput extends PartialType(CreateTeacherInput) {
  @Field(() => Int)
  id: number;



  @Field(() => String, { nullable: true, description: 'First name' })
  @IsString()
  @IsOptional()
  first_name?: string;

  @Field(() => String, { nullable: true, description: 'Last name' })
  @IsString()
  @IsOptional()
  last_name?: string;

  // @Field(() => String, { nullable: true })
  // full_name?: string;

  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

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

  @Field(() => GraphQLUpload, { nullable: true })
  image?: Promise<FileUpload>;

}
