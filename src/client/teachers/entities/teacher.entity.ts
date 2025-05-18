import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Academy } from 'src/client/academies/entities/academy.entity';

@ObjectType()
export class Teacher {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  id:number
  @Field(() => GraphQLISODateTime, { description: 'Example field (placeholder)' })
  created_at: Date

  @Field(() => String, { description: 'Example field (placeholder)' })
  first_name: string

  @Field(() => String, { description: 'Example field (placeholder)' })
  last_name:string

  @Field(() => String, { description: 'Example field (placeholder)' })
  email: string

  @Field(() => String, { nullable: true, description: 'Example field (placeholder)' })
  full_name?:string

  @Field(() => String, { description: 'Example field (placeholder)' })
  is_verified:boolean

  @Field(() => String, { description: 'Example field (placeholder)' })
  otp:string
  @Field(() => Int, { description: 'Example field (placeholder)' })
  academy_id      :number

  @Field(() => String, { description: 'Example field (placeholder)' })
  image:string

  sa_courses:any
  sa_teacher_files: any

  @Field( () => Academy, { nullable: true } )
  sa_academies?: Academy
}

