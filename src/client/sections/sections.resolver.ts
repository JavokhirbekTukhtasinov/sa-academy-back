import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SectionsService } from './sections.service';
import { Section } from './entities/section.entity';
import { CreateSectionInput } from './dto/create-section.input';
import { UpdateSectionInput } from './dto/update-section.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/gql-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Section)
export class SectionsResolver {
  constructor(private readonly sectionsService: SectionsService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Section)
  createSection(@CurrentUser() user: User, @Args('createSectionInput') createSectionInput: CreateSectionInput) {
    return this.sectionsService.create(createSectionInput, user);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Section], { name: 'getSections' })
  findAll(@CurrentUser() user: User) {
    return this.sectionsService.findAll(user);
  }

  @UseGuards(AuthGuard)
  @Query(() => Section, { name: 'getSection' })
  findOne(@CurrentUser() user: User, @Args('id', { type: () => Int }) id: number) {
    return this.sectionsService.findOne(id, user);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Section], { name: 'getSectionsByCourse' })
  findByCourseId(@CurrentUser() user: User, @Args('courseId', { type: () => Int }) courseId: number) {
    return this.sectionsService.findByCourseId(courseId, user);
  }


  @UseGuards(AuthGuard)
  @Mutation(() => Section)
  updateSection(@CurrentUser() user: User, @Args('updateSectionInput') updateSectionInput: UpdateSectionInput) {
    return this.sectionsService.update(updateSectionInput.id, updateSectionInput, user);
  }

  @UseGuards(AuthGuard)
    @Mutation(() => Section)
  removeSection(@CurrentUser() user: User, @Args('id', { type: () => Int }) id: number) {
    return this.sectionsService.remove(id, user);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  changeSectionOrder(
    @CurrentUser() user: User,
    @Args('courseId', { type: () => Int }) courseId: number,
    @Args({ name: 'sectionIds', type: () => [Int] }) sectionIds: number[]
  ) {
    return this.sectionsService.changeSectionOrder(courseId, sectionIds, user);
  }
} 