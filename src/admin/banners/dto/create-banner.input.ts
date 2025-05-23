import { InputType, Int, Field } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateBannerInput {

  @Field(() => GraphQLUpload, {nullable: false})
  image_desktop: Promise<FileUpload>;

  @Field(() => GraphQLUpload, {nullable: false})
  image_mobile: Promise<FileUpload>;

  @Field(() => String, {nullable: false})
  banner_link: string;

  @Field(() => Boolean, {nullable: true, defaultValue: true})
  open_new_window?:boolean
}
