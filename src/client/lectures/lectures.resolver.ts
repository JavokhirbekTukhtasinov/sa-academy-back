import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LecturesService } from './lectures.service';
import { Lecture } from './entities/lecture.entity';
import { CreateLectureInput } from './dto/create-lecture.input';
import { UpdateLectureInput } from './dto/update-lecture.input';

@Resolver(() => Lecture)
export class LecturesResolver {
  constructor(private readonly lecturesService: LecturesService) {}

  @Mutation(() => Lecture)
  createLecture(@Args('createLectureInput') createLectureInput: CreateLectureInput) {
    return this.lecturesService.create(createLectureInput);
  }

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
