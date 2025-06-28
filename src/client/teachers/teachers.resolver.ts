import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TeachersService } from './teachers.service';
import { Teacher } from './entities/teacher.entity';
import { TeacherSettings } from './entities/teacher-settings.entity';
import { CreateTeacherInput, CreateTeacherResponse } from './dto/create-teacher.input';
import { UpdateTeacherInput } from './dto/update-teacher.input';
import { UpdateTeacherSettingsInput } from './dto/update-teacher-settings.input';
import { UploadTeacherFileInput } from './dto/upload-teacher-file.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/gql-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CurrentUserProps } from '../entities/common.entities';

@Resolver(() => Teacher)
export class TeachersResolver {
  constructor(private readonly teachersService: TeachersService) {}


  @UseGuards(AuthGuard)
  @Mutation(() => CreateTeacherResponse)
  createTeacher(@CurrentUser() user: CurrentUserProps, @Args('createTeacherInput') createTeacherInput: CreateTeacherInput) {
    return this.teachersService.create(user, createTeacherInput);
  }

  @UseGuards(AuthGuard)
  @Query(() => TeacherSettings, { name: 'getTeacherSettings' })
  getTeacherSettings(@CurrentUser() user: CurrentUserProps) {
    return this.teachersService.getTeacherSettings(user);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => TeacherSettings, { name: 'updateTeacherSettings' })
  updateTeacherSettings(
    @CurrentUser() user: CurrentUserProps, 
    @Args('updateTeacherSettingsInput') updateTeacherSettingsInput: UpdateTeacherSettingsInput
  ) {
    return this.teachersService.updateTeacherSettings(user, updateTeacherSettingsInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => TeacherSettings, { name: 'uploadTeacherFile' })
  uploadTeacherFile(
    @CurrentUser() user: CurrentUserProps, 
    @Args('uploadTeacherFileInput') uploadTeacherFileInput: UploadTeacherFileInput
  ) {
    return this.teachersService.uploadTeacherFile(user, uploadTeacherFileInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => TeacherSettings, { name: 'deleteTeacherFile' })
  deleteTeacherFile(
    @CurrentUser() user: CurrentUserProps, 
    @Args('fileId', { type: () => Int }) fileId: number
  ) {
    return this.teachersService.deleteTeacherFile(user, fileId);
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
