import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateAuthInput {
  @Field(() => ID, { description: 'Example field (placeholder)' })
  email: number;
  
  @Field(() => ID, { description: 'Example field (placeholder)' })
  password: number;

  @Field(() => ID, {description: 'Example field (placeholder)'})
  role: number  
}
