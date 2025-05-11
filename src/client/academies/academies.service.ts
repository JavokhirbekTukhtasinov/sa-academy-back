import { Injectable } from '@nestjs/common';
import { CreateAcademyInput } from './dto/create-academy.input';
import { UpdateAcademyInput } from './dto/update-academy.input';

@Injectable()
export class AcademiesService {
  create(createAcademyInput: CreateAcademyInput) {
    return 'This action adds a new academy';
  }

  findAll() {
    return `This action returns all academies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} academy`;
  }

  update(id: number, updateAcademyInput: UpdateAcademyInput) {
    return `This action updates a #${id} academy`;
  }

  remove(id: number) {
    return `This action removes a #${id} academy`;
  }
}
