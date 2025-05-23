import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLectureInput } from './dto/create-lecture.input';
import { UpdateLectureInput } from './dto/update-lecture.input';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/utils/upload.service';

@Injectable()
export class LecturesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService
  ) {}
 async create(createLectureInput: CreateLectureInput) {
  try {
    console.log(createLectureInput)
      const course = await this.prisma.sa_courses.findFirst({
        where : {
          id: createLectureInput.course_id
        }
      })

      if(!course) {
        throw new BadRequestException('Course not found');
      }
      
      const key = `lectures/videos/${createLectureInput.name}`
      const generatedKey =  await this.uploadService.generateSignedVideoUrl(createLectureInput.name, key);
      const lecture = await this.prisma.sa_lectures.create({
        data: {
          name: createLectureInput.name,
          course_id: createLectureInput.course_id,
          lecture_main_video: generatedKey.uploadUrl
        }
      })
      return {
        id: lecture.id,
        key: generatedKey.uploadUrl
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
