import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Upload } from 'src/scalers/upload.scaler';

@InputType()
export class CreateTeacherInput {

  @Field(() => String, { nullable: false, description: 'First name' })
  @IsString()
  @IsNotEmpty()
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
  image: Promise<FileUpload>;

  @Field(() => String, {nullable: true, description: 'Phone number'})
  phone_number?:string

  @Field(() => [GraphQLUpload], { nullable: true, description: 'Optional multiple teacher files' })
  teacher_files?: Promise<(FileUpload | null)[]>

  @Field(() => Int, { nullable: true, description: 'Academy ID as stringified BigInt' })
  academy_id?: number;

}



@ObjectType()
export class CreateTeacherResponse {
  @Field(() => String, { nullable: true })
  message?: string;
}