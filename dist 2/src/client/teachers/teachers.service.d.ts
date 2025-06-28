import { CreateTeacherInput, CreateTeacherResponse } from './dto/create-teacher.input';
import { UpdateTeacherInput } from './dto/update-teacher.input';
import { UpdateTeacherSettingsInput } from './dto/update-teacher-settings.input';
import { UploadTeacherFileInput } from './dto/upload-teacher-file.input';
import { TeacherSettings } from './entities/teacher-settings.entity';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/utils/upload.service';
import { CurrentUserProps } from '../entities/common.entities';
export declare class TeachersService {
    private prisma;
    private uploadService;
    constructor(prisma: PrismaService, uploadService: UploadService);
    create(_user: CurrentUserProps, createTeacherInput: CreateTeacherInput): Promise<CreateTeacherResponse>;
    getTeacherSettings(user: CurrentUserProps): Promise<TeacherSettings>;
    updateTeacherSettings(user: CurrentUserProps, updateTeacherSettingsInput: UpdateTeacherSettingsInput): Promise<TeacherSettings>;
    uploadTeacherFile(user: CurrentUserProps, uploadTeacherFileInput: UploadTeacherFileInput): Promise<TeacherSettings>;
    deleteTeacherFile(user: CurrentUserProps, fileId: number): Promise<TeacherSettings>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTeacherInput: UpdateTeacherInput): string;
    remove(id: number): string;
}
