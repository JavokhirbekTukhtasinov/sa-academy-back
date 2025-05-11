import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Teacher {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
