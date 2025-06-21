import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLectureInput } from './dto/create-lecture.input';
import { UpdateLectureInput } from './dto/update-lecture.input';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/utils/upload.service';
import { CreateSectionInput, CreateSectionResponse } from './dto/create-section.input';
import { LectureType } from './enums/lectureType.enum';

@Injectable()
export class LecturesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService
  ) {}
 async create(createLectureInput: CreateLectureInput) {
  try {

      const curriclum = await this.prisma.sa_curriclumes.findFirst({
        where : {
          id: createLectureInput.curriclum_id
        },
        select: {
          section_id: true
        }
      })

      if(!curriclum) {
        throw new BadRequestException('section not found');
      }
    
      
      if(createLectureInput.type === LectureType.ARTICLE) {
        return await this.prisma.sa_lectures.create({
          data: {
            name: createLectureInput.name,
            article: createLectureInput.article,
            curriclum_id: createLectureInput.curriclum_id,
            type: createLectureInput.type
          }
        })
      }else {
      const key = `lectures/videos/${createLectureInput.name}`
      const generatedKey =  await this.uploadService.generateSignedVideoUrl(createLectureInput.name, key);
      const lecture = await this.prisma.sa_lectures.create({
        data: {
          name: createLectureInput.name,
          curriclum_id: createLectureInput.curriclum_id,
          type: createLectureInput.type,
          lecture_main_video: generatedKey.uploadUrl,
        }
      })
      return {
        id: lecture.id,
        key: generatedKey.uploadUrl
      }
    }

  } catch (error) {
    throw new BadRequestException(error);
  }
  }


  async generateLectureKey(id: number) {
    try {
      
    } catch (error) { 
        
    }
  }

  async createSection(createSectionInput: CreateSectionInput): Promise<CreateSectionResponse> {

    try {
      const sectionCount = await this.prisma.sa_sections.count({
        where: {
          course_id: createSectionInput.course_id
        }
      })
      const section = await this.prisma.sa_sections.create({
        data: {
          name_en: createSectionInput.name_en,
          name_uz: createSectionInput.name_uz,
          name_ru: createSectionInput.name_ru,
          order_num: sectionCount + 1,
          course_id: createSectionInput.course_id,
          is_hidden: createSectionInput.is_hidden || false
        }
      })
      return {
        message: 'success',
        section_id: section.id
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
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
