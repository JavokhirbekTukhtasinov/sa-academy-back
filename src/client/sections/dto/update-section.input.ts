import { CreateSectionInput } from './create-section.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSectionInput {
  @Field(() => Int, { nullable: false })
  id: number;

  @Field(() => Int, { nullable: true })
  course_id?: number;

  @Field(() => String, { nullable: true })
  name?: string;

}