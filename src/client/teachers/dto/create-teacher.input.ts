import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { GraphQLUpload } from 'graphql-upload';
import { Upload } from 'src/scalers/upload.scaler';

@InputType()
export class CreateTeacherInput {

  @Field(() => String, { nullable: false })
  first_name?: string;

  @Field(() => String, { nullable: false })
  last_name?: string;

  @Field(() => String, { nullable: true })
  full_name?: string;

  @Field(() => String, { nullable: false })
  @IsEmail()
  email?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: false })
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => GraphQLUpload, { nullable: false, description: 'Profile image file' })
  image: Promise<File>;

  @Field(() => String, {nullable: true, description: 'Phone number'})
  phone_number?:string

  @Field(() => [GraphQLUpload], { nullable: true, description: 'Optional multiple teacher files' })
  teacher_files?: Promise<(Upload | null)[]>

  @Field(() => String, { nullable: true, description: 'Academy ID as stringified BigInt' })
  academy_id?: string;

}



@ObjectType()
export class CreateTeacherResponse {
  @Field(() => String, { nullable: true })
  message?: string;
}