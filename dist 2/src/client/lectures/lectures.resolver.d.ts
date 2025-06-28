import { LecturesService } from './lectures.service';
import { CreateLectureInput } from './dto/create-lecture.input';
import { UpdateLectureInput } from './dto/update-lecture.input';
export declare class LecturesResolver {
    private readonly lecturesService;
    constructor(lecturesService: LecturesService);
    createLecture(createLectureInput: CreateLectureInput): Promise<{
        id: number;
        key: string;
    }>;
    findAll(): string;
    findOne(id: number): string;
    updateLecture(updateLectureInput: UpdateLectureInput): string;
    removeLecture(id: number): string;
}
