import { TeachersService } from './teachers.service';
import { TeacherSettings } from './entities/teacher-settings.entity';
import { CreateTeacherInput, CreateTeacherResponse } from './dto/create-teacher.input';
import { UpdateTeacherInput } from './dto/update-teacher.input';
import { UpdateTeacherSettingsInput } from './dto/update-teacher-settings.input';
import { UploadTeacherFileInput } from './dto/upload-teacher-file.input';
import { CurrentUserProps } from '../entities/common.entities';
export declare class TeachersResolver {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    createTeacher(user: CurrentUserProps, createTeacherInput: CreateTeacherInput): Promise<CreateTeacherResponse>;
    getTeacherSettings(user: CurrentUserProps): Promise<TeacherSettings>;
    updateTeacherSettings(user: CurrentUserProps, updateTeacherSettingsInput: UpdateTeacherSettingsInput): Promise<TeacherSettings>;
    uploadTeacherFile(user: CurrentUserProps, uploadTeacherFileInput: UploadTeacherFileInput): Promise<TeacherSettings>;
    deleteTeacherFile(user: CurrentUserProps, fileId: number): Promise<TeacherSettings>;
    findAll(): string;
    findOne(id: number): string;
    updateTeacher(updateTeacherInput: UpdateTeacherInput): string;
    removeTeacher(id: number): string;
}
