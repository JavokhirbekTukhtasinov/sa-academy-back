import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Course {
  @Field(() => Int, { nullable: false })
  id:number
}
