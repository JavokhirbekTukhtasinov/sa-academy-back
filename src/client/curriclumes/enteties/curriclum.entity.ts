import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { GraphQLDate } from "graphql-scalars";
import { Lecture } from "src/client/lectures/entities/lecture.entity";
import { CurriclumType } from "../enums/curruclumTypes.enum";

@ObjectType()
export class Curriclum {
    @Field(() => Int)
    id: number;
    @Field( () => String)
    title: string;

    @Field( () => CurriclumType)
    type: CurriclumType;

    @Field( () => GraphQLDate)
    created_at: Date

    @Field( () => [Lecture], {nullable: true})
    sa_lectures?: Lecture[]

}