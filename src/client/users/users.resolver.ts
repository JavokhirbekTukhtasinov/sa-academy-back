import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserCourses, UserFeadbacks, UserPayment } from './entities/user.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

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

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  @Query(() => [UserCourses], { name: 'getUserLikedCourses' })
  getUserLikedCourses(@Args('userId', { type: () => Int }) userId: number) {
    return this.usersService.getUserLikedCourses(userId);
  }

  @Query(() => [UserFeadbacks], { name: 'getUserFeadbacks' })
  getUserFeadbacks(@Args('userId', { type: () => Int }) userId: number) {
    return this.usersService.getUserFeadbacks(userId);
  }

  @Query(() => [UserPayment], { name: 'getUserPayments' })
  getUserPayments(@Args('userId', { type: () => Int }) userId: number) {
    return this.usersService.getUserPayments(userId);
  }
}
