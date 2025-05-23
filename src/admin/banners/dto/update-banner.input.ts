import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CreateBannerInput } from './create-banner.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBannerInput extends PartialType(CreateBannerInput) {
  @Field(() => Int)
  id: number;

  @Field(() => GraphQLUpload, {nullable: true})
  image_desktop: Promise<FileUpload>;

  @Field(() => GraphQLUpload, {nullable: true})
  image_mobile: Promise<FileUpload>;

  @Field(() => String, {nullable: true})
  banner_link: string;

  @Field(() => Boolean, {nullable: true, defaultValue: true})
  open_new_window?:boolean
}
