import { CreateLectureInput } from './dto/create-lecture.input';
import { UpdateLectureInput } from './dto/update-lecture.input';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/utils/upload.service';
export declare class LecturesService {
    private readonly prisma;
    private readonly uploadService;
    constructor(prisma: PrismaService, uploadService: UploadService);
    create(createLectureInput: CreateLectureInput): Promise<{
        id: number;
        key: string;
    }>;
    generateLectureKey(id: number): Promise<void>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateLectureInput: UpdateLectureInput): string;
    remove(id: number): string;
}
