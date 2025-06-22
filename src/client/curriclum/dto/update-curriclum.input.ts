import { CreateCurriclumInput } from './create-curriclum.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCurriclumInput extends PartialType(CreateCurriclumInput) {
  @Field(() => Int, { nullable: false })
  id: number;
}
