import { Field, Int, ObjectType } from "@nestjs/graphql";
import { GraphQLDate } from "graphql-scalars";
import { Course } from "../courses/entities/course.entity";
import { Academy } from "../academies/entities/academy.entity";



@ObjectType()
export class Category {

    @Field(() => Int, { nullable: false })
    id:number

    @Field(() => GraphQLDate, { nullable: false })
    created_at: Date

    @Field(() => String, { nullable: false })
    name: string

    @Field(() => [SubCategory], { nullable: true })


    @Field(() => [SubCategory], { nullable: true })
    sa_sub_categories?: SubCategory[]

    @Field(() => [Course], { nullable: true })
    sa_courses?: Course[]

    @Field(() => [Academy], { nullable: true })
    sa_academies?: Academy
}



@ObjectType()
export class SubCategory {
    @Field(() => Int, { nullable: false })
    id:number

    @Field(() => GraphQLDate, { nullable: false })
    created_at: Date


    @Field(() => String, { nullable: false })
    name            :string


    @Field(() => Int, { nullable: true })
    parent_type_id?:number

    @Field(() => Category, { nullable: true })
    sa_categories?: Category 
}