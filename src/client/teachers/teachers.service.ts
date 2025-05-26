import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTeacherInput, CreateTeacherResponse } from './dto/create-teacher.input';
import { UpdateTeacherInput } from './dto/update-teacher.input';
import { PrismaService } from 'src/prisma.service';
import { generatePasswordHash } from 'src/utils/hash';
import { UploadService } from 'src/utils/upload.service';

@Injectable()
export class TeachersService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService
  ){}
  
  async create(createTeacherInput: CreateTeacherInput): Promise<CreateTeacherResponse> {
    try {

      const existingTeacher = await this.prisma.sa_teachers.findUnique({
        where: {
          email: createTeacherInput.email
        }
      })

      if(existingTeacher) {
        throw new BadRequestException('Teacher already exists with this email');
      }
      const image  = await this.uploadService.uploadFromGraphQL((await createTeacherInput.image), 'image', `teacher_images/${createTeacherInput.first_name}-${createTeacherInput.last_name}`);

      const password = await generatePasswordHash(createTeacherInput.password);
      const newTeacher = await this.prisma.sa_teachers.create({
        data: {
          first_name: createTeacherInput.first_name,
          last_name: createTeacherInput.last_name,
          full_name: createTeacherInput.full_name,
          email: createTeacherInput.email,
          image: image?.url,
          academy_id: createTeacherInput.academy_id ? Number(createTeacherInput.academy_id) : null,
        }
      })
      if(newTeacher) {
        for(let i = 0; i < (await createTeacherInput.teacher_files).length; i++) {
          const file = await this.uploadService.uploadFromGraphQL((await createTeacherInput.teacher_files[i]), 'file', `teacher_files/teacher-${newTeacher.id}-${i}`);
          await this.prisma.sa_teacher_files.create({
            data: {
              file_url: file?.url,
              teacher_id: newTeacher.id,
            }
          })
        }
         return {
          message: 'success'
        }
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error);
    }
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
