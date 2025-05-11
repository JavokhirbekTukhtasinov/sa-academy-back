import { Injectable } from '@nestjs/common';
import { CreateTeacherInput } from './dto/create-teacher.input';
import { UpdateTeacherInput } from './dto/update-teacher.input';

@Injectable()
export class TeachersService {
  create(createTeacherInput: CreateTeacherInput) {
    return 'This action adds a new teacher';
  }

  findAll() {
    return `This action returns all teachers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  update(id: number, updateTeacherInput: UpdateTeacherInput) {
    return `This action updates a #${id} teacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }
}
