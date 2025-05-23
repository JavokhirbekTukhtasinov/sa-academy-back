import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Course, PaginatedCourses } from './entities/course.entity';
import { CreateCourseInput, CreateCourseResponse } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/gql-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/oles.decorator';
import { Category, CurrentUserProps, SubCategory } from '../entities/common.entities';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

 @UseGuards(AuthGuard)
  @Mutation(() => CreateCourseResponse)
  createCourse(@CurrentUser() user:any, @Args('createCourseInput') createCourseInput: CreateCourseInput) {
    return this.coursesService.create(createCourseInput, user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Query(() => PaginatedCourses)
  @Roles('TEACHER')
  getTeacherCourses(@CurrentUser() user: CurrentUserProps, @Args('page', { type: () => Int, nullable: true }) page: number, @Args('perPage', { type: () => Int, nullable: true }) perPage: number, @Args('search', { type: () => String , nullable: true}) search: string) {
    return this.coursesService.findTeacherCourses(user, page, perPage, search);
  }

  @Query(() => Course, { name: 'course' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.coursesService.findOne(id);
  }

 @Query(() => [Category], { name: 'categories' })
  getCategories() {
    return this.coursesService.getCategories();
 }


@Query(() =>[SubCategory], { name: 'subCategories' })
  getSubCategories(@Args('id', { type: () => Int, nullable: true }) id: number) {
    return this.coursesService.getSubCategories(id);
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
