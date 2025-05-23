import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Lecture {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}



@ObjectType()
export class CreateLectureResponse {
  @Field(() => Int, {description: 'lecture id'})
  id: number

  @Field( () => ID, {nullable: true})
  key?: string
}