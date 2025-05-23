import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LecturesService } from './lectures.service';
import { CreateLectureResponse, Lecture } from './entities/lecture.entity';
import { CreateLectureInput } from './dto/create-lecture.input';
import { UpdateLectureInput } from './dto/update-lecture.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/gql-auth.guard';

@Resolver(() => Lecture)
export class LecturesResolver {
  constructor(private readonly lecturesService: LecturesService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => CreateLectureResponse)
  createLecture(@Args('input') createLectureInput: CreateLectureInput) {
    return this.lecturesService.create(createLectureInput);
  }


  // @UseGuards(AuthGuard)
  // @Mutation()
  // generateLectureKey(@Args('id', { type: () => Int }) id: number) {
  //   return this.lecturesService.generateLectureKey(id);
  // }

  @Query(() => [Lecture], { name: 'lectures' })
  findAll() {
    return this.lecturesService.findAll();
  }

  @Query(() => Lecture, { name: 'lecture' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.lecturesService.findOne(id);
  }

  @Mutation(() => Lecture)
  updateLecture(@Args('updateLectureInput') updateLectureInput: UpdateLectureInput) {
    return this.lecturesService.update(updateLectureInput.id, updateLectureInput);
  }

  @Mutation(() => Lecture)
  removeLecture(@Args('id', { type: () => Int }) id: number) {
    return this.lecturesService.remove(id);
  }
}
