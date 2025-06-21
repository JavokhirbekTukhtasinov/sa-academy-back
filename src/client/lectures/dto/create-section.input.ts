import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";





@InputType()
export class CreateSectionInput {
    
    @Field( () => String, {nullable: false} )
    name_en: string;

    @Field( () => String, {nullable: true} )
    name_uz: string;

    @Field( () => String, {nullable: true} )
    name_ru: string;

    @Field( () => Int , {nullable: false} )
    course_id: number


    @Field( () => Int , {nullable: true} )
    order_num?: number

    @Field(() => Boolean, {nullable: true})
    is_hidden?:boolean
}



@ObjectType()
export class CreateSectionResponse {
    @Field(() => String)
    message: string;
    
    @Field(() => Int)
    section_id: number
}