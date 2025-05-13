import { ObjectType, Field, Int, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { Course } from 'src/client/courses/entities/course.entity';
import { Teacher } from 'src/client/teachers/entities/teacher.entity';
import { registerEnumType } from "@nestjs/graphql";


export enum AcademyStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SUSPENDED = "SUSPENDED"
}

registerEnumType(AcademyStatus, {
  name: "AcademyStatus",
});

@ObjectType()
export class AcademyType {
  @Field(() => Int, {nullable: true})
  id?:number
  @Field(() => GraphQLISODateTime, {nullable: true,})
  created_at?:Date
  
  @Field(() => String, {nullable: false, description: 'Academy type name'})
  name:string

  @Field( () => [Academy], { nullable: true } )
  sa_academies: Academy[]
}



@ObjectType()
export class Academy {
  @Field(() => Int, {nullable: true})
  id?:number
  @Field(() => GraphQLISODateTime, {nullable: true,})
  created_at?:Date
  
  @Field(() => GraphQLISODateTime, {nullable: false, description: 'Academy name'})
  name:string
  
  @Field(() => String, {nullable: false, description: 'Academy location'})
  location:string
  
  @Field(() => String, {nullable: false, description: 'Academy owner name'})
  owner_name:string
  
  @Field(() => String, {nullable: false, description: 'Academy phone number'})
  phone_number:string
  
  @Field(() => String, {nullable: false, description: 'Academy description'})
  description:string
  
  @Field(() => String, {nullable: false, description: 'Academy email'})
  email:string
  
  // @Field(() => String, {nullable: true, description: 'Academy password'})
  // password?:string
  
  @Field(() => Int, {nullable: false, description: 'Academy amount of teachers'})
  amount_of_teachers?:number
  
  @Field(() => Int, {nullable: false, description: 'Academy amount of students'})
  academy_type_id:number

  @Field(() => AcademyStatus, {nullable: true, description: 'Academy status'}) 
  status?: AcademyStatus
  
  @Field( () => AcademyType, { nullable: true } )
  sa_academy_types?: AcademyType

  @Field( () => [AcademyFile], { nullable: true } )
  sa_academy_files?: AcademyFile[]


  @Field( () => [AcademyImage], { nullable: true } )
  sa_academy_images?: AcademyImage[]

  @Field( () => [Course], { nullable: true } )
  sa_courses?: Course[]

  @Field( () => [Teacher], { nullable: true } )
  sa_teachers?:Teacher[]
}






@ObjectType()
export class AcademyFile {
  @Field( () => Int, { nullable: false })
  id: number

  @Field( () => GraphQLISODateTime ,{ nullable: false })
  created_at: Date

  @Field()
  file_name:number

  @Field()
  file_url:string
  
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  is_hidden?:boolean

  @Field(() => Int, { nullable: true })
  academy_id?:number

  @Field( () => Academy, { nullable: true } )
  sa_academies: Academy
}




@ObjectType()
export class AcademyImage {
  @Field( () => Int, { nullable: false })
  id: number

  @Field( () => GraphQLISODateTime ,{ nullable: false })
  created_at: Date

  @Field()
  file_name:string
  

  @Field()
  image_url:string


  @Field(() => Boolean, { nullable: true, defaultValue: false })
  is_main?:boolean

  @Field(() => Int, { nullable: true })
  academy_id?:number

  @Field( () => Academy, { nullable: true } )
  sa_academies: Academy
}


@InputType()
export class CreateAcademyInput {
  @Field(() => String, {nullable: false, description: 'Academy name'})
  name:string
  
  @Field(() => String, {nullable: false, description: 'Academy location'})
  location:string
  
  @Field(() => String, {nullable: false, description: 'Academy owner name'})
  owner_name:string
  
  @Field(() => String, {nullable: false, description: 'Academy phone number'})
  phone_number:string
  
  @Field(() => String, {nullable: false, description: 'Academy description'})
  description:string
  
  @Field(() => String, {nullable: false, description: 'Academy email'})
  email:string
  
  // @Field(() => String, {nullable: true, description: 'Academy password'})
  // password?:string
  
  @Field(() => Int, {nullable: false, description: 'Academy amount of teachers'})
  amount_of_teachers?:number
  
  @Field(() => Int, {nullable: false, description: 'Academy amount of students'})
  academy_type_id:number
}