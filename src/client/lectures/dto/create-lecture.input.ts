import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';

@InputType()
export class CreateLectureInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Int)
  course_id: number;

  @Field(() => String, { nullable: true }) // Wasabi key
  video_key?: string;

  @Field(() => [Int], { nullable: true }) // Attachment IDs
  attachmentIds?: number[];
}



@ObjectType()
export class Lecture {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  videoKey?: string;

  @Field(() => [Attachment], { nullable: true })
  attachments?: Attachment[];
}







@ObjectType({description: 'lectures attachements'})
export class Attachment {
  @Field(() => Int)
  id: number;
  
  @Field(() => GraphQLDate)
  created_at: Date
  
  @Field()
  file_name: string

  @Field()
  file_url: string

  @Field(() => Int)
  lecture_id:number
}