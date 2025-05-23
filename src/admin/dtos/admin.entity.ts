import { Field, Int, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class Admin {
    @Field(() => Int)
    id: number;
}