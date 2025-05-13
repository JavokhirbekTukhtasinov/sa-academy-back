import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';
import { Upload } from 'src/scalers/upload.scaler';


@InputType()
export class CreateAcademyInput {
  @Field(() => String, { description: 'Academy name' })
  name: string;

  @Field(() => String, { description: 'Academy location' })
  location: string;

  @Field(() => String, { description: 'Academy owner name' })
  owner_name: string;

  @Field(() => String, { description: 'Academy phone number' })
  phone_number: string;

  @Field(() => String, { description: 'Academy description' })
  description: string;

  @Field(() => String, { description: 'Academy email' })
  email: string;

  @Field(() => Int, { nullable: true, description: 'Number of teachers in the academy' })
  amount_of_teachers?: number;

  @Field(() => Int, { nullable: true, description: 'Academy type ID (FK)' })
  academy_type_id?: number;

  @Field(() => [GraphQLUpload], { nullable: true, description: 'Optional multiple academy images' })
  sa_academy_images?: Promise<(Upload | null)[]>;

  @Field(() => [GraphQLUpload], { nullable: true, description: 'Optional multiple academy files' })
  sa_academy_files?: Promise<(Upload | null)[]>;
}

@ObjectType() 
export class createAcademyInputResponse {
  @Field()
  message: string;
}