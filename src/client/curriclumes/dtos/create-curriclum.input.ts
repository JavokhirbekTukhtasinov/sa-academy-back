import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { CurriclumType } from "../enums/curruclumTypes.enum";



@InputType()
export class CreateCurriculumInput {

    @Field( () => Int, {nullable: false} )
    section_id: number
    
    @Field( () => CurriclumType, {nullable: false} )
    type: CurriclumType

    @Field( () => String, {nullable: false} )
    title: string
}