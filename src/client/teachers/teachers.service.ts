import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTeacherInput, CreateTeacherResponse } from './dto/create-teacher.input';
import { UpdateTeacherInput } from './dto/update-teacher.input';
import { UpdateTeacherSettingsInput } from './dto/update-teacher-settings.input';
import { UploadTeacherFileInput } from './dto/upload-teacher-file.input';
import { TeacherSettings } from './entities/teacher-settings.entity';
import { PrismaService } from 'src/prisma.service';
import { generatePasswordHash } from 'src/utils/hash';
import { UploadService } from 'src/utils/upload.service';
import { CurrentUserProps } from '../entities/common.entities';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeachersService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService
  ){}
  
  async create(_user:CurrentUserProps, createTeacherInput: CreateTeacherInput): Promise<CreateTeacherResponse> {
    try {

      if(createTeacherInput.is_agree_terms === false) {
        throw new BadRequestException('You must agree to the terms and conditions');
      }

      const user = await this.prisma.sa_users.findFirst({
        where: {
          id: _user.id
        },
        include: {
          sa_teachers: true
        }
      })

      if(user.sa_teachers) {
        throw new BadRequestException('You are already a teacher');
      }

      await this.prisma.sa_teachers.create({
        data: {
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: user.full_name,
          email: user.email,
          user_id: user.id,
          image: user.avatar || null
        }
      })

      return {
        message: 'success'
      }

    } catch (error) {
      console.log(error)
      throw new BadRequestException(error?.message);
    }
  }


  async getTeacherSettings(user: CurrentUserProps): Promise<TeacherSettings> {
    try {
      const teacher = await this.prisma.sa_teachers.findFirst({
        where: {
          user_id: user.id
        },
        include: {
          sa_teacher_files: true,
          sa_academies: true,
          sa_users: true
        }
      });

      if (!teacher) {
        throw new BadRequestException('Teacher not found');
      }

      return teacher as unknown as TeacherSettings;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async updateTeacherSettings(user: CurrentUserProps, updateTeacherSettingsInput: UpdateTeacherSettingsInput): Promise<TeacherSettings> {
    try {
      const teacher = await this.prisma.sa_teachers.findFirst({
        where: {
          user_id: user.id
        }
      });

      if (!teacher) {
        throw new BadRequestException('Teacher not found');
      }

      if (teacher.id !== updateTeacherSettingsInput.id) {
        throw new BadRequestException('You can only update your own settings');
      } 

        
      const data: any = {};
      
      if (updateTeacherSettingsInput.first_name !== undefined) {
        data.first_name = updateTeacherSettingsInput.first_name;
      }
      if (updateTeacherSettingsInput.last_name !== undefined) {
        data.last_name = updateTeacherSettingsInput.last_name;
      }
      if (updateTeacherSettingsInput.full_name !== undefined) {
        data.full_name = updateTeacherSettingsInput.full_name;
      }
      if (updateTeacherSettingsInput.email !== undefined) {
        data.email = updateTeacherSettingsInput.email;
      }
      if (updateTeacherSettingsInput.academy_id !== undefined) {
        data.academy_id = updateTeacherSettingsInput.academy_id;
      }
      if (updateTeacherSettingsInput.image !== undefined) {
        data.image = updateTeacherSettingsInput.image;
      }
      if (updateTeacherSettingsInput.description !== undefined) {
        data.description = updateTeacherSettingsInput.description;
      }
      if (updateTeacherSettingsInput.headline !== undefined) {
        data.headline = updateTeacherSettingsInput.headline;
      }
      if (updateTeacherSettingsInput.website_url !== undefined) {
        data.website_url = updateTeacherSettingsInput.website_url;
      }
      if (updateTeacherSettingsInput.instagram_url !== undefined) {
        data.instagram_url = updateTeacherSettingsInput.instagram_url;
      }
      if (updateTeacherSettingsInput.facebook_url !== undefined) {
        data.facebook_url = updateTeacherSettingsInput.facebook_url;
      }
      if (updateTeacherSettingsInput.youtube_url !== undefined) {
        data.youtube_url = updateTeacherSettingsInput.youtube_url;
      }

      const updatedTeacher = await this.prisma.sa_teachers.update({
        where: {
          id: updateTeacherSettingsInput.id
        },
        data,
        include: {
          sa_teacher_files: true,
          sa_academies: true,
          sa_users: true
        }
      });

      return updatedTeacher as unknown as TeacherSettings; 
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async uploadTeacherFile(user: CurrentUserProps, uploadTeacherFileInput: UploadTeacherFileInput): Promise<TeacherSettings> {
    try {
      const teacher = await this.prisma.sa_teachers.findFirst({
        where: {
          user_id: user.id
        }
      });

      if (!teacher) {
        throw new BadRequestException('Teacher not found');
      }

      await this.prisma.sa_teacher_files.create({
        data: {
          file_name: uploadTeacherFileInput.fileName,
          file_url: uploadTeacherFileInput.fileUrl,
          teacher_id: teacher.id
        }
      });

      const updatedTeacher = await this.prisma.sa_teachers.findFirst({
        where: {
          user_id: user.id
        },
        include: {
          sa_teacher_files: true,
          sa_academies: true,
          sa_users: true
        }
      });

      return updatedTeacher as unknown as TeacherSettings;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async deleteTeacherFile(user: CurrentUserProps, fileId: number): Promise<TeacherSettings> {
    try {
      const teacher = await this.prisma.sa_teachers.findFirst({
        where: {
          user_id: user.id
        }
      });

      if (!teacher) {
        throw new BadRequestException('Teacher not found');
      }

      const teacherFile = await this.prisma.sa_teacher_files.findFirst({
        where: {
          id: fileId,
          teacher_id: teacher.id
        }
      });

      if (!teacherFile) {
        throw new BadRequestException('File not found or you do not have permission to delete it');
      }

      await this.prisma.sa_teacher_files.delete({
        where: {
          id: fileId
        }
      });

      const updatedTeacher = await this.prisma.sa_teachers.findFirst({
        where: {
          user_id: user.id
        },
        include: {
          sa_teacher_files: true,
          sa_academies: true,
          sa_users: true
        }
      });

      return updatedTeacher as unknown as TeacherSettings;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      const teachers = await this.prisma.sa_teachers.findMany({
        include: {
          sa_teacher_files: true,
          sa_academies: true,
          sa_users: true,
          sa_courses: true,
        }
      });
      return teachers as unknown as Teacher[];
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  async update(user: CurrentUserProps, updateTeacherInput: UpdateTeacherInput) {
    try {
      const teacher = await this.prisma.sa_teachers.findFirst({
        where: {
          user_id: user.id
        }
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }
}
