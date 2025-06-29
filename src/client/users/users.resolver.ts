import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserCourses, UserFeadbacks, UserPayment } from './entities/user.entity';
import { CoursesService } from '../courses/courses.service';
import { Course } from '../courses/entities/course.entity';
import { CurrentUser } from '../decorators/current-user.decorator';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/gql-auth.guard';
import { CurrentUserProps } from '../entities/common.entities';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService, private readonly coursesService: CoursesService) {}

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

@UseGuards(AuthGuard)
@Mutation(() => Boolean)
addToCart(@CurrentUser() user: CurrentUserProps, @Args('courseId', { type: () => Int }) courseId: number) {
  return  this.usersService.addToCart(user, courseId);
}

@UseGuards(AuthGuard)
@Mutation(() => Boolean)
removeFromCart(@CurrentUser() user: CurrentUserProps, @Args('cartId', { type: () => Int }) cartId: number) {
  return this.usersService.removeFromCart(user, cartId);
}

@UseGuards(AuthGuard)
@Query(() => [Course], { name: 'getUserCart' })
getUserCart(@CurrentUser() user: CurrentUserProps) {
  return this.usersService.getUserCart(user);
}

@UseGuards(AuthGuard)
@Query(() => [Course], { name: 'getUserLikedCourses' })
getUserLikedCourses(@CurrentUser() user: CurrentUserProps) {
  return this.usersService.getUserLikedCourses(user.id);
}

@UseGuards(AuthGuard)
@Query(() => [UserFeadbacks], { name: 'getUserFeadbacks' })
getUserFeadbacks(@CurrentUser() user: CurrentUserProps) {
  return this.usersService.getUserFeadbacks(user.id);
}

@UseGuards(AuthGuard)
@Query(() => [UserPayment], { name: 'getUserPayments' })
getUserPayments(@CurrentUser() user: CurrentUserProps) {
  return this.usersService.getUserPayments(user.id);
}

  @UseGuards(AuthGuard)
  @Query(() => [Course], { name: 'myCourses' })
  myCourses(@CurrentUser() user: CurrentUserProps) {
    return this.coursesService.getUserEnrollments(user);
  }
}
