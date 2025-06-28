import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Course, PaginatedCourses } from './entities/course.entity';
import { CreateCourseInput, CreateCourseResponse } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { EnrollCourseInput } from './dto/enroll-course.input';
import { EnrollmentResponse } from './dto/enrollment-response';
import { UserEnrollment } from './entities/enrollment.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/gql-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Category, CurrentUserProps, SubCategory } from '../entities/common.entities';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

 @UseGuards(AuthGuard)
  @Mutation(() => CreateCourseResponse)
  createCourse(@CurrentUser() user:any, @Args('createCourseInput') createCourseInput: CreateCourseInput) {
    return this.coursesService.create(createCourseInput, user);
  }


  @Query(() => Course, { name: 'course' })
  findOneByUserId(@Args('id', { type: () => Int }) id: number) {
    return this.coursesService.findOneByUserId(id);
  }

  @Query(() => Course, { name: 'course' })
  getOneByCourseId(@Args('id', { type: () => Int }) id: number) {
    return this.coursesService.findOneByCourseId(id);
  }


  @Query(() => PaginatedCourses, { name: 'getConfirmedCourses' , description: 'Get confirmed courses for all users' })
  getConfirmedCourses(@Args('page', { type: () => Int, nullable: true }) page: number, @Args('perPage', { type: () => Int, nullable: true }) perPage: number, @Args('search', { type: () => String , nullable: true}) search: string, @Args('categoryId', { type: () => Int, nullable: true }) categoryId: number, @Args('subCategoryId', { type: () => Int, nullable: true }) subCategoryId: number, @Args('teacherId', { type: () => Int, nullable: true }) teacherId: number) { 
    return this.coursesService.getConfirmedCourses(page, perPage, search, categoryId, subCategoryId, teacherId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => EnrollmentResponse, { name: 'enrollInCourse', description: 'Enroll user in a course' })
  enrollInCourse(@CurrentUser() user: CurrentUserProps, @Args('enrollCourseInput') enrollCourseInput: EnrollCourseInput) {
    return this.coursesService.enrollInCourse(user, enrollCourseInput);
  }


  @UseGuards(AuthGuard)
  @Query(() => [UserEnrollment], { name: 'getUserEnrollments', description: 'Get all enrollments for the current user' })
  getUserEnrollments(
    @CurrentUser() user: CurrentUserProps, 
    @Args('page', { type: () => Int, nullable: true }) page: number,
    @Args('perPage', { type: () => Int, nullable: true }) perPage: number
  ) {
    return this.coursesService.getUserEnrollments(user, page, perPage);
  }

  @UseGuards(AuthGuard)
  @Query(() => Boolean, { name: 'checkEnrollmentStatus', description: 'Check if user is enrolled in a specific course' })
  checkEnrollmentStatus(@CurrentUser() user: CurrentUserProps, @Args('courseId', { type: () => Int }) courseId: number) {
    return this.coursesService.checkEnrollmentStatus(user, courseId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => EnrollmentResponse, { name: 'unenrollFromCourse', description: 'Unenroll user from a course' })
  unenrollFromCourse(@CurrentUser() user: CurrentUserProps, @Args('courseId', { type: () => Int }) courseId: number) {
    return this.coursesService.unenrollFromCourse(user, courseId);
  }


  @UseGuards(AuthGuard)
  @Query(() => PaginatedCourses)
  getTeacherCourses(@CurrentUser() user: CurrentUserProps, @Args('page', { type: () => Int, nullable: true }) page: number, @Args('perPage', { type: () => Int, nullable: true }) perPage: number, @Args('search', { type: () => String , nullable: true}) search: string) {
    return this.coursesService.findTeacherCourses(user, page, perPage, search);
  }

  @Query(() => [Category], { name: 'categories' })
  getCategories() {
    return this.coursesService.getCategories();
 }


 @Query(() =>[SubCategory], { name: 'subCategories' })
  getSubCategories(@Args('id', { type: () => Int, nullable: true }) id: number) {
    return this.coursesService.getSubCategories(id);
 }

  @UseGuards(AuthGuard)
  @Mutation(() => Course)
  updateCourse(@CurrentUser() user: CurrentUserProps, @Args('updateCourseInput') updateCourseInput: UpdateCourseInput) {
    return this.coursesService.update(updateCourseInput.id, updateCourseInput, user);
  }

  @UseGuards(AuthGuard)
  @Query(() => String, { name: 'generateSignedUrl', description: 'Generate signed URL for course thumbnail upload' })
  generateSignedUrl(@Args('fileName', { type: () => String }) fileName: string) {
    return this.coursesService.generateSignedUrl(fileName);
  }


  @UseGuards(AuthGuard)
  @Mutation(() => Course)
  removeCourse(@Args('id', { type: () => Int }) id: number) {
    return this.coursesService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Course)
  submitCourseForReview(@CurrentUser() user: CurrentUserProps, @Args('courseId', { type: () => Int }) courseId: number) {
    return this.coursesService.submitCourseForReview(courseId, user);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Course)
  adminReviewCourse(
    @CurrentUser() user: CurrentUserProps,
    @Args('courseId', { type: () => Int }) courseId: number,
    @Args('approved', { type: () => Boolean }) approved: boolean,
    @Args('feedback', { type: () => String, nullable: true }) feedback?: string,
  ) {
    return this.coursesService.adminReviewCourse(courseId, approved, feedback, user);
  }
}
