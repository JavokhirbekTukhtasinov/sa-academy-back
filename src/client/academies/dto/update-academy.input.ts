import { CreateAcademyInput } from './create-academy.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAcademyInput extends PartialType(CreateAcademyInput) {
  @Field(() => Int)
  id: number;
}
