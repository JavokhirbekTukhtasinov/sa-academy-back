import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TeachersService } from './teachers.service';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherInput, CreateTeacherResponse } from './dto/create-teacher.input';
import { UpdateTeacherInput } from './dto/update-teacher.input';

@Resolver(() => Teacher)
export class TeachersResolver {
  constructor(private readonly teachersService: TeachersService) {}

  @Mutation(() => CreateTeacherResponse)
  createTeacher(@Args('createTeacherInput') createTeacherInput: CreateTeacherInput) {
    console.log(createTeacherInput)
    return this.teachersService.create(createTeacherInput);
  }

  @Query(() => [Teacher], { name: 'teachers' })
  findAll() {
    return this.teachersService.findAll();
  }


  @Query(() => Teacher, { name: 'teacher' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.teachersService.findOne(id);
  }

  @Mutation(() => Teacher)
  updateTeacher(@Args('updateTeacherInput') updateTeacherInput: UpdateTeacherInput) {
    return this.teachersService.update(updateTeacherInput.id, updateTeacherInput);
  }

  @Mutation(() => Teacher)
  removeTeacher(@Args('id', { type: () => Int }) id: number) {
    return this.teachersService.remove(id);
  }
}
