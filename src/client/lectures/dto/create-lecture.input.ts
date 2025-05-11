import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLectureInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
