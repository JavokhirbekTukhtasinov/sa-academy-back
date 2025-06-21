import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateCurriculumInput } from "./dtos/create-curriclum.input";
import { Curriclum } from "./enteties/curriclum.entity";




@Injectable()
export class CurriclumService {
  constructor(private readonly prisma: PrismaService) {}

  async createCurriclum(createCurriclumInput: CreateCurriculumInput) {
    try {
      const section = await this.prisma.sa_sections.findFirst({
        where: {
          id: createCurriclumInput.section_id,
        },
      })

      if(!section) {
        throw new BadRequestException('section not found');
      }
      
      return await this.prisma.sa_curriclumes.create({
        data:{
         title: createCurriclumInput.title,
         type: createCurriclumInput.type,
         section_id: createCurriclumInput.section_id,
        }
      })
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
