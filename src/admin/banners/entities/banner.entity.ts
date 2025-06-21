import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';
import { Admin } from 'src/admin/dtos/admin.entity';

@ObjectType()
export class Banner {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  id: number

  @Field(() => String, {nullable: true})
  banner_link?:string

  @Field(() => Boolean, {nullable: true})
  open_new_window?:boolean


  @Field(() => Int, {nullable: true})
  created_by?:number

  @Field(() => String, {nullable: true})
  image_mobile?:string


  @Field(() => String, {nullable: true})
  image_desktop?:string
   
    @Field(() => GraphQLDate, {nullable: false})
    created_at:Date

  @Field(() => Admin, {nullable: true})
  sa_admins?: Admin

}