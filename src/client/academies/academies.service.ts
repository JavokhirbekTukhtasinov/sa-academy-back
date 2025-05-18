import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAcademyInput, createAcademyInputResponse } from './dto/create-academy.input';
import { UpdateAcademyInput } from './dto/update-academy.input';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class AcademiesService {
  constructor(
    private prisma: PrismaService
  ) {}
  async create(createAcademyInput: CreateAcademyInput):Promise<createAcademyInputResponse> {
    
    try {
      const academy = await this.prisma.sa_academies.create({
        data: {
          name: createAcademyInput.name,
          location: createAcademyInput.location,
          owner_name: createAcademyInput.owner_name,
          phone_number: createAcademyInput.phone_number,
          description: createAcademyInput.description,
          email: createAcademyInput.email,
          amount_of_teachers: createAcademyInput.amount_of_teachers,
          academy_type_id: createAcademyInput.academy_type_id
        }
      })
      if(academy) {
        return {
          message: 'success'
        }
      }
    } catch (error) {
      throw new BadRequestException(error);  
    }
  }


  async getAcademyCategories() {
    try {
      return await this.prisma.sa_categories.findMany();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      return await this.prisma.sa_academies.findMany({
        where: {
          status: 'CONFIRMED'
        }
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
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
