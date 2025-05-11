import { Injectable } from '@nestjs/common';
import { CreateLectureInput } from './dto/create-lecture.input';
import { UpdateLectureInput } from './dto/update-lecture.input';

@Injectable()
export class LecturesService {
  create(createLectureInput: CreateLectureInput) {
    return 'This action adds a new lecture';
  }

  findAll() {
    return `This action returns all lectures`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lecture`;
  }

  update(id: number, updateLectureInput: UpdateLectureInput) {
    return `This action updates a #${id} lecture`;
  }

  remove(id: number) {
    return `This action removes a #${id} lecture`;
  }
}
