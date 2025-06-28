import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UploadTeacherFileInput {
  @Field(() => String)
  @IsString()
  fileName: string;

  @Field(() => String)
  @IsString()
  fileUrl: string;
} 