import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';
import { LectureType } from '../enums/lectureType.enum';

@InputType()
export class CreateLectureInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Int)
  curriclum_id: number;

  @Field(() => LectureType, { nullable: false })
  type: LectureType;

  @Field(() => String, { nullable: true }) // Wasabi key
  video_key?: string;

  @Field(() => [Int], { nullable: true }) // Attachment IDs
  attachmentIds?: number[];

  @Field(() => String, { nullable: true }) // Attachment IDs
  article?: string;

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