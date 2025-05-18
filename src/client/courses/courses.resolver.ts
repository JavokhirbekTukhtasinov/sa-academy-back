import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CreateCourseInput, CreateCourseResponse } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/gql-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/oles.decorator';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Mutation(() => CreateCourseResponse)
  createCourse(@Args('createCourseInput') createCourseInput: CreateCourseInput) {
    return this.coursesService.create(createCourseInput);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Course], { name: 'courses' })
  // @Roles('TEACHER')
  getTeacherCourses(@CurrentUser() user: any) {
    return this.coursesService.findTeacherCourses();
  }

  @Query(() => Course, { name: 'course' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.coursesService.findOne(id);
  }

  @Mutation(() => Course)
  updateCourse(@Args('updateCourseInput') updateCourseInput: UpdateCourseInput) {
    return this.coursesService.update(updateCourseInput.id, updateCourseInput);
  }

  @Mutation(() => Course)
  removeCourse(@Args('id', { type: () => Int }) id: number) {
    return this.coursesService.remove(id);
  }
}
